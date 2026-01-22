import { broker } from "../broker.ts";

export const channelProdutos = await broker.createChannel();

// cria a ( Exchange ) " Central de transmissão "
// 'fanout' = espalha a mensagem para todas as filas conectadas 

await channelProdutos.assertExchange('produtos', 'fanout', { durable: true });


