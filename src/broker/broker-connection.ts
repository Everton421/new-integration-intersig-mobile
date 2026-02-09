import amqplib, { type ChannelModel, type Channel  } from 'amqplib';

  export let connection: ChannelModel | null = null;

const BROKER_URL = process.env.BROKER_URL;

export async function connectRabbitMQ(): Promise<ChannelModel> {
    if (!BROKER_URL) throw new Error("BROKER_URL não definido.");
    
    if(connection){
        return connection;
    }

    try {
        console.log("🔌 [RabbitMQ] Iniciando conexão...");
        
        connection = await amqplib.connect(BROKER_URL);

        console.log("✅ [RabbitMQ] Conectado e Exchange configurada!");

        connection.on('error', (err) => {
            console.error("❌ [RabbitMQ] Erro na conexão:", err.message);
        });

        connection.on('close', () => {
            console.warn("⚠️ [RabbitMQ] Conexão fechada. Tentando reconectar em 5s...");
            connection = null;
            setTimeout(connectRabbitMQ, 5000);  
        });
        return connection;

    } catch (error) {
        console.error("❌ [RabbitMQ] Falha ao conectar");
        throw error;
    }
}
 
export async function createChannel(): Promise<Channel> {
    const conn = await connectRabbitMQ();
    return await conn.createChannel();
}