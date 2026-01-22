import amqplib from 'amqplib'
import { type message } from '../contracts/message.ts'

if(!process.env.BROKER_URL ) throw new Error(" BROKER_URL não foi configurada.")

 export const broker = await amqplib.connect(process.env.BROKER_URL) 
 
  