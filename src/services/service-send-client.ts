import dbConn, { MOBILE, PUBLICO } from "../connection/database-connection.ts";
import { type cad_clie } from "../contracts/cad_clie.ts";
import { type event } from "../contracts/event.ts";
import { type table_enviados } from "../contracts/table-enviados.ts";
import { DateService } from "../utils/date.ts";
import { api } from "./api.ts";

type clientes_enviados = {
        id:number,
        id_mobile:number,
        codigo_sistema:number
}

export async function serviceSendClient(event:event) {

                const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

                console.log("[V] Verificando MOBILE_clientes_sistema ...")
                
                      if(event.tipo_evento === 'DELETE'){
                                const status = { sucess: false, message: `Evento ${event.tipo_evento} ${event.tabela_origem} ainda não foi configurado.`};
                                console.log(`Evento ${event.tipo_evento} ${event.tabela_origem} ainda não foi configurado.`);
                                return status ;
                        }else{

                const dateService = new DateService();

                                          let sql = ` select *,
                                                DATE_FORMAT(DATA_CADASTRO, '%Y-%m-%d') AS DATA_CADASTRO,
                                                DATE_FORMAT(DATA_RECAD, '%Y-%m-%d %H:%i:%s') AS DATA_RECAD 
                                                from ${PUBLICO}.cad_clie c
                                                WHERE
                                                c.CODIGO = ${event.id_registro} AND
                                                c.ativo = 'S' 
                                                `  
                                                const [ resultVerifyClient  ] = await dbConn.query(`SELECT * FROM ${MOBILE}.clientes_enviados where codigo_sistema = ${event.id_registro};`);
                                                        const arrVerifyClient = resultVerifyClient as table_enviados[]
                                                         const clientVerify =arrVerifyClient[0];  

                                                if(arrVerifyClient.length > 0 ){
                                                          const [ resultClient ] = await dbConn.query(sql) 
                                                                const arrClient = resultClient as cad_clie[] ;
                                                              const client = arrClient[0]

                                                                const data = {
                                                                        codigo: clientVerify.id_mobile, 
                                                                        id: clientVerify.codigo_sistema,
                                                                        celular : client.CELULAR, 
                                                                        nome: client.NOME ,
                                                                        cep :client.CEP,
                                                                        endereco:client.ENDERECO ,
                                                                        ie: client.RG,
                                                                        numero: client.NUMERO,
                                                                        cnpj: client.CPF,
                                                                        cidade:client.CIDADE ,
                                                                        data_cadastro: dateService.obterDataAtual() ,
                                                                        data_recadastro: dateService.obterDataHoraAtual(),
                                                                        vendedor: 0,
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
                                                                if( resultPut.status === 200 ){
                                                                        return { sucess:true , message:''};
                                                                }else{
                                                                        return { sucess: false , message:''};
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
                                                                        data_cadastro: dateService.obterDataAtual() ,
                                                                        data_recadastro: dateService.obterDataHoraAtual(),
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
                                                                      const data = resultPost.data  as  any
                                                                    await dbConn.query(`INSERT INTO ${MOBILE}.clientes_enviados set codigo_sistema = ${client.CODIGO}, id_mobile= ${data.codigo}`)
                                                                        return { sucess:true , message:''};

                                                        }else{
                                                                        return { sucess:false , message:''};

                                                        }
                                                }
                                       
                                                
                                          
}


}
