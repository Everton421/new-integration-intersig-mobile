import { type LoteSerieSetorInput, ReceiveLoteSerieSetor } from "./modules/lote-serie-setor/service-receive-lote-serie-setor.ts";
import { type EventLoteSerie } from "./modules/lotes-series/contracts/event-lote-serie.ts";
import { ReceiveLoteSerieService } from "./modules/lotes-series/service-receive-lote-serie.ts";
import { type message_movimento_produtos } from "./modules/product-movment/contracts/message-movimentos-produtos.ts";
import { insertMvto_produtos } from "./modules/product-movment/repository-movimentos.ts";
import { type message_prod_setor } from "./modules/product-sector/contracts/message-prod-setor.ts";
import { ProdSetorRepository } from "./modules/product-sector/repository-prod-setor.ts";
import { type MessageSeparationOrder } from "./modules/sales-order/contracts/message-separation-order.ts";
import { UpdateSalesOrderSeparation } from "./modules/sales-order/service-receive-sales-order-separation.ts";


type metadataRequest = {
      tenant_id: string,
      event: string,
      timestamp: string,
      origin: string
}


 const port = process.env.PORT_INTEGRATION || 5000;

import express, { type Request } from 'express';
import { consumerMobile } from "./services/consumer-mobile.ts";
import { consumer_sistema } from "./services/consumer-sistema.ts";
import { ReceiveRequirement } from "./modules/requirement/use-cases/receive-requirement.ts";
import { ReceiveRequirementSubmitted } from "./modules/requirement/use-cases/receive-requirement-submitted.ts";
import { UpdateReceivedRequirementService } from "./modules/requirement/use-cases/update-received-requirement.ts";

const app = express();

app.use(express.json());


app.post("/webhook", async (req: Request, res) => {
      const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

      const metadata = req.body.metadata as metadataRequest;

      console.log(`[WEBHOOK] Recebido mensagem ${metadata.event}...`)
      if (metadata.origin == origin) {
            console.log(`[WEBHOOK] Mensagem ${metadata.event} não será processada.`)
            return
      }


      if (metadata.event == 'pedido.separado') {
            const data = req.body.data as MessageSeparationOrder;
            await UpdateSalesOrderSeparation.updateErpOrderSeparation(data);
      }

      if (metadata.event == 'produtosetor.atualizado') {
            const data = req.body.data as message_prod_setor;
            await ProdSetorRepository.updateProdSetor(data);
      }
      if (metadata.event == 'movimentosprodutos.inserido') {
            const data = req.body.data as message_movimento_produtos;
            await insertMvto_produtos(data)
      }

      if (metadata.event == 'lotesserie.inserido') {
            const data = req.body.data as EventLoteSerie;

            await ReceiveLoteSerieService.receiveByEvent(data);
      }
      if (metadata.event == 'loteseriesetor.atualizado') {
            const data = req.body.data as LoteSerieSetorInput;
            await ReceiveLoteSerieSetor.receive(data);
      }
      return res.status(200).json({ ok: true })
})

app.get("/webhook/health", (req, res)=>{
      return res.status(200).json({ok: true })
})

app.listen(port, () => {
      console.log(`Server is running port: ${port}! `)
})



  await consumer_sistema();


await consumerMobile('pedido.separado', UpdateSalesOrderSeparation.updateErpOrderSeparation, true)
 await consumerMobile('pedido.atualizado', UpdateSalesOrderSeparation.updateErpOrder, true)

await consumerMobile('produtosetor.atualizado', ProdSetorRepository.updateProdSetor, true)

await consumerMobile('movimentosprodutos.inserido', insertMvto_produtos, true)

await consumerMobile('lotesserie.inserido', ReceiveLoteSerieService.receiveByEvent, true);

await consumerMobile('loteseriesetor.atualizado', ReceiveLoteSerieSetor.receive , true);


await consumerMobile('requerimento.inserido', ReceiveRequirement.receive , true);

  await consumerMobile('requerimento.efetuado', ReceiveRequirementSubmitted.receive , false);
// await consumerMobile('requerimento.atualizado', UpdateReceivedRequirementService.receive , false);

 