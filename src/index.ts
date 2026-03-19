import { seed } from "./database/seed/seed.ts";
import { consumerMobile } from "./jobs/consumer-mobile.ts";
import { consumer_sistema } from "./jobs/consumer-sistema.ts";
import { updateOrder } from "./services/service-receive-order.ts";
import { serviceReceiveProdSetor } from "./services/service-receive-prod-setor.ts";
 

await consumer_sistema();
     await seed()

     await consumerMobile('pedido.atualizado', updateOrder, true );
     
     await serviceReceiveProdSetor() 