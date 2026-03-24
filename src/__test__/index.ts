import { selectPedidoSistema } from "../repository/repository-pedido.ts";
import { serviceSendOrder } from "../services/service-send-orders.ts";

 
const dataOrders = await selectPedidoSistema();
                if(dataOrders.length > 0  ){
                    for( const i of dataOrders ){
                      await serviceSendOrder({  
                            criado_em: i.DATA_RECAD,
                                dados_json: String(i),
                                id:0,
                                id_evento:0,
                                id_message: '0',
                                id_registro: i.CODIGO,
                                setor: 0,
                                status:'PROCESSADO',
                                tabela: 0,
                                tabela_origem:'cad_orca',
                                tipo_evento:'INSERT'
                            })
                    }

                }