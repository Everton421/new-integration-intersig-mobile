import { type pedidosRecebidos } from "./contracts/pedidos-recebidos.ts";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { api } from "../../services/api.ts";
import { type MessageSeparationOrder } from "./contracts/message-separation-order.ts";
import { SalesOrderRepository } from "./repository-pedido.ts";


  type messagePatchOrderRequest = { 
    codigo:number
    cliente?:number
    fornecedor?:number
    vendedor?:number
    situacao?:string
    situacao_separacao?:string
    contato?:string
    descontos?:number
    frete?:number
    forma_pagamento?:number
    quantidade_parcelas?:number
    total_geral?:number
    total_produtos?:number
    total_servicos?:number
    veiculo?:number
    data_cadastro?:string
    data_recadastro?:string
    tipo_os?:number
    tipo?:number
    observacoes?:string
    operacao?:string
    setor?:number
    usuario?:number
    usuario_separacao?:number
    inicio_separacao?:string
    fim_separacao?:string
    status_separacao?:string
    observacoes_separacao?:string
    filial?:number
    id_interno?:string
    id_externo?:string
 
}

export class UpdateSalesOrderSeparation {
    
  /**
   *  
   * @param order mensagem vinda do rabbitmq com informacoes do pedido 
   * @returns 
   */
   static async updateErpOrderSeparation (messageorder:MessageSeparationOrder){
     let resultFunctionUpdateErpOrder = { success: false, message:null } as  { success: boolean , message: null | string }

            try{
                 if(messageorder.pedido){
                    const resultRequestOrder = await api.get(`/pedidos/${messageorder.pedido}`);
                      if(resultRequestOrder.status == 200 && resultRequestOrder.data  ){
                            const order  = resultRequestOrder.data;

                                if(order.tipo === 1 ){
                                
                                    const [rows] =  await dbConn.query(`SELECT * FROM ${MOBILE}.pedidos WHERE id_mobile = '${messageorder.pedido}' `);
                                    const verify = rows as pedidosRecebidos[];
                                            
                                      if( verify.length > 0 ){
                                          const resultUpdateSeparationOrder = await SalesOrderRepository.updateSeparationOrder(resultRequestOrder.data, verify[0].codigo_sistema )    
                                          if(resultUpdateSeparationOrder.success ){                                            
                                            resultFunctionUpdateErpOrder.success = true;
                                          }else{
                                            resultFunctionUpdateErpOrder.message = resultUpdateSeparationOrder.message || `[X] Algo de inesperado ocorreu ao tentar processar pedido ${order.codigo}`;
                                          }
                                        }else{
                                           resultFunctionUpdateErpOrder.message =  `[x] Pedido ${messageorder.pedido} não foi registrado na tabela de pedidos do banco ${MOBILE}.`;
                                            console.log(resultFunctionUpdateErpOrder.message)
                                        }
                                }else{
                                   resultFunctionUpdateErpOrder.message =  `[x] Pedido ${messageorder.pedido} tipo: ${order.tipo} possui um tipo diferente do esperado.`;
                                    console.log(resultFunctionUpdateErpOrder.message)
                                }
                            
                        }else{
                               resultFunctionUpdateErpOrder.message =  `[x] A api não retornou o pedido ${messageorder.pedido}  .`;
                                console.log(resultFunctionUpdateErpOrder.message)
                        }
                  
                    }else{
                        console.log(`[x] Valor do codigo do pedido invalido, valor informado ${messageorder.pedido}.`)
                    }

                }catch(e){
                    console.log(`[X] Ocorreu um erro ao tentar processar pedido ${messageorder.pedido} `, e );
                }finally{
                   return resultFunctionUpdateErpOrder;
                }
            }

                
  /**
   *  
   * @param order mensagem vinda do rabbitmq com informacoes do pedido 
   * @returns 
   */
   static async updateErpOrder (messageorder: messagePatchOrderRequest ){
     let resultFunctionUpdateErpOrder = { success: false, message:null } as  { success: boolean , message: null | string }

            try{
                 if(messageorder.codigo){
                    const resultRequestOrder = await api.get(`/pedidos/${messageorder.codigo}`);
                      if(resultRequestOrder.status == 200 && resultRequestOrder.data  ){
                            const order  = resultRequestOrder.data;

                                if(order.tipo === 1 ){
                                
                                    const [rows] =  await dbConn.query(`SELECT * FROM ${MOBILE}.pedidos WHERE id_mobile = '${messageorder.codigo}' `);
                                    const verify = rows as pedidosRecebidos[];
                                            
                                      if( verify.length > 0 ){
                                          const resultUpdateSeparationOrder = await SalesOrderRepository.updateSeparationOrder(resultRequestOrder.data, verify[0].codigo_sistema )    
                                          if(resultUpdateSeparationOrder.success ){                                            
                                            resultFunctionUpdateErpOrder.success = true;
                                          }else{
                                            resultFunctionUpdateErpOrder.message = resultUpdateSeparationOrder.message || `[X] Algo de inesperado ocorreu ao tentar processar pedido ${order.codigo}`;
                                          }
                                        }else{
                                           resultFunctionUpdateErpOrder.message =  `[x] Pedido ${messageorder.codigo} não foi registrado na tabela de pedidos do banco ${MOBILE}.`;
                                            console.log(resultFunctionUpdateErpOrder.message)
                                        }
                                }else{
                                   resultFunctionUpdateErpOrder.message =  `[x] Pedido ${messageorder.codigo} tipo: ${order.tipo} possui um tipo diferente do esperado.`;
                                    console.log(resultFunctionUpdateErpOrder.message)
                                }
                            
                        }else{
                               resultFunctionUpdateErpOrder.message =  `[x] A api não retornou o pedido ${messageorder.codigo}  .`;
                                console.log(resultFunctionUpdateErpOrder.message)
                        }
                  
                    }else{
                        console.log(`[x] Valor do codigo do pedido invalido, valor informado ${messageorder.codigo}.`)
                    }

                }catch(e){
                    console.log(`[X] Ocorreu um erro ao tentar processar pedido ${messageorder.codigo} `, e );
                }finally{
                   return resultFunctionUpdateErpOrder;
                }
            }


    }
