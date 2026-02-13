import dbConn, { ESTOQUE, EVENTOS, PUBLICO } from "../connection/database-connection.ts";
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
export async function serviceSendSetor() {
        const dateService = new DateService();

                let inExec = false;

        setInterval(async () => {
                 try{

                if(inExec){
                        console.log("Tarefa anterior em execução...");
                        return
                }
                        inExec = true

                const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

                console.log("[V] Verificando eventos_setores_sistema ...")
                const [resultEvent] = await dbConn.query(`SELECT * FROM ${EVENTOS}.eventos_setores_sistema WHERE status = 'PENDENTE' ;`)
                
                const event = resultEvent as event[]
                if (event.length > 0) {
                        for (const i of event) {

                                const [ arrVerifySetor ] = await dbConn.query(`SELECT * FROM ${EVENTOS}.setores_enviados WHERE codigo_sistema = ${i.id_registro};`)
                                const verifySetor = arrVerifySetor as  setores_enviados[]
                                if(verifySetor.length > 0 ){

                                        if(i.tipo_evento === 'UPDATE'){
                                                const [ arrSetor] = await dbConn.query(`SELECT * FROM ${ESTOQUE}.setores WHERE CODIGO = ${i.id_registro};`)
                                                        const setor = arrSetor as setores[]
                                                const data = { 
                                                        codigo: verifySetor[0].id_mobile,
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
                                                 if(resultPut.status === 200 ){
                                                        const sql = `UPDATE ${EVENTOS}.eventos_setores_sistema SET status = 'PROCESSADO'   WHERE  id = ${i.id}  ;`
                                                        await dbConn.query(sql);
                                                        const data = resultPut.data  as  any
                                                     }
                                        }
                                }else{
                                                   const [ arrSetor] = await dbConn.query(`SELECT * FROM ${ESTOQUE}.setores WHERE CODIGO = ${i.id_registro};`)
                                                        const setor = arrSetor as setores[]
                                                const data = { 
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
                                                        const sql = `UPDATE ${EVENTOS}.eventos_setores_sistema SET status = 'PROCESSADO'   WHERE  id = ${i.id}  ;`
                                                        await dbConn.query(sql);
                                                        const data = resultPut.data  as  result_api_post
                                                        await dbConn.query(`INSERT INTO ${EVENTOS}.setores_enviados set codigo_sistema = ${i.id_registro}, id_mobile= ${data.codigo }`)
                                                     }
                                                

                                }

                                }
                    }

                    }catch(e){  
                        console.log("ERRO : ", e );

                    }finally{
                        inExec = false
                    }
        }, 10000)
}
