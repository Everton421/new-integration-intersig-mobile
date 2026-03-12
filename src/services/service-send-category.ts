import dbConn, { EVENTOS, PUBLICO } from "../connection/database-connection.ts";
import { type cad_pmar } from "../contracts/cad_pmar.ts";
import { type  event } from "../contracts/event.ts";
import { type  table_enviados } from "../contracts/table-enviados.ts";
import { api } from "./api.ts";

export async function serviceSendCategory (event: event ){


                console.log("[V] Verificando eventos categorias ...")

                                          let sql = ` select 
                                                pm.*,
                                                DATE_FORMAT(pm.DATA_CADASTRO, '%Y-%m-%d') AS DATA_CADASTRO,
                                                DATE_FORMAT(pm.DATA_RECAD, '%Y-%m-%d %H:%i:%s') AS DATA_RECAD 
                                                from ${PUBLICO}.cad_pmar pm
                                                WHERE
                                                pm.CODIGO = ${event.id_registro} ;
                                                `  
                                                const [ resultVerifycategory  ] = await dbConn.query(`SELECT * FROM ${EVENTOS}.categorias_enviadas where codigo_sistema = ${event.id_registro};`);
                                                        
                                                const arrVerifycategory = resultVerifycategory as table_enviados[]
                                                               const categoryVerify = arrVerifycategory[0];  

                                                if(arrVerifycategory.length > 0 ){
                                                     
                                                        const resultPut = await putCategory(event.id_registro,categoryVerify.id_mobile );
                                                        if(resultPut.status === 200){
                                                                const sql = `UPDATE ${EVENTOS}.eventos_sistema SET status = 'PROCESSADO'   WHERE  id = ${event.id} ;`
                                                                await dbConn.query(sql);
                                                        }
                                                  
                                                }else{
                                                           const resultPost    = await postCategory(event.id_registro);

                                                        if(resultPost.status === 200){
                                                                    const sqlUpdate = `UPDATE ${EVENTOS}.eventos_sistema SET status = 'PROCESSADO'   WHERE  id = ${event.id}  ;`
                                                                         await dbConn.query(sqlUpdate);
                                                                  
                                                        }
                                                }
}


export async function postCategory ( codigo:number) {
                const origin = process.env.API_ORIGIN_NAME || 'erp_integration';
        
                                 let sql = ` select 
                                                pm.*,
                                                DATE_FORMAT(pm.DATA_CADASTRO, '%Y-%m-%d') AS DATA_CADASTRO,
                                                DATE_FORMAT(pm.DATA_RECAD, '%Y-%m-%d %H:%i:%s') AS DATA_RECAD 
                                                from ${PUBLICO}.cad_pmar pm
                                                WHERE
                                                pm.CODIGO = ${codigo} ;
                                                `  

                 const [ resultPmar ] = await dbConn.query(sql) 
                                                                   const arrPmar = resultPmar as cad_pmar[] ;
                                                                   const brand = arrPmar[0]

                                                                 const data = {
                                                                        id: brand.CODIGO,
                                                                        descricao: brand.DESCRICAO,
                                                                        data_cadastro: brand.DATA_CADASTRO ,
                                                                        data_recadastro: brand.DATA_RECAD,
                                                                }
                                        
                                                const resultPost = await api.post("/categoria", data,
                                                                {
                                                                headers:{
                                                                        source: origin
                                                                        }
                                                                }
                                                        )
                                                        if(resultPost.status === 200 ){
                                                                    const insert= `INSERT INTO ${EVENTOS}.categorias_enviadas set codigo_sistema = ${brand.CODIGO}, id_mobile= ${resultPost.data.codigo};`;
                                                                   await dbConn.query(insert);
                                                        }
                                      return resultPost;
}


export async function putCategory ( codigo:number, id_mobile:number ) {
                const origin = process.env.API_ORIGIN_NAME || 'erp_integration';
                 let sql = ` select 
                                                pm.*,
                                                DATE_FORMAT(pm.DATA_CADASTRO, '%Y-%m-%d') AS DATA_CADASTRO,
                                                DATE_FORMAT(pm.DATA_RECAD, '%Y-%m-%d %H:%i:%s') AS DATA_RECAD 
                                                from ${PUBLICO}.cad_pmar pm
                                                WHERE
                                                pm.CODIGO = ${codigo} ;
                                                `  
              const [ resultPgru ] = await dbConn.query(sql) 
                                                                const arrPgru = resultPgru as cad_pmar[] ;
                                                              const category = arrPgru[0]

                                                                const data = {
                                                                        codigo: id_mobile, 
                                                                        id: category.CODIGO,
                                                                        descricao: category.DESCRICAO,
                                                                        data_cadastro: category.DATA_CADASTRO ,
                                                                        data_recadastro: category.DATA_RECAD,
                                                                }
                                        
                                                const resultPut = await api.put("/categoria", data,
                                                                {
                                                                headers:{
                                                                        source: origin
                                                                        }
                                                                }
                                                        )
                                      return resultPut;
}