import { serviceReceiveMvtoProdutos } from "./services/service-receive-mvto-produtos.ts";
import { serviceReceiveProdSetor  } from "./services/service-receive-prod-setor.ts";
import { serviceSendProduct } from "./services/service-send-product.ts";

     await serviceSendProduct();
     await serviceReceiveProdSetor();
     await serviceReceiveMvtoProdutos();