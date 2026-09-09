import { type ResultSetHeader } from "mysql2";
import { type event } from "../../contracts/event.ts";
import dbConn, { MOBILE, PUBLICO } from "../../database/connection/database-connection.ts";
 
import { api } from "../../services/api.ts";
import { ProdSetorRepository } from "../product-sector/repository-prod-setor.ts";
import { LogsRepository } from "../logs-integration/logs-repository.ts";

type produtos_enviados = {
        id: number
        id_mobile: number
        codigo_sistema: number
}

type resultProductMobile = {
        codigo: number
        preco: number
        estoque: number
        unidade_medida: string
        descricao: string
        num_fabricante: string
        num_original: string
        sku: string
        grupo: number
        marca: number
        ativo: string
        tipo: number
        class_fiscal: string
        origem: string
        data_cadastro: string
        observacoes1: string
        observacoes2: string
        observacoes3: string
}

type postProductMobile = resultProductMobile 

export async function serviceSendProduct(event: event) {
        //await delay(250)
        let status = {success: true, message:'' , data: null };
        try {
                if (event.tipo_evento === 'DELETE'){
                        console.log(`[V] Excluindo produto ${event.id_registro}`)

                             const [resultVerifyDeleteProduct] = await dbConn.query(`SELECT * FROM ${MOBILE}.produtos_enviados WHERE codigo_sistema = ${event.id_registro};`);
                        const arrVerifyItems = resultVerifyDeleteProduct as produtos_enviados[]
                        if (arrVerifyItems.length > 0) {

                        const result = await deleteProduct(arrVerifyItems[0].id_mobile);
                                 if( result.success){
                   
                                   const [resultStatusDelete] = await dbConn.query(`DELETE FROM ${MOBILE}.produtos_enviados WHERE codigo_sistema = ${event.id_registro};`);
                                        const resultDelete  = resultStatusDelete as ResultSetHeader; 
                                        if(resultDelete.affectedRows > 0 ){
                                                status.success = true  
                                        }else{
                                                status.success = true
                                                status.message =`Ocorreu um erro ao tentar excluir o produto ${event.id_registro}`  
                                        }   
                                
                                    } else{
                                         status.success = true
                                         status.message =result.message  
                                    }        
                          }else{
                                status.success = true
                                status.message =`O produto ${event.id_registro} não foi encontrado na tabela de enviados.`  
                         }

                }else{

                         const sql = ` SELECT  
                               p.CODIGO codigo,  
                               COALESCE(   ROUND(pp.preco,2 ),  0.00 ) as preco,
                               COALESCE( p.GRUPO, 0) as grupo, 
                               p.CONTR_LOTE_SERIE as controle_lote_serie,
                               COALESCE(und.SIGLA,'UND') as unidade_medida,
                               p.DESCRICAO descricao, 
                               COALESCE(p.NUM_FABRICANTE, '') num_fabricante,
                               COALESCE(p.NUM_ORIGINAL ,'') num_original,
                               COALESCE(p.OUTRO_COD, '') sku,
                               COALESCE( p.MARCA, 0) as marca,
                               COALESCE(p.ATIVO, 'S') as  ativo,
                               p.TIPO tipo,
                               COALESCE(cf.NCM , '0000.00.00') as class_fiscal,
                               p.ORIGEM origem,
                               p.CST cst,
                               coalesce(DATE_FORMAT(p.DATA_CADASTRO, '%Y-%m-%d'),'0000-00-00 00:00:00') AS data_cadastro,
                               COALESCE( CONVERT( p.OBSERVACOES1 USING utf8), '')  as observacoes1,
                               COALESCE( CONVERT(p.OBSERVACOES2 USING utf8),'' ) as observacoes2,
                               COALESCE( CONVERT(p.OBSERVACOES3 USING utf8), '') as observacoes3
                               FROM   ${PUBLICO}.cad_prod p 
                                       left join  ${PUBLICO}.prod_tabprecos pp on pp.produto = p.codigo
                                       left join  ${PUBLICO}.tab_precos tp on tp.codigo = pp.tabela
                                       left join  ${PUBLICO}.class_fiscal cf on cf.codigo = p.class_fiscal
                                       left join  ${PUBLICO}.unid_prod und on und.produto = p.CODIGO and und.PADR_SAI = 'S' AND und.PADR_SEP= 'S' 
                               WHERE 
                               p.CODIGO = '${event.id_registro}'
                               AND tp.padrao = 'S'
                               AND p.ativo = 'S'
                               group by  p.CODIGO
                               order by p.CODIGO;  `
                const [result_cad_prod] = await dbConn.query(sql);
                const arrProduct = result_cad_prod as resultProductMobile[]
                const marcaErp = arrProduct[0]?.marca || 0;
                const grupoErp = arrProduct[0]?.grupo || 0;


 

                const [resultVerifyProduct] = await dbConn.query(`SELECT * FROM ${MOBILE}.produtos_enviados WHERE codigo_sistema = '${event.id_registro}';`);
                const arrVerifyItems = resultVerifyProduct as produtos_enviados[]

                if (arrVerifyItems.length > 0    ) {
                        if(arrProduct.length > 0){

                        console.log(` Atualizando  produto ${event.id_registro}...`,)
                        let item = { ...arrProduct[0],  id: String(arrProduct[0].codigo), grupo: Number(grupoErp), marca: Number(marcaErp) } 
                        item.codigo = Number(arrVerifyItems[0].id_mobile);

                        const arrStock = await ProdSetorRepository.findTotalStockProductAndSector(arrProduct[0].codigo);
                        item.estoque = 0
                        if (arrStock.length > 0) item.estoque = arrStock[0].ESTOQUE;

                        item.preco = Number(arrProduct[0].preco);

                        const result = await putProduct(item);
                                if( result.success ){
                                        status.success = true  
                                        console.log(`[V] Produto: ${arrProduct[0].codigo} atualizado com successo!`)

                                }else{
                                        status.success = false  
                                }
                        }else{
                                console.log(`[V] Produto: ${event.id_registro} foi enviado anteriormente mas não foi encontrado no sistema!`)

                        }

                } else {
                        if(  arrProduct.length > 0){
                        //post produto 
                        console.log(` [V] Enviando produto ${event.id_registro}...`,)

                        let item = { ...arrProduct[0], origem:String(arrProduct[0].origem), id:String(arrProduct[0].codigo), grupo: Number(grupoErp), marca: Number(marcaErp) } as postProductMobile
                        const arrStock = await ProdSetorRepository.findStock(arrProduct[0].codigo);
                        item.estoque = 0
                        if (arrStock.length > 0) item.estoque = arrStock[0].ESTOQUE;

                        const result = await postProduct(item);
                                if( result.success && result.data ){
                                        const data = result.data as any
                                        await dbConn.query(`INSERT INTO ${MOBILE}.produtos_enviados set codigo_sistema = ${arrProduct[0].codigo}, id_mobile= ${data.codigo}`);
                                        status.success =true  
                                        console.log(`[V] Produto: ${arrProduct[0].codigo} enviado com successo!`)
                                        }else{
                                        console.log(`[X] Erro ao tentar enviar Produto: ${arrProduct[0].codigo}  ${JSON.stringify(result)} `)

                                        status.success = false  
                                }
                                }
                }

                }

        } catch (e) {
                console.log("Erro : ", e)
                      status.success = false  
        }finally{
                return status;
        } 

}

