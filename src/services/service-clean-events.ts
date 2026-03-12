import cron from "node-cron";
import dbConn from "../connection/database-connection.ts";

        const databaseEventos = `\`${process.env.EVENTOS}\``;

export async function cleanEvents(){
            console.log(" [V] Tarefa de limpeza de eventos agendada com sucesso.");

         cron.schedule('0 0 * * 7', async ()=>{
            try{
                console.log("Limpando eventos eventos_sistema ... ")
                await dbConn.query(`DELETE  FROM ${databaseEventos}.eventos_sistema WHERE STATUS ='PROCESSADO';` );
            }catch(e){
                console.error("Erro ao tentar limpar eventos... ", e)
            }
           
         })

}
