import amqplib from 'amqplib'
import dbConn, { MOBILE } from '../connection/database-connection.ts';
import { type  table_enviados } from '../contracts/table-enviados.ts';
import { api } from '../services/api.ts';
import { type IPedidoSistema, updatePedido } from '../repository/repository-pedido.ts';

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
                if(conteudo.metadata.origin != origin ){
                
                    const codigoMobile = conteudo.data.codigo  
                    const [arrVerifyOrder] = await dbConn.query(`SELECT * FROM ${MOBILE}.pedidos WHERE id_mobile = ${codigoMobile}`);
                    const verifyOrder = arrVerifyOrder as table_enviados[];
                    
                    const resultApiOrder = await api.get(`/pedido?codigo=${codigoMobile}`);
                          if(resultApiOrder.data.length >  0){
                               const order = resultApiOrder.data[0] as IPedidoSistema ; 
                                  await updatePedido(order,verifyOrder[0].codigo_sistema );

                          }else{

                      console.log(`[X] não foi encontrado pedido codigo ${codigoMobile} na consulta da api.`)
                          }  

                    if(verifyOrder.length > 0 ){

                       
                    }else{
                      console.log(`[X] não foi encontrado pedido codigo ${codigoMobile} na tabela de pedidos.`)
                    }
                }
                console.log(`[v] Recebido em [${uniqueQueueName}]  | Key: ${msg.fields.routingKey}`  );


                }catch(e){
                  console.log("[x] Erro ao processar a mensagem: ",e )
              }
            }
       },{ noAck: false });

}catch( e ){
    console.log('ERRO ', e);
} 

    }
