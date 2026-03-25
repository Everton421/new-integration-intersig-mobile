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

    channel.prefetch(1);

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
               break;
            case 'cad_serv':
              const resultServices = await serviceSendServices(data);
               break;
            case 'tipos_os':
              await serviceSendTipoOs(data);
              break;
            case 'setores':
              await serviceSendSetor(data);
              break;
            case 'prod_setor':
              await serviceSendProdSetor(data);
              break;
            case 'cad_clie':
              await serviceSendClient(data);
              break;
            case 'cad_pgru':
              await serviceSendCategory(data);
              break;
            case 'cad_pmar':
              await serviceSendBrands(data);
              break;
            case 'cad_orca':
              await serviceSendOrder(data)
              break;
            default:
              console.log("[X] Mensagem recebida do sistema, porém nenhuma ação será executada.")
          }
              channel.ack(msg);

        } else {
          console.log("Menagem vazia: ", conteudo )
        }

      } catch (e) {
        console.log("[x] Erro ao processar a mensagem do broker do sistema: ", e)
      }
    }
  }, { noAck: false });

}
