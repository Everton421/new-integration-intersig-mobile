import dbConn, { MOBILE, PUBLICO } from "../connection/database-connection.ts";
import { type cad_pmar } from "../contracts/cad_pmar.ts";
import { type  event } from "../contracts/event.ts";
import { type  table_enviados } from "../contracts/table-enviados.ts";
import { api } from "./api.ts";

export async function serviceSendBrands (event: event ){

                console.log("[V] Verificando MOBILE marcas ...")

                                          let sql = ` select 
                                                pm.*,
                                                DATE_FORMAT(pm.DATA_CADASTRO, '%Y-%m-%d') AS DATA_CADASTRO,
                                                DATE_FORMAT(pm.DATA_RECAD, '%Y-%m-%d %H:%i:%s') AS DATA_RECAD 
                                                from ${PUBLICO}.cad_pmar pm
                                                WHERE
                                                pm.CODIGO = ${event.id_registro} ;
                                                `  
                                                const [ resultVerifyBrands  ] = await dbConn.query(`SELECT * FROM ${MOBILE}.marcas_enviadas where codigo_sistema = ${event.id_registro};`);
                                                        
                                                const arrVerifyBrands = resultVerifyBrands as table_enviados[]
                                                               const brandVerify =arrVerifyBrands[0];  
                                let status = 0;
                                                if(arrVerifyBrands.length > 0 ){
                                                      
                                                          const resultPut = await putBrand(event.id_registro, brandVerify.id_mobile);
                                                             status = resultPut.status   
                                                
                                                  }else{
                                                           const resultPost  =   await postBrand(event.id_registro);
                                                             status = resultPost.status   
                                                     
                                                }
                                       
                                                return status;
}

       export async function postBrand(codigo:number){
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
                                        
                                                const resultPost = await api.post("/marca", data,
                                                                {
                                                                headers:{
                                                                        source: origin
                                                                        }
                                                                }
                                                        )
                                                        resultPost.data as { id:number, data_cadastro: string ,data_recadastro: string , descricao: string  } 
                                                    await dbConn.query(`INSERT INTO ${MOBILE}.marcas_enviadas set codigo_sistema = ${codigo}, id_mobile= ${resultPost.data.codigo}`)

                                                           return  resultPost    

                        }

                        export async  function putBrand(codigo:number, id_mobile:number ){

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
                                                                        codigo: id_mobile, 
                                                                        id: brand.CODIGO,
                                                                        descricao: brand.DESCRICAO,
                                                                        data_cadastro: brand.DATA_CADASTRO ,
                                                                        data_recadastro: brand.DATA_RECAD,
                                                                }
                                        
                                                const resultPut = await api.put("/marca", data,
                                                                {
                                                                headers:{
                                                                        source: origin
                                                                        }
                                                                }
                                                        )
                                                         resultPut.data as { id:number, data_cadastro: string ,data_recadastro: string , descricao: string  } 
                                                           return  resultPut ;     

                                                        }