async function postProduct(data: postProductMobile){ 
    const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

        let status = {success: true, message:'' , data: null };
        try {
            const resultPost = await api.post('/produtos', data, 
                      {
                    headers: {
                        source: origin
                        }
                    }
            );
                if(resultPost.status === 200 || resultPost.status === 201  ){
                         status.success = true 
                        status.data = resultPost.data; 
                        }               

        } catch (error:any) {
                         status.success = false 
                        status.message = String(error.response.data)
                        await LogsRepository.registerLogs({
                                status: 'erro',
                                json_payload: JSON.stringify(data),
                                detalhes_erro: String(error),
                                id_registro: data.codigo || 0,
                                tabela_origem: 'cad_prod',
                                tipo_evento: 'POST API'
                        })
        }finally{
                return status; 
        }
}

async function putProduct( data:postProductMobile) {
    const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

        let status = {success: true, message:'' };

        try {
                  const resultPost = await api.put('/produtos', data,{
                    headers: {
                        source: origin
                        }
                  });
                if(resultPost.status === 200 || resultPost.status === 201  ){
                         status.success = true 
                }
        } catch (error:any) {
                        console.log(error)
                        await LogsRepository.registerLogs({
                                status: 'erro',
                                json_payload: JSON.stringify(data),
                                detalhes_erro: String(error.response.data),
                                id_registro: data.codigo || 0,
                                tabela_origem: 'cad_prod',
                                tipo_evento: 'PUT API'
                        })
        }finally{
                return status; 

        }
        
}


async function deleteProduct( codigo:number) {
        let status = {success: true, message:'' };
    const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

        try {
                  const resultPost = await api.delete(`/produtos:/${codigo}`,
                      {
                    headers: {
                        source: origin
                        }
                  }
                   );
                if(resultPost.status === 200  ){
                         status.success = true 
                }
        } catch (error:any) {
                        status.success = false;
                        status.message = String(error.response.data)

                await LogsRepository.registerLogs({
                        status: 'erro',
                        detalhes_erro: String(error),
                        id_registro: codigo || 0,
                        tabela_origem: 'cad_prod',
                        tipo_evento: 'DELETE API'
                })
        }finally{
                return status; 

        }
        
}