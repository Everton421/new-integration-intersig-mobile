import { type  message } from "../../contracts/message.ts";
import { type  Channel } from "amqplib";
import { channels } from "../channels/channels.ts";

export async function dispathClientes( data:message ){
   const result = await channels.channelClientes.sendToQueue('clientes', Buffer.from( JSON.stringify(data)))
        return result;
}