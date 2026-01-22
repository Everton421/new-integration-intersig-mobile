import amqplib from 'amqplib'

export async function testeConsumerEcommerce() {
try{

        const conn = await amqplib.connect('amqp://localhost');

    
        const channel = await conn.createChannel();
        const EXCHANGE = 'produtos';
        // garante que a exchange exista ( caso o producer nao tenha sido iniciado)
          await channel.assertExchange( EXCHANGE,  'fanout', { durable: true});

          // cria uma fila exclusiva para o ecommerce 
          // se o nome for fixo as mensagens acumulam quando o app cai.
         const q = await channel.assertQueue('ecommerce_produtos', { durable: true });

        // ** AMARRA  a fila do ecommerce na exchange do ERP
        // tudo que chgar na exchange dos produtos será copiado para a fila do ecommerce

        await channel.bindQueue(q.queue, EXCHANGE,'' );
        console.log( " [*] E-commerce aguardando produtos... ");

            channel.consume( q.queue, ( msg )=>{
                if( msg){
                    const content = JSON.parse( msg.content.toString());
                    console.log(`[ Ecommerce ] atualizando site para roduto ID ${content.id_registro}`)
                
                    channel.ack(msg);
                }
            })   
}catch( e ){
    console.log('ERRO ', e);
} 

    }
