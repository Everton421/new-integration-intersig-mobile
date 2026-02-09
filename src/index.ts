import { serviceReceiveMvtoProdutos } from "./services/service-receive-mvto-produtos.ts";
import { serviceReceiveProdSetor  } from "./services/service-receive-prod-setor.ts";
import { serviceSendProdSetor } from "./services/service-send-prod-setor.ts";

     await serviceSendProdSetor();
     await serviceReceiveProdSetor();
     await serviceReceiveMvtoProdutos();