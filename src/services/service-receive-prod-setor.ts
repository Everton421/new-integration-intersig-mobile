import { consumer } from "../broker/consumer.ts";
import { updateProdSetor } from "../repository/repository-prod-setor.ts";


export async function serviceReceiveProdSetor(){
        await consumer('produtosetor.atualizado', updateProdSetor );
}
 