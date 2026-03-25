import dbConn, { MOBILE, PUBLICO } from "../connection/database-connection.ts";
import {type  cad_serv } from "../contracts/cad_serv.ts";
import { type  event } from "../contracts/event.ts";
import { type  table_enviados } from "../contracts/table-enviados.ts";
import { DateService } from "../utils/date.ts";
import { api } from "./api.ts";

export async function serviceSendServices (event: event ){
        const dataService =  new DateService();

                const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

                console.log("[V] Verificando MOBILE servicos ...")

                                          let sql = ` select 
                                                cs.*,
                                                DATE_FORMAT(cs.updated_at, '%Y-%m-%d %H:%i:%s') AS DATA_RECAD 
                                                from ${PUBLICO}.cad_serv cs
                                                WHERE
                                                cs.CODIGO = ${event.id_registro} ;
                                                `  
                                                const [ resultVerifyServices  ] = await dbConn.query(`SELECT * FROM ${MOBILE}.servicos_enviados where codigo_sistema = ${event.id_registro};`);
                                                        
                                                const arrVerifyServices = resultVerifyServices as table_enviados[]
                                                               const serviceVerify =arrVerifyServices[0];  

                                                if(arrVerifyServices.length > 0 ){
                                                          const [ resultCad_serv ] = await dbConn.query(sql) 
                                                                const arrServ = resultCad_serv as cad_serv[] ;
                                                              const serv = arrServ[0]

                                                                const data = {
                                                                        codigo: serviceVerify.id_mobile, 
                                                                        id: serv.CODIGO,
                                                                        valor : serv.VALOR,
		                                                        aplicacao : serv.APLICACAO ,
		                                                        tipo_serv: serv.TIPO_SERV ,
                                                                        descricao: serv.DESCRICAO,
                                                                        data_cadastro: dataService.formatarDataHora(serv.DATA_CADASTRO) ,
                                                                        data_recadastro: serv.updated_at,
                                                                }
                                         
                                                const resultPut = await api.put("/servico", data,
                                                                {
                                                                headers:{
                                                                        source: origin
                                                                        }
                                                                }
                                                        )
                                                       
                                                        if( resultPut.status === 200 ){
                                                                return { sucess:true , message:''};
                                                        }else{
                                                                return { sucess: false , message:''};
                                                        }
                                                }else{
                                                                const [ resultCad_serv ] = await dbConn.query(sql) 
                                                                 const arrServ = resultCad_serv as cad_serv[] ;
                                                                 const serv = arrServ[0]

                                                                  const data = {
                                                                        id: serv.CODIGO,
                                                                        valor : serv.VALOR,
		                                                        aplicacao : serv.APLICACAO ,
		                                                        tipo_serv: serv.TIPO_SERV ,
                                                                        descricao: serv.DESCRICAO,
                                                                        data_cadastro: dataService.formatarDataHora(serv.DATA_CADASTRO) ,
                                                                        data_recadastro: dataService.formatarDataHora(serv.updated_at),
                                                                }
                                                         
                                                 const resultPost = await api.post("/servico", data,
                                                                 {
                                                                 headers:{
                                                                         source: origin
                                                                         }
                                                                 }
                                                         )

                                                        if(resultPost.status === 200){
                                                                      const data = resultPost.data  as  any
                                                                     await dbConn.query(`INSERT INTO ${MOBILE}.servicos_enviados set codigo_sistema = ${serv.CODIGO}, id_mobile= ${data.codigo}`)
                                                                return { sucess:true , message:''};

                                                        }else{
                                                                return { sucess: false , message:''};

                                                        }
                                                         

                                                }
                                       

}