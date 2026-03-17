import { selectParcelasDoPedido, selectProdutoDoPedido } from "../repository/repository-itens-pedido.ts";
import { selectClientePedido, selectPedidoSistema } from "../repository/repository-pedido.ts";
import { serviceSendClient } from "../services/service-send-client.ts";
import { DateService } from "../utils/date.ts";

export async function orderMapper(codigo_sistema:number) {

            const dateService = new DateService();

            const result_erp_order= await selectPedidoSistema(codigo_sistema);
        
            if(result_erp_order.length > 0 ){
                const erp_order =   result_erp_order[0];
                const arr_produtos = await selectProdutoDoPedido(codigo_sistema);
                 let arrClient  = await selectClientePedido(erp_order.CLIENTE);

                if(arrClient.length === 0 ){
                    console.log(`[X] Não foi encontrado  cliente do pedido codigo: ${codigo_sistema} no sistema.`)
                await serviceSendClient({ id_registro: erp_order.CLIENTE, criado_em:'', dados_json:'', id:0, id_evento:0, id_message:'', setor:0, status:'PENDENTE', tabela:0, tabela_origem:'cad_clie', tipo_evento:'UPDATE'})
                }

                   arrClient  = await selectClientePedido(erp_order.CLIENTE);


                    const prod:any=[]
                    if(arr_produtos.length >  0 ){
                        for( const i of arr_produtos ) {
                            prod.push(
                                                {
                                                     pedido : codigo_sistema,
                                                     codigo : i.id,
                                                     desconto : i.DESCONTO,
                                                     quantidade : i.QUANTIDADE,
                                                     preco : i.PRECO_TABELA,
                                                     total : i.TOTAL_LIQ,
                                                     quantidade_faturada : i.QTDE_FATURADA,
                                                     quantidade_separada : i.QTDE_SEPARADA
                                                }
                            )
                        }
                    }else{
                    console.log(`[X] Não foi encontrado produtos do pedido codigo: ${codigo_sistema} no sistema.`)
                        return;
                    }

                    const arr_parcelas = await selectParcelasDoPedido(codigo_sistema);

                    const parcelas :any[] =[]
                        for( const i of arr_parcelas ){
                            parcelas.push( {
                                                     pedido : codigo_sistema,
                                                     parcela : i.PARCELA,
                                                     valor : i.VALOR,
                                                     vencimento : i.VENCIMENTO
                                                }
                                          )
                            }
                        const obj =  {       codigo :  codigo_sistema ,
                                             id :  codigo_sistema ,
                                             id_externo :   erp_order.COD_SITE   ,
                                             id_interno :   erp_order.COD_SITE ,
                                             codigo_cliente :  arrClient[0].id_mobile  ,
                                             vendedor :  erp_order.VENDEDOR ,
                                             situacao :   erp_order.SITUACAO ,
                                             situacao_separacao :  erp_order.SIT_SEPAR ,
                                             contato :  erp_order.CONTATO ,
                                             descontos :  erp_order.DESC_PROD ,
                                             frete: erp_order.VALOR_FRETE,
                                             forma_pagamento :  erp_order.FORMA_PAGAMENTO ,
                                             observacoes : erp_order.OBSERVACOES   ,
                                             quantidade_parcelas :  erp_order.QTDE_PARCELAS  ,
                                             total_geral :  erp_order.TOTAL_GERAL ,
                                             total_produtos : erp_order.TOTAL_PRODUTOS ,
                                             total_servicos :  erp_order.TOTAL_SERVICOS ,
                                             cliente : {
                                                 codigo :  arrClient[0].id_mobile   
                                            },
                                             veiculo :  erp_order.VEICULO ,
                                             data_cadastro :    erp_order.DATA_CADASTRO ,
                                             data_recadastro :   dateService.obterDataHoraAtual() ,
                                             tipo_os :   erp_order.TIPO_OS ,
                                             enviado : "S",
                                             tipo :  erp_order.TIPO ,
                                             produtos:  prod,
                                             servicos : [],
                                             parcelas :   parcelas 
                                        }
                                        
                                     
                                     return obj;

            }else{
                console.log(`[X] Não foi encontrado pedido codigo: ${codigo_sistema} no sistema.`)

            }

}