import { consumer } from "../jobs/consumer-sistema.ts";
import { updateProdSetor } from "../repository/repository-prod-setor.ts";


export async function serviceReceiveProdSetor(){
        await consumer('produtosetor.atualizado', updateProdSetor );
}
 