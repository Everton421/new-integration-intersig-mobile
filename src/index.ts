import { seed } from "./database/seed/seed.ts";
import { consumerMobile } from "./jobs/consumer-mobile.ts";
import { consumer_sistema } from "./jobs/consumer-sistema.ts";
 

await consumer_sistema();
     await seed()

     await consumerMobile('pedido.atualizado')