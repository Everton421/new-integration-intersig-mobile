import dbConn, { MOBILE, PUBLICO } from "../connection/database-connection.ts";
import { type cad_pgru } from "../contracts/cad_pgru.ts";
import { type  event } from "../contracts/event.ts";
import { type  table_enviados } from "../contracts/table-enviados.ts";
import { getCategory } from "../repository/repositry-category.ts";
import { api } from "./api.ts";

export async function serviceSendCategory (event: event ){

                        let status = null  

                console.log("[V] Verificando MOBILE categorias ...")

                        if(event.tipo_evento === 'DELETE'){
                                status = { sucess: false, message: `Evento ${event.tipo_evento} ${event.tabela_origem} ainda não foi configurado.`};
                                console.log(`Evento ${event.tipo_evento} ${event.tabela_origem} ainda não foi configurado.`);
                                return status;
                        } 

                                                const [ resultVerifycategory  ] = await dbConn.query(`SELECT * FROM ${MOBILE}.categorias_enviadas where codigo_sistema = ${event.id_registro};`);
                                                        
                                                const arrVerifycategory = resultVerifycategory as table_enviados[]
                                                               const categoryVerify = arrVerifycategory[0];  

                                                if(arrVerifycategory.length > 0 ){
                                                        console.log(`[V] Atualizando Categoria ${event.id_registro}...`);

                                                        const resultPut = await putCategory(event.id_registro,categoryVerify.id_mobile );
                                                        status = resultPut
                                                }else{
                                                        console.log(`[V] Cadastrando Categoria ${event.id_registro}...`);

                                                           const resultPost    = await postCategory(event.id_registro);
                                                        status = resultPost

                                                        }
                                                        return status;
                         
        }


export async function postCategory ( codigo:number) {
        let status = {sucess: true, message:'' , data: null };

        const origin = process.env.API_ORIGIN_NAME || 'erp_integration';
        
                                                           const arrPgru =  await getCategory(codigo);
                                                                   const grupo = arrPgru[0]
                                                            const data = {
                                                                        id: grupo.CODIGO,
                                                                        descricao: grupo.NOME,
                                                                        data_cadastro: grupo.DATA_CADASTRO ,
                                                                        data_recadastro: grupo.DATA_RECAD,
                                                                }
                                                try {
                                                          
                                                 const resultPost = await api.post("/categoria", data,
                                                                 {
                                                                 headers:{
                                                                         source: origin
                                                                         }
                                                                 }
                                                         )
                                                         if(resultPost.status === 200 || resultPost.status === 201  ){
                                                                     
                                                                const insert= `INSERT INTO ${MOBILE}.categorias_enviadas set codigo_sistema = ${grupo.CODIGO}, id_mobile= ${resultPost.data.codigo};`;
                                                                           await dbConn.query(insert);
                                                                 status.sucess = true
                                                                        status.data = resultPost.data;
                                                                }
                                                         } catch (error) {
                                                                 status.sucess = false
                                                    }  

                                                   return status;
}


export async function putCategory ( codigo:number, id_mobile:number ) {
                const origin = process.env.API_ORIGIN_NAME || 'erp_integration';
                 let status = {sucess: true, message:'' , data: null };

                             const arrPgru =  await getCategory(codigo);
                                                                   const grupo = arrPgru[0]
                                                                const data = {
                                                                        codigo: id_mobile, 
                                                                        id: grupo.CODIGO,
                                                                        descricao: grupo.NOME,
                                                                        data_cadastro: grupo.DATA_CADASTRO ,
                                                                        data_recadastro: grupo.DATA_RECAD,
                                                                }
                                        try {
                                                
                                      
                                                const resultPut = await api.put("/categoria", data,
                                                                {
                                                                headers:{
                                                                        source: origin
                                                                        }
                                                                }
                                                        )

                                                         if(resultPut.status === 200 || resultPut.status === 201 ){
                                                                status.sucess = true 
                                                        } 

                                                          } catch (error) {
                                                                status.sucess = false 
                                                                
                                        }
                                      return status;
}