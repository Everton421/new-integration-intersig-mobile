import dbConn, { MOBILE, PUBLICO } from "../connection/database-connection.ts";
import { type cad_pgru } from "../contracts/cad_pgru.ts";
import { type  event } from "../contracts/event.ts";
import { type  table_enviados } from "../contracts/table-enviados.ts";
import { api } from "./api.ts";

export async function serviceSendCategory (event: event ){

                console.log("[V] Verificando MOBILE categorias ...")
                                          
                                                const [ resultVerifycategory  ] = await dbConn.query(`SELECT * FROM ${MOBILE}.categorias_enviadas where codigo_sistema = ${event.id_registro};`);
                                                        
                                                const arrVerifycategory = resultVerifycategory as table_enviados[]
                                                               const categoryVerify = arrVerifycategory[0];  

                                                if(arrVerifycategory.length > 0 ){
                                                        console.log(`[V] Atualizando Categoria ${event.id_registro}...`);

                                                        const resultPut = await putCategory(event.id_registro,categoryVerify.id_mobile );
                                                  
                                                }else{
                                                        console.log(`[V] Cadastrando Categoria ${event.id_registro}...`);

                                                           const resultPost    = await postCategory(event.id_registro);

                                                        }
}


export async function postCategory ( codigo:number) {
                const origin = process.env.API_ORIGIN_NAME || 'erp_integration';
        
                                 let sql = ` select 
                                                g.*,
                                                DATE_FORMAT(g.DATA_CADASTRO, '%Y-%m-%d') AS DATA_CADASTRO,
                                                DATE_FORMAT(g.DATA_RECAD, '%Y-%m-%d %H:%i:%s') AS DATA_RECAD 
                                                from ${PUBLICO}.cad_pgru g
                                                WHERE
                                                g.CODIGO = ${codigo} ;
                                                `  

                 const [ result  ] = await dbConn.query(sql) 
                                                                   const arrPgru = result as cad_pgru[] ;
                                                                   const grupo = arrPgru[0]
                                if( arrPgru.length  > 0){
                                                            const data = {
                                                                        id: grupo.CODIGO,
                                                                        descricao: grupo.NOME,
                                                                        data_cadastro: grupo.DATA_CADASTRO ,
                                                                        data_recadastro: grupo.DATA_RECAD,
                                                                }
                                        
                                                 const resultPost = await api.post("/categoria", data,
                                                                 {
                                                                 headers:{
                                                                         source: origin
                                                                         }
                                                                 }
                                                         )
                                                         if(resultPost.status === 200 ){
                                                                     const insert= `INSERT INTO ${MOBILE}.categorias_enviadas set codigo_sistema = ${grupo.CODIGO}, id_mobile= ${resultPost.data.codigo};`;
                                                                    await dbConn.query(insert);
                                                         }
                                                         if(resultPost.status === 400){
                                                           console.log(`[X] Erro na requisição categoria codigo: ${codigo}`)
                                                                 console.log("dados:",data);
                                                         }
                                       return resultPost;
                                }else{
                                        console.log(`[X] Não foi encontrada a categoria codigo: ${codigo}`)
                                        return;
                                }
                                              
}


export async function putCategory ( codigo:number, id_mobile:number ) {
                const origin = process.env.API_ORIGIN_NAME || 'erp_integration';
                 let sql = ` select 
                                                g.*,
                                                DATE_FORMAT(g.DATA_CADASTRO, '%Y-%m-%d') AS DATA_CADASTRO,
                                                DATE_FORMAT(g.DATA_RECAD, '%Y-%m-%d %H:%i:%s') AS DATA_RECAD 
                                                from ${PUBLICO}.cad_pgru g
                                                WHERE
                                                g.CODIGO = ${codigo} ;
                                                `  
                                        const [ result ] = await dbConn.query(sql) 
                                                                const arrPgru = result as cad_pgru[] ;
                                                                   const grupo = arrPgru[0]
                                                                const data = {
                                                                        codigo: id_mobile, 
                                                                        id: grupo.CODIGO,
                                                                        descricao: grupo.NOME,
                                                                        data_cadastro: grupo.DATA_CADASTRO ,
                                                                        data_recadastro: grupo.DATA_RECAD,
                                                                }
                                        
                                                const resultPut = await api.put("/categoria", data,
                                                                {
                                                                headers:{
                                                                        source: origin
                                                                        }
                                                                }
                                                        )
                                                         if(resultPut.status === 400){
                                                          console.log(`[X] Erro na requisição categoria codigo: ${codigo}`)
                                                                console.log("dados:",data);
                                                        }
                                      return resultPut;
}