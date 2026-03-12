import dbConn, { EVENTOS } from "../connection/database-connection.ts";
import { type  event } from "../contracts/event.ts";
import { serviceSendBrands } from "../services/service-send-brands.ts";
import { serviceSendCategory } from "../services/service-send-category.ts";
import { serviceSendClient } from "../services/service-send-client.ts";
import { serviceSendProdSetor } from "../services/service-send-prod-setor.ts";
import { serviceSendProduct } from "../services/service-send-product.ts";
import { serviceSendServices } from "../services/service-send-services.ts";
import { serviceSendTipoOs } from "../services/service-send-tipo-os.ts";



export async function mainTask () {
    
      let exec = false;

        setInterval(async () => {
                if( exec ){
                        console.log("Tarefa anterior em execução...");
                        return
                }
                        const [resultEvent] = await dbConn.query(`SELECT * FROM ${EVENTOS}.eventos_sistema WHERE status = 'PENDENTE' ;`)

                        const event = resultEvent as event[]

                        if (event.length > 0) {
                                for (const i of event) {

                                        if(i.tabela_origem == 'cad_pmar'){
                                                 const result = await serviceSendBrands(i);
                                                 if( result != 200  ){
                                                        continue;
                                                 } 
                                        }

                                         if(i.tabela_origem == 'cad_clie'){
                                                await serviceSendClient(i);
                                         } 
                                         if(i.tabela_origem == 'cad_prod'){
                                                await serviceSendProduct(i);
                                         }      
                                         if(i.tabela_origem == 'prod_setor'){
                                                await serviceSendProdSetor(i)
                                         }
                                         if(i.tabela_origem == 'cad_pgru'){
                                                await serviceSendCategory(i)
                                         }
                                         if(i.tabela_origem == 'cad_serv'){
                                                await serviceSendServices(i)
                                         }

                                         if(i.tabela_origem === 'tipos_os'){
                                          await serviceSendTipoOs(i);
                                         }
                                }
                            }

        }, 10000)
}
