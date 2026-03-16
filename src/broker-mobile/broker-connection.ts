import amqplib, { type ChannelModel, type Channel  } from 'amqplib';

  export let brokerConnectionMobile: ChannelModel | null = null;
  export let pubChannelMobile:   Channel | null = null;

const URL = process.env.BROKER_URL_MOBILE;
const   EXCHANGE = process.env.EXCHANGE_NAME_MOBILE;

export async function connectRabbitMQMobile(): Promise<void> {
    if (!URL) throw new Error("BROKER_URL_MOBILE não definido.");

    try {
        console.log("🔌 [RabbitMQ MOBILE] Iniciando conexão...");
        
        brokerConnectionMobile = await amqplib.connect(URL);
        pubChannelMobile = await brokerConnectionMobile.createChannel();

        await Promise.all([
               pubChannelMobile.assertExchange(EXCHANGE! , 'fanout', { durable: true }),
            
        ])
        console.log("✅ [RabbitMQ MOBILE] Conectado e Exchange configurada!");

        brokerConnectionMobile.on('error', (err) => {
            console.error("❌ [RabbitMQ MOBILE ] Erro na conexão:", err.message);
        });

        brokerConnectionMobile.on('close', () => {
            console.warn("⚠️ [RabbitMQ MOBILE] Conexão fechada. Tentando reconectar em 5s...");
            brokerConnectionMobile = null;
            pubChannelMobile = null;
            setTimeout(connectRabbitMQMobile, 5000);  
        });

    } catch (error) {
        console.error("❌ [RabbitMQ MOBILE ] Falha ao conectar. Tentando novamente em 5s...");
        setTimeout(connectRabbitMQMobile, 5000);
    }
}

 
// Função exportada para publicar mensagens
export async function publishExchangeMessage( exchange: string , routingKey: string, data: any): Promise<boolean> {
    if (!pubChannelMobile || !brokerConnectionMobile) {
        console.warn("⚠️ [RabbitMQ MOBILE] Sem conexão ativa. Mensagem não enviada.");
        return false;
    }
    try {
        const buffer = Buffer.from(JSON.stringify(data));
        return pubChannelMobile.publish(exchange, routingKey, buffer);
    } catch (error) {
        console.error("❌ [RabbitMQ MOBILE] Erro ao tentar publicar:", error);
        return false;
    }
}


 



 

