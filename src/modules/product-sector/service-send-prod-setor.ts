import { type event } from "../../contracts/event.ts";
import dbConn, { ESTOQUE, MOBILE } from "../../database/connection/database-connection.ts";
import { api } from "../../services/api.ts";
import { LogsRepository } from "../logs-integration/logs-repository.ts";
import { serviceSendProduct } from "../products/service-send-product.ts";
import { type prod_setor } from "./contracts/prod_setor.ts";

type produtos_enviados = {
        id:number  
        id_mobile:number 
        codigo_sistema:number
}

 
export async function serviceSendProdSetor(event: event) {
        let status = {success: true, message:'' , data: null };
                   
                try{
                        const origin = process.env.API_ORIGIN_NAME || 'erp_integration';
                        
                          const [resultProdSetorSistema] = await dbConn.query(`SELECT * FROM ${ESTOQUE}.prod_setor WHERE produto = '${event.id_registro}' AND SETOR = '${event.setor}' ;`)
                                                const arrProdSetorSistema = resultProdSetorSistema as prod_setor[]

                                                if(arrProdSetorSistema.length > 0 ){
                                                         const PROD_SETOR = arrProdSetorSistema[0] as prod_setor;
                                                
                                                let [ resultVerifyProduct ] = await dbConn.query(`SELECT * FROM ${MOBILE}.produtos_enviados WHERE codigo_sistema = '${event.id_registro}';`)   ; 
                                                let arrVerifyItems = resultVerifyProduct as produtos_enviados[]

                                                        let resultPostProduct ;

                                                        if(arrVerifyItems.length == 0 ){
                                                            console.log(`[X] Produto ${PROD_SETOR.PRODUTO} ainda não foi enviado, efetuando tentativa de envio...`)
                                                                  resultPostProduct = await serviceSendProduct({ criado_em:'', dados_json:'', tabela_origem:'cad_prod', id:0, id_evento: 0 ,id_message:'',id_registro: event.id_registro, 
                                                                        setor: event.setor,status:'PENDENTE',tabela:0, tipo_evento:'INSERT' 
                                                                })
                                                           
                                                                        }
                                                        [ resultVerifyProduct ] = await dbConn.query(`SELECT * FROM ${MOBILE}.produtos_enviados WHERE codigo_sistema = ${event.id_registro};`)   ; 
                                                        arrVerifyItems = resultVerifyProduct as produtos_enviados[]
                                                        
                                                                if(arrVerifyItems.length > 0 ){
                                                                        const data = {
                                                                                produto: Number(PROD_SETOR.PRODUTO),
                                                                                setor: Number(PROD_SETOR.SETOR),
                                                                                data_recadastro: PROD_SETOR.DATA_RECAD,
                                                                                estoque: Number(PROD_SETOR.ESTOQUE),
                                                                                local1_produto: PROD_SETOR.LOCAL1_PRODUTO || '',
                                                                                local2_produto: PROD_SETOR.LOCAL2_PRODUTO || '',
                                                                                local3_produto: PROD_SETOR.LOCAL3_PRODUTO || '',
                                                                                local4_produto: PROD_SETOR.LOCAL4_PRODUTO || '',
                                                                                local_produto:   ''
                                                                        }
                                                                        console.log(` Enviando saldo produto ${PROD_SETOR.PRODUTO}...`, )
                                                          
                                                                        const result = await api.put("/produtos-setor", data,
                                                                                        {
                                                                                        headers:{
                                                                                                source: origin
                                                                                                }
                                                                                        }
                                                                                )
                                                                        if( result.status === 200 || result.status === 201){

                                                                                status.success = true;
                                                                                status.message = result.data.message
                                                                                }else{
                                                                                status.success = false;
                                                                                status.message = result.data.message

                                                                        }

                                                                }else{
                                                                        console.log(`[X] Produto ${PROD_SETOR.PRODUTO} nao foi enviado.`)
                                                                                status.success = false;
                                                                        status.message =`[X] Produto ${PROD_SETOR.PRODUTO} nao foi enviado.`;
                                                                }
                                                }else{
                                                        console.log(`[X] Não foi encontrado produto ${event.id_registro} no setor   ${event.setor}.`)
                                                }       
                                           
                       
                }catch(e){
                        console.log("Erro : ",e)
                        status.success = false;
                        status.message = String(e);
                        await LogsRepository.registerLogs({
                                status: 'erro',
                                json_payload: JSON.stringify(event),
                                detalhes_erro: String(e),
                                id_registro: event.id_registro || 0,
                                tabela_origem: 'prod_setor',
                                tipo_evento: 'PUT API'
                        })

                }finally{
                        return status;
                } 

}
