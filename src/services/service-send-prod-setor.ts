import dbConn, { ESTOQUE, EVENTOS, PUBLICO } from "../connection/database-connection.ts";
import { type event } from "../contracts/event.ts";
import { type prod_setor } from "../contracts/prod_setor.ts";
import { findStock } from "../repository/repository-prod-setor.ts";
import { api } from "./api.ts";

type produtos_enviados = {
        id:number  
        id_mobile:number 
        codigo_sistema:number
}

type resultProductMobile = {
        codigo: number
        preco: number
        estoque:number
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

type postProductMobile = resultProductMobile & {grupo : { codigo:number } } & { marca:{ codigo:number }}

export async function serviceSendProdSetor() {

        setInterval(async () => {
                const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

                console.log("[V] Verificando eventos_produtos_sistema ...")
                const [resultEvent] = await dbConn.query(`SELECT * FROM ${EVENTOS}.eventos_produtos_sistema WHERE status = 'PENDENTE' ;`)
                
                const event = resultEvent as event[]

                if (event.length > 0) {
                        for (const i of event) {

                                if(i.tabela_origem === 'prod_setor'){
                                        const [resultProdSetorSistema] = await dbConn.query(`SELECT * FROM ${ESTOQUE}.prod_setor WHERE produto = ${i.id_registro} AND setor = ${i.setor};`)
                                        const arrProdSetorSistema = resultProdSetorSistema as prod_setor[]
                                        const PROD_SETOR = arrProdSetorSistema[0] as prod_setor;
                                        
                                        const [ resultVerifyProduct ] = await dbConn.query(`SELECT * FROM ${EVENTOS}.produtos_enviados WHERE codigo_sistema = ${i.id_registro};`)   ; 
                                        const arrVerifyItems = resultVerifyProduct as produtos_enviados[]
                                        if(arrVerifyItems.length > 0 ){
                                                const data = {
                                                        produto: arrVerifyItems[0].id_mobile,
                                                        setor: PROD_SETOR.SETOR,
                                                        data_recadastro: PROD_SETOR.DATA_RECAD,
                                                        estoque: PROD_SETOR.ESTOQUE,
                                                        local1_produto: PROD_SETOR.LOCAL1_PRODUTO || '',
                                                        local2_produto: PROD_SETOR.LOCAL2_PRODUTO || '',
                                                        local3_produto: PROD_SETOR.LOCAL3_PRODUTO || '',
                                                        local4_produto: PROD_SETOR.LOCAL4_PRODUTO || '',
                                                        local_produto: PROD_SETOR.LOCAL_PRODUTO || ''
                                                }
                                                console.log(` Enviando saldo produto ${PROD_SETOR.PRODUTO}...`, )
                                                
                                                const result = await api.post("/produto_setor", data,
                                                                {
                                                                headers:{
                                                                        source: origin
                                                                        }
                                                                }
                                                        )

                                                        if(result.status === 200){
                                                                const sql = `UPDATE ${EVENTOS}.eventos_produtos_sistema SET status = 'PROCESSADO'   WHERE  id = ${i.id}  ;`
                                                                await dbConn.query(sql);
                                                        }
                                              }else{
                                                console.log(`[X] Produto ${PROD_SETOR.PRODUTO} nao foi enviado.`)
                                              }
                                }

                                if(i.tabela_origem === 'cad_prod' || i.tabela_origem === 'prod_tabprecos' || i.tabela_origem === 'pro_orca'){

                                        const [ resultVerifyProduct ] = await dbConn.query(`SELECT * FROM ${EVENTOS}.produtos_enviados WHERE codigo_sistema = ${i.id_registro};`)   ; 
                                        const arrVerifyItems = resultVerifyProduct as produtos_enviados[]

                                                   let sql = ` SELECT  
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
                                                                p.CODIGO = '${i.id_registro}'
                                                                AND tp.padrao = 'S'
                                                                AND p.ativo = 'S'
                                                                group by  p.CODIGO
                                                                order by p.CODIGO;  `
                                        if(arrVerifyItems.length > 0 ){
                                                // update produto 
                                        console.log(` Atualizando  produto ${i.id_registro}...`, )

                                        const [ result_cad_prod ] = await dbConn.query(sql);
                                        const arrProduct = result_cad_prod  as resultProductMobile[]
                                                const grupo = { codigo: arrProduct[0].grupo };
                                                const marca = { codigo: arrProduct[0].marca };
                                                let iten = { ...arrProduct[0] , grupo :grupo ,marca:marca } as postProductMobile
                                                
                                                    const stock = await findStock(arrProduct[0].codigo);
                                                  iten.codigo = arrVerifyItems[0].id_mobile;
                                                  iten.estoque = stock.ESTOQUE 
                                                  iten.preco = Number(arrProduct[0].preco);      
                                                const resultPut = await api.put('/produto', iten);
                                                if(resultPut.status === 200 ){
                                                    const sql = `UPDATE ${EVENTOS}.eventos_produtos_sistema SET status = 'PROCESSADO'   WHERE  id = ${i.id}  ;`
                                                    await dbConn.query(sql);
                                                }
                                        }else{
                                                //post produto 
                                        console.log(` Enviando   produto ${i.id_registro}...`, )

                                        const [ result_cad_prod ] = await dbConn.query(sql);
                                                  const arrProduct = result_cad_prod  as resultProductMobile[]
                                                   const grupo = { codigo: arrProduct[0].grupo };
                                                const marca = { codigo: arrProduct[0].marca };
                                                let iten = { ...arrProduct[0] , grupo :grupo ,marca:marca } as postProductMobile
                                                
                                                   const stock = await findStock(arrProduct[0].codigo);
                                                  iten.estoque = stock.ESTOQUE    

                                                const resultPost = await api.post('/produto', iten);
                                                if(resultPost.status === 200 ){
                                                    const sql = `UPDATE ${EVENTOS}.eventos_produtos_sistema SET status = 'PROCESSADO'   WHERE  id = ${i.id}  ;`
                                                    await dbConn.query(sql);
                                                    const data = resultPost.data  as  any
                                                    await dbConn.query(`INSERT INTO ${EVENTOS}.produtos_enviados set codigo_sistema = ${arrProduct[0].codigo}, id_mobile= ${data.codigo}`)
                                                }

                                        }
                                        
                                }

                        }
                }

        }, 10000)
}
