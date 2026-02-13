import cron from "node-cron";
import dbConn from "../connection/database-connection.ts";

        const databaseEventos = `\`${process.env.EVENTOS}\``;

export async function cleanEvents(){
            console.log(" [V] Tarefa de limpeza de eventos agendada com sucesso.");

         //cron.schedule('0 0 * * 7', async ()=>{
         cron.schedule(' * * * * * ', async ()=>{
            try{
                console.log("Limpando eventos eventos_produtos_sistema ... ")
                await dbConn.query(`DELETE  FROM ${databaseEventos}.eventos_produtos_sistema WHERE STATUS ='PROCESSADO';` );
            }catch(e){
                console.error("Erro ao tentar limpar eventos... ", e)
            }
            try{
                console.log("Limpando eventos eventos_setores_sistema ... ")
               await dbConn.query(`  DELETE  FROM ${databaseEventos}.eventos_setores_sistema WHERE STATUS ='PROCESSADO';` );
              }catch(e){
                console.error("Erro ao tentar limpar eventos... ", e)
            }
            
            try{ 
                console.log("Limpando eventos  eventos_clientes_sistema ... ")
              await dbConn.query(` DELETE  FROM ${databaseEventos}.eventos_clientes_sistema WHERE STATUS ='PROCESSADO';`);
              }catch(e){
                console.error("Erro ao tentar limpar eventos... ", e)
            }
  
            try{ 
                console.log("Limpando eventos eventos_recebimentos_sistema ... ")
              await dbConn.query(` DELETE  FROM ${databaseEventos}.eventos_recebimentos_sistema WHERE STATUS ='PROCESSADO';`);
              }catch(e){
                console.error("Erro ao tentar limpar eventos... ", e)
            }
            try{ 
                console.log("Limpando eventos eventos_pedidos_sistema ... ")
                await dbConn.query(` DELETE  FROM ${databaseEventos}.eventos_pedidos_sistema WHERE STATUS ='PROCESSADO';`);
            }catch(e){
                console.error("Erro ao tentar limpar eventos... ", e)
            }
  
         })

}
