import dbConn, { ESTOQUE, MOBILE, PUBLICO } from "../connection/database-connection.ts";
import { type event } from "../contracts/event.ts";
import {type setores } from "../contracts/setores.ts";
import { DateService } from "../utils/date.ts";
import { delay } from "../utils/delay.ts";
import { api } from "./api.ts";

type setores_enviados = {
        id:number,
        id_mobile:number,
        codigo_sistema:number
}

type result_api_post ={
        codigo : number
        descricao : string
        data_cadastro : string
        data_recadastro : string

}
export async function serviceSendSetor(event:event) {
        const dateService = new DateService();
        let status = {sucess: true, message:'' , data: null };

                 try{


                const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

                console.log("[V] Verificando MOBILE_setores_sistema ...")
                
                                const [ arrVerifySetor ] = await dbConn.query(`SELECT * FROM ${MOBILE}.setores_enviados WHERE codigo_sistema = ${event.id_registro};`)
                                const verifySetor = arrVerifySetor as  setores_enviados[]
                                if(verifySetor.length > 0 ){

                                        if(event.tipo_evento === 'UPDATE'){
                                                const [ arrSetor] = await dbConn.query(`SELECT * FROM ${ESTOQUE}.setores WHERE CODIGO = ${event.id_registro};`)
                                                        const setor = arrSetor as setores[]
                                                const data = { 
                                                        codigo: verifySetor[0].id_mobile,
                                                        id:setor[0].CODIGO,
                                                        descricao: setor[0].NOME,
                                                        data_cadastro: dateService.formatarData( setor[0].DATA_CADASTRO )
                                                        }

                                                        await delay(500)
                                                          const resultPut = await api.put("/setores", data,
                                                                        {
                                                                        headers:{
                                                                                source: origin
                                                                                }
                                                                        }
                                                                )
                                                        if( resultPut.status === 200 || resultPut.status === 201 ){
                                                                status.sucess =  true
                                                        }else{
                                                                status.sucess =  false
                                                        }
                                          
                                        }
                                  }else{
                                                   const [ arrSetor] = await dbConn.query(`SELECT * FROM ${ESTOQUE}.setores WHERE CODIGO = ${event.id_registro};`)
                                                        const setor = arrSetor as setores[]
                                                const data = { 
                                                        id:setor[0].CODIGO,
                                                        descricao: setor[0].NOME,
                                                        data_cadastro: dateService.formatarData(setor[0].DATA_CADASTRO)
                                                        }
                                                        await delay(500)

                                                          const resultPut = await api.post("/setores", data,
                                                                        {
                                                                        headers:{
                                                                                source: origin
                                                                                }
                                                                        }
                                                                )
                                                 if(resultPut.status === 200 ){
                                                        const data = resultPut.data  as  result_api_post
                                                        await dbConn.query(`INSERT INTO ${MOBILE}.setores_enviados set codigo_sistema = ${event.id_registro}, id_mobile= ${data.codigo }`)
                                                                status.sucess =  true
                                                     }else{
                                                                status.sucess =  false

                                                     }
                                             }


                    }catch(e){  
                          console.log("ERRO : ", e );
                          status.sucess =  false
                    }finally{
                        return status;
                    }
}
