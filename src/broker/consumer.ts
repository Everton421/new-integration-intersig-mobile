import { captureRejectionSymbol } from "node:events";
import {   connection, connectRabbitMQ, createChannel } from "./broker-connection.ts";

    /**
     * 
     * @param domain Ex.: "produtosetor.atualizado" | "produto.inserido"
     */
   export  async function consumer(domain: string , handler: ( data:any)=>Promise<void> ): Promise<  any >{
    await connectRabbitMQ()
  const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

      // 1. cria um canal exclusivo
     const channel = await createChannel();

        const BASE_QUEUE_NAME  =process.env.QUEUE_NAME
        const CNPJ = process.env.CNPJ;
        const EXCHANGE_NAME = process.env.EXCHANGE_NAME
 
          if( !BASE_QUEUE_NAME || !CNPJ || !EXCHANGE_NAME){
            throw new Error("Verificar variaveis de ambiente [ BASE_QUEUE_NAME, CNPJ,  EXCHANGE_NAME] "); 
          }

          
          // substitui [ . ] por [ _ ]
          const uniqueQueueName = `${BASE_QUEUE_NAME}_${domain.replace(/\./g, '_')}`;

          await channel.assertExchange( EXCHANGE_NAME , 'topic', { durable:true })
          // 2. cria uma fila unica para este worker
          const q = await channel.assertQueue( uniqueQueueName, { durable: true });
   
          // 3. bind 
          const routingKey = `tenant.${CNPJ}.${domain}`
          await  channel.bindQueue(q.queue, EXCHANGE_NAME ,routingKey );

       console.log(`[*] Worker iniciado na fila [${uniqueQueueName} ] ouvindo  ${routingKey}`);
       
        // channel.prefetch(1);

      await channel.consume( q.queue, async ( msg )=>{
            if( msg ){
              try{
  
                let conteudo = JSON.parse(msg.content.toString());

                console.log(`[v] Recebido em [${uniqueQueueName}]  | Key: ${msg.fields.routingKey}`  );
                   if( conteudo.metadata.origin){
                      if(  conteudo.metadata.origin !== origin){
                          await handler(conteudo.data || conteudo);
                        channel.ack(msg);
                      }else{
                        console.log(`[X] A mensagem não será consumida, conteudo gerado por ${conteudo.metadata.origin}... `)
                      }
                   }else{
                    console.log("Origin: ", conteudo.metadata.origin)
                   }

                }catch(e){
                  console.log("[x] Erro ao processar a mensagem: ",e )
              }
            }
       },{ noAck: false });

    }

