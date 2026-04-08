import { type ResultSetHeader } from "mysql2";
import dbConn, { MOBILE, PUBLICO } from "../connection/database-connection.ts";
import { type event } from "../contracts/event.ts";
import { type table_enviados } from "../contracts/table-enviados.ts";
import { findStock } from "../repository/repository-prod-setor.ts";
import { delay } from "../utils/delay.ts";
import { api } from "./api.ts";
import { postBrand } from "./service-send-brands.ts";
import { postCategory } from "./service-send-category.ts";

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

type postProductMobile = resultProductMobile & { id: number } & { grupo: { codigo: number } } & { marca: { codigo: number } }

export async function serviceSendProduct(event: event) {
        await delay(250)
        let status = {sucess: true, message:'' , data: null };

        try {
                if (event.tipo_evento === 'DELETE'){
                        console.log(`[V] Excluindo produto ${event.id_registro}`)

                             const [resultVerifyDeleteProduct] = await dbConn.query(`SELECT * FROM ${MOBILE}.produtos_enviados WHERE codigo_sistema = ${event.id_registro};`);
                        const arrVerifyItems = resultVerifyDeleteProduct as produtos_enviados[]
                        if (arrVerifyItems.length > 0) {

                        const result = await deleteProduct(arrVerifyItems[0].id_mobile);
                                 if( result.sucess){
                   
                                   const [resultStatusDelete] = await dbConn.query(`DELETE FROM ${MOBILE}.produtos_enviados WHERE codigo_sistema = ${event.id_registro};`);
                                        const resultDelete  = resultStatusDelete as ResultSetHeader; 
                                        if(resultDelete.affectedRows > 0 ){
                                                status.sucess = true  
                                        }else{
                                                status.sucess = true
                                                status.message =`Ocorreu um erro ao tentar excluir o produto ${event.id_registro}`  
                                        }   
                                
                                    } else{
                                         status.sucess = true
                                         status.message =result.message  
                                    }        
                          }else{
                                status.sucess = true
                                status.message =`O produto ${event.id_registro} não foi encontrado na tabela de enviados.`  
                         }

                      

                }else{


                         const sql = ` SELECT  
                               p.CODIGO codigo,  
                               COALESCE(   ROUND(pp.preco,2 ),  0.00 ) as preco,
                               COALESCE( p.GRUPO, 0) as grupo, 
                               coalesce(und.SIGLA,'UND') as unidade_medida,
                               p.DESCRICAO descricao, 
                               p.NUM_FABRICANTE num_fabricante,
                               p.NUM_ORIGINAL num_original,
                               p.OUTRO_COD sku,
                               COALESCE( p.MARCA, 0) as marca,
                               p.ATIVO ativo,
                               p.TIPO tipo,
                               cf.NCM class_fiscal,
                               p.ORIGEM origem,
                               p.CST cst,
                               coalesce(DATE_FORMAT(p.DATA_CADASTRO, '%Y-%m-%d'),'0000-00-00 00:00:00') AS data_cadastro,
                               CONVERT( p.OBSERVACOES1 USING utf8) as observacoes1,
                               CONVERT(p.OBSERVACOES2 USING utf8) as observacoes2,
                               CONVERT(p.OBSERVACOES3 USING utf8) as observacoes3
                               FROM   ${PUBLICO}.cad_prod p 
                                       left join  ${PUBLICO}.prod_tabprecos pp on pp.produto = p.codigo
                                       left join  ${PUBLICO}.tab_precos tp on tp.codigo = pp.tabela
                                       left join  ${PUBLICO}.class_fiscal cf on cf.codigo = p.class_fiscal
                                       left join  ${PUBLICO}.unid_prod und on und.produto = p.CODIGO and und.PADR_SAI = 'S' AND und.PADR_SEP= 'S' 
                               WHERE 
                               p.CODIGO = '${event.id_registro}'
                               AND tp.padrao = 'S'
                       --  AND p.ativo = 'S'
                               group by  p.CODIGO
                               order by p.CODIGO;  `
                const [result_cad_prod] = await dbConn.query(sql);
                const arrProduct = result_cad_prod as resultProductMobile[]
                const marcaErp = arrProduct[0]?.marca || 0;
                const grupoErp = arrProduct[0]?.grupo || 0;


                /// verifca se a marca já  foi enviada 
                let id_marca_mobile = 0;

                const [resultVerifyBrand] = await dbConn.query(`SELECT * FROM ${MOBILE}.marcas_enviadas WHERE codigo_sistema = ${marcaErp};`);
                const arrVerifyBrand = resultVerifyBrand as table_enviados[];

                if (arrVerifyBrand.length === 0) {
                        const result = await postBrand(marcaErp) as any
                        if (result && result.sucess ) id_marca_mobile = result.data && result.data.codigo  ? result.data.codigo : 0;
                } else {
                        id_marca_mobile = arrVerifyBrand[0].id_mobile
                }

                const marca = { codigo: id_marca_mobile };
                // ---------------------------------------------------------------------------

              // verifca grupo
                let id_categoria_mobile = 0;
                const [resultVerifyCategory] = await dbConn.query(`SELECT * FROM ${MOBILE}.categorias_enviadas WHERE codigo_sistema = ${grupoErp};`);
                const arrVerifyCategory = resultVerifyCategory as table_enviados[];
                if (arrVerifyCategory.length === 0) {
                        const result = await postCategory(grupoErp)  as any
                        if (result &&  result.sucess ) id_categoria_mobile = result.data && result.data.codigo ? result.data.codigo : 0
                } else {
                        id_categoria_mobile = arrVerifyCategory[0].id_mobile
                }

                const grupo = { codigo: id_categoria_mobile };

                // ---------------------------------------------------------------------------

                const [resultVerifyProduct] = await dbConn.query(`SELECT * FROM ${MOBILE}.produtos_enviados WHERE codigo_sistema = ${event.id_registro};`);
                const arrVerifyItems = resultVerifyProduct as produtos_enviados[]

                if (arrVerifyItems.length > 0) {
                        // update produto 
                        console.log(` Atualizando  produto ${event.id_registro}...`,)

                        let item = { ...arrProduct[0], id: arrProduct[0].codigo, grupo: grupo, marca: marca } as postProductMobile

                        item.codigo = arrVerifyItems[0].id_mobile;

                        const arrStock = await findStock(arrProduct[0].codigo);
                        item.estoque = 0
                        if (arrStock.length > 0) item.estoque = arrStock[0].ESTOQUE;

                        item.preco = Number(arrProduct[0].preco);

                        const result = await putProduct(item);
                                if( result.sucess ){
                                        status.sucess = true  
                                }else{
                                        status.sucess = false  
                                }

                } else {
                        //post produto 
                        console.log(` Enviando   produto ${event.id_registro}...`,)

                        let item = { ...arrProduct[0], id: arrProduct[0].codigo, grupo: grupo, marca: marca } as postProductMobile

                        const arrStock = await findStock(arrProduct[0].codigo);
                        item.estoque = 0
                        if (arrStock.length > 0) item.estoque = arrStock[0].ESTOQUE;

                        const result = await postProduct(item);
                                if( result.sucess && result.data ){
                                        const data = result.data as any
                                        await dbConn.query(`INSERT INTO ${MOBILE}.produtos_enviados set codigo_sistema = ${arrProduct[0].codigo}, id_mobile= ${data.codigo}`);
                                        status.sucess =true  
                                        }else{
                                        status.sucess = false  
                                }
                }

                }

        } catch (e) {
                console.log("Erro : ", e)
                      status.sucess = false  
        }finally{
                return status;
        } 

}

async function postProduct(data: postProductMobile){   
        let status = {sucess: true, message:'' , data: null };
        try {
            const resultPost = await api.post('/produto', data);
                if(resultPost.status === 200 || resultPost.status === 201  ){
                         status.sucess = true 
                        status.data = resultPost.data; 
                        }               

        } catch (error) {
                         status.sucess = true 
                        status.message = String(error)
        }finally{
                return status; 
        }
}

async function putProduct( data:postProductMobile) {
        let status = {sucess: true, message:'' };

        try {
                  const resultPost = await api.put('/produto', data);
                if(resultPost.status === 200 || resultPost.status === 201  ){
                         status.sucess = true 
                }
        } catch (error) {
                
        }finally{
                return status; 

        }
        
}


async function deleteProduct( codigo:number) {
        let status = {sucess: true, message:'' };

        try {
                  const resultPost = await api.delete(`/produto:/${codigo}` );
                if(resultPost.status === 200  ){
                         status.sucess = true 
                }
        } catch (error) {
                
        }finally{
                return status; 

        }
        
}