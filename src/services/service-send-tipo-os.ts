import dbConn, { MOBILE, PUBLICO } from "../connection/database-connection.ts";
import { type  event } from "../contracts/event.ts";
import { type  table_enviados } from "../contracts/table-enviados.ts";
import { type tipos_os } from "../contracts/tipos_os.ts";
import { DateService } from "../utils/date.ts";
import { api } from "./api.ts";

export async function serviceSendTipoOs (event: event ){
        const dataService =  new DateService();

                const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

                console.log("[V] Verificando MOBILE tipos de os  ...")

                                          let sql = ` select 
                                                t.*,
                                                DATE_FORMAT(t.updated_at, '%Y-%m-%d %H:%i:%s') AS DATA_RECAD 
                                                from ${PUBLICO}.tipos_os t
                                                WHERE
                                                t.CODIGO = ${event.id_registro} ;
                                                `  
                                                const [ resultVerify  ] = await dbConn.query(`SELECT * FROM ${MOBILE}.tiposos_enviadas where codigo_sistema = ${event.id_registro};`);
                                                        
                                                const arrVerifyTipoOs = resultVerify as table_enviados[]
                                                               const tipOsVerify =arrVerifyTipoOs[0];  

                                                if(arrVerifyTipoOs.length > 0 ){
                                                          const [ resultTipo_os ] = await dbConn.query(sql) 
                                                                const arrtipoOs = resultTipo_os as tipos_os[] ;
                                                              const tipoOs = arrtipoOs[0]

                                                                const data = {
                                                                        codigo: tipOsVerify.id_mobile, 
                                                                        id: tipoOs.CODIGO,
		                                                        descricao : tipoOs.DESCRICAO ,
                                                                        data_cadastro: dataService.formatarDataHora(tipoOs.updated_at) ,
                                                                        data_recadastro: dataService.formatarDataHora(tipoOs.updated_at),
                                                                }
                                         
                                                const resultPut = await api.put("/tipo_os", data,
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
                                                              const [ resultTipo_os ] = await dbConn.query(sql) 
                                                              const arrtipoOs = resultTipo_os as tipos_os[] ;
                                                              const tipoOs = arrtipoOs[0]
                                                                const data = {
                                                                        id: tipoOs.CODIGO,
		                                                        descricao : tipoOs.DESCRICAO ,
                                                                        data_cadastro: dataService.formatarDataHora(tipoOs.updated_at) ,
                                                                        data_recadastro: dataService.formatarDataHora(tipoOs.updated_at),
                                                                }
                                        
                                                 const resultPost = await api.post("/tipo_os", data,
                                                                 {
                                                                 headers:{
                                                                         source: origin
                                                                         }
                                                                 }
                                                         )

                                                        if(resultPost.status === 200){
                                                                      const data = resultPost.data  as  any
                                                                    await dbConn.query(`INSERT INTO ${MOBILE}.tiposos_enviadas set codigo_sistema = ${tipoOs.CODIGO}, id_mobile= ${data.codigo}`)
                                                     
                                                                return { sucess:true , message:''};
                                                                 }else{
                                                                return { sucess: false , message:''};
                                                                 }

                                                }
                                       

}