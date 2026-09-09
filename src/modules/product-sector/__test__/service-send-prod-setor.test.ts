import test from "node:test";
import { ProdSetorRepository } from "../repository-prod-setor.ts";
import { serviceSendProdSetor } from "../service-send-prod-setor.ts";


test("  SERVICE SEND PROD SECTOR ", async ( t )=>{

    await t.test("", async ( )=>{
        await serviceSendProdSetor({
            criado_em:'',
            dados_json:'',
            id:1,
            id_evento:1,
            id_message:'',
            id_registro: 56098,
            setor:1,
            status:'PENDENTE',
            tabela: 1,
            tabela_origem:'prod_setor',
            tipo_evento:'INSERT'

        })
    })
})