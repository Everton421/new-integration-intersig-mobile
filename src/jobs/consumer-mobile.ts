import amqplib from 'amqplib'

export async function consumerMobile(domain:string) {
    
try{

    const BROKER_URL_MOBILE = process.env.BROKER_URL_MOBILE;
 
    const conn = await amqplib.connect(BROKER_URL_MOBILE!);
    
        const channel = await conn.createChannel();

         const BASE_QUEUE_NAME  =process.env.QUEUE_NAME_MOBILE
        const CNPJ = process.env.CNPJ;
        const EXCHANGE_NAME = process.env.EXCHANGE_NAME_MOBILE
         const origin = process.env.API_ORIGIN_NAME || 'erp_integration';
 
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
                    
                console.log(conteudo)



                }catch(e){
                  console.log("[x] Erro ao processar a mensagem: ",e )
              }
            }
       },{ noAck: false });

}catch( e ){
    console.log('ERRO ', e);
} 

    }
