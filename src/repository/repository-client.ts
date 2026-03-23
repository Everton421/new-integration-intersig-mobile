import dbConn, { MOBILE, PUBLICO } from "../connection/database-connection.ts";
import { cad_clie } from "../contracts/cad_clie.ts";

export async function getAllClients (codigo?:number){

         let sql = ` select *,
                                                DATE_FORMAT(DATA_CADASTRO, '%Y-%m-%d') AS DATA_CADASTRO,
                                                DATE_FORMAT(DATA_RECAD, '%Y-%m-%d %H:%i:%s') AS DATA_RECAD 
                                                from ${PUBLICO}.cad_clie c
                                                WHERE
                                                 
                                                `  
                                                let complemnt = ` c.ativo = 'S';`;
                                                if(codigo && codigo != undefined){
                                                    complemnt = `c.CODIGO = ${codigo} AND
                                                            c.ativo = 'S';`
                                                }
                                                const finalSql = sql + complemnt;
                                                const [ resultVerifyClient  ] = await dbConn.query(finalSql);
                                                return resultVerifyClient as cad_clie[];
}