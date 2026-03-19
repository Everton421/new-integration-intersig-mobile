import {type message_movimento_produtos } from "../contracts/message-movimentos-produtos.ts";
import { consumerMobile } from "../jobs/consumer-mobile.ts";
import { insertMvto_produtos } from "../repository/repository-movimentos.ts";


export async function serviceReceiveProdSetor(){

     
        await consumerMobile('movimentosprodutos.inserido',  teste, true  );

           async function teste( data:message_movimento_produtos ){
                 console.log(data);

         await insertMvto_produtos( data)
        }

}
 