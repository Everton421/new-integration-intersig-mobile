import amqplib from 'amqplib';
import { type event } from "../contracts/event.ts";
import { serviceSendBrands } from "../services/service-send-brands.ts";
import { serviceSendCategory } from "../services/service-send-category.ts";
import { serviceSendClient } from "../services/service-send-client.ts";
import { serviceSendOrder } from "../services/service-send-orders.ts";
import { serviceSendProdSetor } from "../services/service-send-prod-setor.ts";
import { serviceSendProduct } from "../services/service-send-product.ts";
import { serviceSendServices } from "../services/service-send-services.ts";
import { serviceSendSetor } from "../services/service-send-setor.ts";
import { serviceSendTipoOs } from "../services/service-send-tipo-os.ts";


export async function consumer_sistema(): Promise<any> {



  const URL = process.env.BROKER_URL_SISTEMA;
  const EXCHANGE = process.env.EXCHANGE_NAME_SISTEMA;

  const conn = await amqplib.connect(URL!);
  const channel = await conn.createChannel();

  const QUEUE_NAME = process.env.QUEUE_NAME_SISTEMA

  if (!QUEUE_NAME || !EXCHANGE) {
    throw new Error("Verificar variaveis de ambiente do broker do sistema [ BASE_QUEUE_NAME,   EXCHANGE_NAME] ");
  }

  const uniqueQueueName = QUEUE_NAME

  await channel.assertExchange(EXCHANGE, 'fanout', { durable: true })
  const q = await channel.assertQueue(uniqueQueueName, { durable: true });

  await channel.bindQueue(q.queue, EXCHANGE, '');

  console.log(`[*] Worker sistema iniciado na fila [${uniqueQueueName} ] `);

    channel.prefetch(10);

  await channel.consume(q.queue, async (msg) => {
    if (msg) {
      try {

        let conteudo = JSON.parse(msg.content.toString());

        if (conteudo  ) {

          const data = conteudo as event;
          console.log(`[X] Mensagem recebida do sistema tabela origem ${data.tabela_origem}.`)
          switch (data.tabela_origem) {
            case 'cad_prod':
                const resultProduct =  await serviceSendProduct(data);
               //resultProduct.sucess ? channel.ack(msg)   : channel.nack(msg); 
                channel.ack(msg);
               break;
            case 'cad_serv':
              const resultServices = await serviceSendServices(data);
               //resultServices.sucess ? channel.ack(msg)   : channel.nack(msg); 
              channel.ack(msg);
              break;
            case 'tipos_os':
              const resultSendTipoOs = await serviceSendTipoOs(data);
                //resultSendTipoOs.sucess ? channel.ack(msg)   : channel.nack(msg); 
              channel.ack(msg);
                break;
            case 'setores':
              const resultSendSetor = await serviceSendSetor(data);
                //resultSendSetor.sucess ? channel.ack(msg)   : channel.nack(msg); 
               channel.ack(msg);
                break;
            case 'prod_setor':
               const resultSendProdSetor = await serviceSendProdSetor(data);
                //resultSendProdSetor.sucess ? channel.ack(msg)   : channel.nack(msg); 
                channel.ack(msg);
                break;
            case 'cad_clie':
              const resultClient = await serviceSendClient(data);
               // resultClient.sucess ? channel.ack(msg)   : channel.nack(msg); 
                channel.ack(msg);
               break;
            case 'cad_pgru':
              const resutlCategory = await serviceSendCategory(data);
              //resutlCategory.sucess  ? channel.ack(msg)   : channel.nack(msg); 
                channel.ack(msg);
              break;
            case 'cad_pmar':
              const resultBrand =  await serviceSendBrands(data);
              //resultBrand.sucess ?    channel.ack(msg)  : channel.nack(msg);
                channel.ack(msg);
              break;
            case 'cad_orca':
               const resultOrder = await serviceSendOrder(data)
               //resultOrder.sucess ?    channel.ack(msg)  : channel.nack(msg);
                channel.ack(msg);
               break;
            default:
              console.log("[X] Mensagem recebida do sistema, porém nenhuma ação será executada.")
                channel.ack(msg);

          }

        } else {
          console.log("Menagem vazia: ", conteudo )
        }

      } catch (e) {
        console.log("[x] Erro ao processar a mensagem do broker do sistema: ", e)
      }
    }
  }, { noAck: false });

}
