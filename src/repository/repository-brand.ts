import dbConn, { PUBLICO } from "../connection/database-connection.ts";
import { type cad_pmar } from "../contracts/cad_pmar.ts";

export async function  getBrand(codigo?:number) {

       let sql = ` select 
                                                pm.*,
                                                DATE_FORMAT(pm.DATA_CADASTRO, '%Y-%m-%d') AS DATA_CADASTRO,
                                                DATE_FORMAT(pm.DATA_RECAD, '%Y-%m-%d %H:%i:%s') AS DATA_RECAD 
                                                from ${PUBLICO}.cad_pmar pm
                                                `
                                                let complemnt = ` ;`; 
                                                if(codigo  && codigo != undefined ){
                                                    complemnt = ` WHERE
                                                    pm.CODIGO = ${codigo} ;` 
                                                    }

                                                        const finalSql = sql+ complemnt;

                                          const [ resultPmar ] = await dbConn.query(finalSql) 
                                                 return resultPmar as cad_pmar[] ;
    
}