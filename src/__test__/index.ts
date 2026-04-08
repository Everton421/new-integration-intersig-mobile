import { serviceSendProduct } from "../services/service-send-product.ts";

 

const result=  await serviceSendProduct({
    criado_em:'',
    dados_json: null,
    id: 1909,
    id_evento: 0,
    id_message: '',
    id_registro: 1363,
    setor:0,
    status: 'PROCESSADO',
    tabela:  0,
    tabela_origem: "cad_prod",
    tipo_evento: 'DELETE'
 })

 console.log(result);