import { brokerConnection, connectRabbitMQSistema, pubChannel } from "../broker-sistema/broker-connection.ts";
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

/**
 * 
 * @param handler Função onde será executado o processamento da mensagem.
 */
export async function consumer_sistema(): Promise<any> {

  await connectRabbitMQSistema();

  if (!pubChannel || !brokerConnection) {
    console.warn("⚠️ [RabbitMQ] Sem conexão com o broker do sistema .");
    return
  }


  const QUEUE_NAME = process.env.QUEUE_NAME_SISTEMA
  const EXCHANGE_NAME = process.env.EXCHANGE_NAME_SISTEMA

  if (!QUEUE_NAME || !EXCHANGE_NAME) {
    throw new Error("Verificar variaveis de ambiente do broker do sistema [ BASE_QUEUE_NAME,   EXCHANGE_NAME] ");
  }

  const uniqueQueueName = QUEUE_NAME

  await pubChannel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: true })
  const q = await pubChannel.assertQueue(uniqueQueueName, { durable: true });

  await pubChannel.bindQueue(q.queue, EXCHANGE_NAME, '');

  console.log(`[*] Worker iniciado na fila [${uniqueQueueName} ] `);

  // channel.prefetch(1);

  await pubChannel.consume(q.queue, async (msg) => {
    if (msg) {
      try {

        let conteudo = JSON.parse(msg.content.toString());

        console.log(`[v] Recebido em [${uniqueQueueName}]     `);
        if (conteudo && pubChannel) {

          //    await handler(conteudo.data as exchange_message|| conteudo);
          const data = conteudo as event;

          switch (data.tabela_origem) {
            case 'cad_prod':
              await serviceSendProduct(data);
              break;
            case 'cad_serv':
              await serviceSendServices(data);
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
              console.log("[X] Mensagem recebida do sisema, porém nenhuma ação será executada.")
              pubChannel.ack(msg);
          }

        } else {
          console.log("Origin: ", conteudo.metadata)
        }

      } catch (e) {
        console.log("[x] Erro ao processar a mensagem do broker do sistema: ", e)
      }
    }
  }, { noAck: false });

}
