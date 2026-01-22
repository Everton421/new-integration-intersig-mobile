import { broker } from "../broker.ts";

export const channelClientes = await broker.createChannel();

// cria a ( Exchange ) "centro de transmissão "
// 'fanout' = Espalha a mensagem para todas as filas conectadas 

await channelClientes.assertExchange('clientes', 'fanout', { durable: true });

/*
*/