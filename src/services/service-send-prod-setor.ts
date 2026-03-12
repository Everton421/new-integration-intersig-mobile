import dbConn, { ESTOQUE, EVENTOS, PUBLICO } from "../connection/database-connection.ts";
import { type event } from "../contracts/event.ts";
import { type prod_setor } from "../contracts/prod_setor.ts";
import { findStock } from "../repository/repository-prod-setor.ts";
import { delay } from "../utils/delay.ts";
import { api } from "./api.ts";

type produtos_enviados = {
        id:number  
        id_mobile:number 
        codigo_sistema:number
}

 

 
export async function serviceSendProdSetor(event: event) {

                try{
                        const origin = process.env.API_ORIGIN_NAME || 'erp_integration';
 
                          const [resultProdSetorSistema] = await dbConn.query(`SELECT * FROM ${ESTOQUE}.prod_setor WHERE produto = ${event.id_registro} AND setor = ${event.setor};`)
                                                const arrProdSetorSistema = resultProdSetorSistema as prod_setor[]
                                                const PROD_SETOR = arrProdSetorSistema[0] as prod_setor;
                                                
                                                const [ resultVerifyProduct ] = await dbConn.query(`SELECT * FROM ${EVENTOS}.produtos_enviados WHERE codigo_sistema = ${event.id_registro};`)   ; 
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
                                                        await delay(500)
                                                        const result = await api.post("/produto_setor", data,
                                                                        {
                                                                        headers:{
                                                                                source: origin
                                                                                }
                                                                        }
                                                                )

                                                                if(result.status === 200){
                                                                        const sql = `UPDATE ${EVENTOS}.eventos_sistema SET status = 'PROCESSADO'   WHERE  id = ${event.id}  ;`
                                                                        await dbConn.query(sql);
                                                                }
                                                }else{
                                                        console.log(`[X] Produto ${PROD_SETOR.PRODUTO} nao foi enviado.`)
                                                }
                       
                }catch(e){
                        console.log("Erro : ",e)
                }finally{
                }

}
