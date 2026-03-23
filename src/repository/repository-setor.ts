import dbConn, { ESTOQUE } from "../connection/database-connection.ts";
import { type  setores } from "../contracts/setores.ts";

export async function getSetores(codigo?:number){
                const baseSQl = `SELECT * FROM ${ESTOQUE}.setores `

                let whereClause = `;`;
                    if(codigo && codigo != undefined){

                        whereClause = `WHERE CODIGO = ${codigo};`;
                    }
                const sql = baseSQl + whereClause;

                const [ arrSetor] = await dbConn.query(sql);
                    return arrSetor as setores[]
}