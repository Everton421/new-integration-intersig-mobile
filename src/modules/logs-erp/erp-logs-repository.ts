import { type ResultSetHeader } from "mysql2"
import dbConn, { VENDAS } from "../../database/connection/database-connection.ts"

interface LogErpTable  {
    CODIGO:number
    APELIDO:string
    COMPUTADOR:string | null
    DATA:string
    HORA:string
    ACAO:number
    HISTORICO:string
    IP_CPU:string | null
}

type inputInsertErpLog = {
    APELIDO:string
      ACAO:number
    HISTORICO:string
    IP_CPU:string
}
export class ErpLogsRepository { 
 
    
    async createLog(  log:  inputInsertErpLog ){
      const sql =  `INSERT INTO  ${VENDAS}.log SET  
       APELIDO = ?
       , DATA = NOW(), 
       HORA = NOW(), 
       ACAO = ? ,
        HISTORICO =? ,
        IP_CPU =? 
        ;`
        const values = [log.APELIDO, log.ACAO, log.HISTORICO,log.IP_CPU  ]

            const [ result ] = await dbConn.query(sql, values)
              return result as ResultSetHeader;
    }   

}