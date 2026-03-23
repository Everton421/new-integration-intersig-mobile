import { seed } from "./database/seed/seed.ts";
import { insertMvto_produtos } from "./repository/repository-movimentos.ts";
import { updateProdSetor } from "./repository/repository-prod-setor.ts";
import { consumerMobile } from "./services/consumer-mobile.ts";
import { consumer_sistema } from "./services/consumer-sistema.ts";
import { updateOrder } from "./services/service-receive-order.ts";
 

await consumer_sistema();
     await seed()

     await consumerMobile('pedido.atualizado', updateOrder, true );
     
     await consumerMobile('produtosetor.atualizado',updateProdSetor, true ) 
     await consumerMobile('movimentosprodutos.inserido',insertMvto_produtos, true ) 