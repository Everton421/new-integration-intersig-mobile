import { brokerConnection, connectRabbitMQSistema, pubChannel } from "../broker-sistema/broker-connection.ts";
import { type event } from "../contracts/event.ts";
import { serviceSendBrands } from "../services/service-send-brands.ts";
import { serviceSendCategory } from "../services/service-send-category.ts";
import { serviceSendClient } from "../services/service-send-client.ts";
import { serviceSendOrder } from "../services/service-send-orders.ts";
import { serviceSendProdSetor } from "../services/service-send-prod-setor.ts";
import { serviceSendProduct } from "../services/service-send-product.ts";
import { serviceSendServices } from "../services/service-send-services.ts";
import { serviceSendSetor } from "../services/service-send-setor.ts";
import { serviceSendTipoOs } from "../services/service-send-tipo-os.ts";
  
/**
 * 
 * @param handler Função onde será executado o processamento da mensagem.
 */
export  async function consumer_sistema(): Promise<  any >{

    await connectRabbitMQSistema();

    if (!pubChannel || !brokerConnection) {
       console.warn("⚠️ [RabbitMQ] Sem conexão ativa.");
        return 
    }


        const QUEUE_NAME  =process.env.QUEUE_NAME_SISTEMA
        const EXCHANGE_NAME = process.env.EXCHANGE_NAME_SISTEMA
 
          if( !QUEUE_NAME ||  !EXCHANGE_NAME){
            throw new Error("Verificar variaveis de ambiente [ BASE_QUEUE_NAME,   EXCHANGE_NAME] "); 
          }
          
          const uniqueQueueName =  QUEUE_NAME  

          await pubChannel.assertExchange( EXCHANGE_NAME , 'fanout', { durable:true })
          const q = await pubChannel.assertQueue( uniqueQueueName, { durable: true });
   
          await  pubChannel.bindQueue(q.queue, EXCHANGE_NAME ,'' );

         console.log(`[*] Worker iniciado na fila [${uniqueQueueName} ] `);
       
        // channel.prefetch(1);

      await pubChannel.consume( q.queue, async ( msg )=>{
            if( msg ){
              try{
  
                let conteudo = JSON.parse(msg.content.toString()) ;

                console.log(`[v] Recebido em [${uniqueQueueName}]     `  );
                   if( conteudo && pubChannel ){
                          
                    //    await handler(conteudo.data as exchange_message|| conteudo);
                        const data = conteudo as event;
                            if(data.tabela_origem  === 'cad_prod'){
                                  await serviceSendProduct(data);
                              }
                              if(data.tabela_origem === 'cad_serv'){
                                  await serviceSendServices(data);
                              }
                              if(data.tabela_origem === 'tipos_os'){
                                await serviceSendTipoOs(data);
                              }

                               if(data.tabela_origem === 'setores'){
                                await serviceSendSetor(data);
                              }
                              if(data.tabela_origem === 'prod_setor'){
                                await serviceSendProdSetor(data);
                              }
                               if(data.tabela_origem === 'cad_clie'){
                                 await serviceSendClient(data);
                              }
                              if(data.tabela_origem === 'cad_pgru' ){
                                await serviceSendCategory(data);
                              }
                              if(data.tabela_origem === 'cad_pmar' ){
                                await serviceSendBrands(data);
                              }
                              if(data.tabela_origem === 'cad_orca'){
                                await serviceSendOrder(data)
                              }
                            pubChannel.ack(msg);
                   }else{
                    console.log("Origin: ", conteudo.metadata )
                   }

                }catch(e){
                  console.log("[x] Erro ao processar a mensagem: ",e )
              }
            }
       },{ noAck: false });

    }
