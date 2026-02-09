import dbConn, { EVENTOS, PUBLICO } from "../connection/database-connection.ts";
import { type cad_clie } from "../contracts/cad_clie.ts";
import { type event } from "../contracts/event.ts";
import { api } from "./api.ts";

type clientes_enviados = {
        id:number,
        id_mobile:number,
        codigo_sistema:number
}

export async function serviceSendClient() {

        setInterval(async () => {
                const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

                console.log("[V] Verificando eventos_clientes_sistema ...")
                const [resultEvent] = await dbConn.query(`SELECT * FROM ${EVENTOS}.eventos_clientes_sistema WHERE status = 'PENDENTE' ;`)
                
                const event = resultEvent as event[]

                if (event.length > 0) {
                        for (const i of event) {

                                if(i.tabela_origem === 'cad_clie'){
                                          let sql = ` select *,
                                                DATE_FORMAT(DATA_CADASTRO, '%Y-%m-%d') AS DATA_CADASTRO,
                                                DATE_FORMAT(DATA_RECAD, '%Y-%m-%d %H:%i:%s') AS DATA_RECAD 
                                                from ${PUBLICO}.cad_clie c
                                                WHERE
                                                c.CODIGO = ${i.id_registro} AND
                                                c.ativo = 'S' 
                                                `  
                                                const [ resultVerifyClient  ] = await dbConn.query(`SELECT * FROM ${EVENTOS}.clientes_enviados where codigo_sistema = ${i.id_registro};`);
                                                        const arrVerifyClient = resultVerifyClient as clientes_enviados[]
                                                               const clientVerify =arrVerifyClient[0];  
                                                if(arrVerifyClient.length > 0 ){
                                                          const [ resultClient ] = await dbConn.query(sql) 
                                                                const arrClient = resultClient as cad_clie[] ;
                                                              const client = arrClient[0]

                                                                const data = {
                                                                        codigo: clientVerify.codigo_sistema, 
                                                                        id: clientVerify.codigo_sistema,
                                                                        celular : client.CELULAR, 
                                                                        nome: client.NOME ,
                                                                        cep :client.CEP,
                                                                        endereco:client.ENDERECO ,
                                                                        ie: client.RG,
                                                                        numero: client.NUMERO,
                                                                        cnpj: client.CPF,
                                                                        cidade:client.CIDADE ,
                                                                        data_cadastro: client.DATA_CADASTRO ,
                                                                        data_recadastro: client.DATA_RECAD,
                                                                        vendedor: client.VENDEDOR,
                                                                        bairro: client.BAIRRO,
                                                                        estado: client.ESTADO
                                                                }
                                        
                                                const resultPut = await api.put("/cliente", data,
                                                                {
                                                                headers:{
                                                                        source: origin
                                                                        }
                                                                }
                                                        )

                                                        if(resultPut.status === 200){
                                                                const sql = `UPDATE ${EVENTOS}.eventos_clientes_sistema SET status = 'PROCESSADO'   WHERE  id = ${i.id}  ;`
                                                                await dbConn.query(sql);
                                                        }
                                                  
                                                }else{
                                                 const [ resultClient ] = await dbConn.query(sql) 

                                                        const arrClient = resultClient as cad_clie[] ;
                                                                const client = arrClient[0]
                                                                const data = {
                                                                        id: client.CODIGO,
                                                                        celular : client.CELULAR, 
                                                                        nome: client.NOME ,
                                                                        cep :client.CEP,
                                                                        endereco:client.ENDERECO ,
                                                                        ie: client.RG,
                                                                        numero: client.NUMERO,
                                                                        cnpj: client.CPF,
                                                                        cidade:client.CIDADE ,
                                                                        data_cadastro: client.DATA_CADASTRO ,
                                                                        data_recadastro: client.DATA_RECAD,
                                                                        vendedor: client.VENDEDOR,
                                                                        bairro: client.BAIRRO,
                                                                        estado: client.ESTADO
                                                                }
                                        
                                                const resultPost = await api.post("/cliente", data,
                                                                {
                                                                headers:{
                                                                        source: origin
                                                                        }
                                                                }
                                                        )

                                                        if(resultPost.status === 200){
                                                                const sql = `UPDATE ${EVENTOS}.eventos_clientes_sistema SET status = 'PROCESSADO'   WHERE  id = ${i.id}  ;`
                                                                await dbConn.query(sql);
                                                                      const data = resultPost.data  as  any
                                                    await dbConn.query(`INSERT INTO ${EVENTOS}.clientes_enviados set codigo_sistema = ${client.CODIGO}, id_mobile= ${data.codigo}`)
                                                        }
                                                }
                                       
                                                
                                              }else{
                                                console.log(`[X] Cliente ${i.id_registro} nao foi enviado.`)
                                              }
                                }

                        }

        }, 10000)
}
