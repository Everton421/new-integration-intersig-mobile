import dbConn, { PUBLICO } from "../connection/database-connection.ts";
import { cad_pgru } from "../contracts/cad_pgru.ts";

export async function  getCategory(codigo?: number) {
    
                                        let sql = ` select 
                                                g.*,
                                                DATE_FORMAT(g.DATA_CADASTRO, '%Y-%m-%d') AS DATA_CADASTRO,
                                                DATE_FORMAT(g.DATA_RECAD, '%Y-%m-%d %H:%i:%s') AS DATA_RECAD 
                                                from ${PUBLICO}.cad_pgru g
                                      
                                                `  
                let whereClause = ``;
                    if(codigo && codigo != undefined ){
                        whereClause = `          WHERE
                                                g.CODIGO = ${codigo} ;`
                    }
                    const finalSql = sql + whereClause;
                 const [ result  ] = await dbConn.query(finalSql) 
                                return result as cad_pgru[] ;
}
