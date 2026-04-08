import dbConn, { MOBILE, PUBLICO } from "../connection/database-connection.ts";
import { type cad_pmar } from "../contracts/cad_pmar.ts";
import { type  event } from "../contracts/event.ts";
import { type  table_enviados } from "../contracts/table-enviados.ts";
import { getBrand } from "../repository/repository-brand.ts";
import { api } from "./api.ts";

type resultApiBrand =   { id:number, data_cadastro: string ,data_recadastro: string , descricao: string  } 
export async function serviceSendBrands (event: event ){

                console.log("[V] Verificando MOBILE marcas ...")
        let status = {sucess: false, message:'' , data: null   };

        
                      if(event.tipo_evento === 'DELETE'){
                                  status.sucess = false 
                                   status.message = `Evento ${event.tipo_evento} ${event.tabela_origem} ainda não foi configurado.` ;
                                console.log(`Evento ${event.tipo_evento} ${event.tabela_origem} ainda não foi configurado.`);
                                return status ;
                        }else{


                                                const [ resultVerifyBrands  ] = await dbConn.query(`SELECT * FROM ${MOBILE}.marcas_enviadas where codigo_sistema = ${event.id_registro};`);
                                                        
                                                const arrVerifyBrands = resultVerifyBrands as table_enviados[]
                                                               const brandVerify =arrVerifyBrands[0];  
                                                if(arrVerifyBrands.length > 0 ){
                                                      
                                                          const resultPut = await putBrand(event.id_registro, brandVerify.id_mobile);
                                                             status = resultPut  
                                                
                                                  }else{
                                                           const resultPost  =   await postBrand(event.id_registro);
                                                             status = resultPost  
                                                }
                                       
                                                return status;
                }
}

       export async function postBrand(codigo:number){
                const origin = process.env.API_ORIGIN_NAME || 'erp_integration';
        let status = {sucess: false, message:'' , data: null };
                                  const   resultPmar   = await getBrand(codigo); 
                                                  if(resultPmar.length === 0 ){
                                                     console.log(`Marca codigo ${codigo} não foi encontrada `)
                                                     status.message === `Marca codigo ${codigo} não foi encontrada ` 
                                                                return status
                                                  }
                                                  const arrPmar = resultPmar as cad_pmar[] ;
                                     try {
                                        
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
                                                        resultPost.data 
                                                    await dbConn.query(`INSERT INTO ${MOBILE}.marcas_enviadas set codigo_sistema = ${codigo}, id_mobile= ${resultPost.data.codigo}`)
                                                     status.sucess = true
                                                        status.data = resultPost.data;

                                         } catch (error) {
                                                status.sucess = false
                                                status.message = String(error)
                                     }finally{
                                        return  status;
                                     }
                                                        


                        }

                        export async  function putBrand(codigo:number, id_mobile:number ){
        let status = {sucess: false, message:'' , data: null };

                                const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

                                          const   resultPmar   = await getBrand(codigo); 
                                          if(resultPmar.length === 0 ){
                                                console.log(`Marca codigo ${codigo} não foi encontrada `)
                                                status.message === `Marca codigo ${codigo} não foi encontrada ` 
                                                return status
                                          }

                                          try {
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
                                                         status.sucess = true; 
                                                         status.data = resultPut.data;
                                          } catch (error) {
                                                    status.sucess = false
                                                 status.message = String(error)
                                          }finally{
                                            return  status;

                                          }

                                                  
                                           }