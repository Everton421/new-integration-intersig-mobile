import amqplib, { type ChannelModel, type Channel  } from 'amqplib';

  export let brokerConnection: ChannelModel | null = null;
  export let pubChannel:   Channel | null = null;

const URL = process.env.BROKER_URL_SISTEMA;
const   EXCHANGE = process.env.EXCHANGE_NAME_SISTEMA;

export async function connectRabbitMQSistema(): Promise<void> {
    if (!URL) throw new Error("BROKER_URL do sistema não definido.");

    try {
        console.log("🔌 [RabbitMQ] Iniciando conexão com o broker do sistema ...");
        
        brokerConnection = await amqplib.connect(URL);
        pubChannel = await brokerConnection.createChannel();

        await Promise.all([
               pubChannel.assertExchange(EXCHANGE! , 'fanout', { durable: true }),
            
        ])
        console.log("✅ [RabbitMQ] Conectado com broker do sistema e Exchange configurada!");

        brokerConnection.on('error', (err) => {
            console.error("❌ [RabbitMQ] Erro na conexão com o broker do sistema:", err.message);
        });

        brokerConnection.on('close', () => {
            console.warn("⚠️ [RabbitMQ] Conexão fechada com o broker do sistema. Tentando reconectar em 5s...");
            brokerConnection = null;
            pubChannel = null;
            setTimeout(connectRabbitMQSistema, 5000);  
        });

    } catch (error) {
        console.error("❌ [RabbitMQ] Falha ao conectar com o broker do sistema. Tentando novamente em 5s...");
        setTimeout(connectRabbitMQSistema, 5000);
    }
}

 
// Função exportada para publicar mensagens
export async function publishExchangeMessage( exchange: string , routingKey: string, data: any): Promise<boolean> {
    if (!pubChannel || !brokerConnection) {
        console.warn("⚠️ [RabbitMQ] Sem conexão com o broker do sistema ativa. Mensagem não enviada.");
        return false;
    }
    try {
        const buffer = Buffer.from(JSON.stringify(data));
        return pubChannel.publish(exchange, routingKey, buffer);
    } catch (error) {
        console.error("❌ [RabbitMQ] Erro ao tentar publicar no broker do sistema:", error);
        return false;
    }
}


 



 

