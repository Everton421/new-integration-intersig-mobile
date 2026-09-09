import { repositoryItensSalesOrder   } from "./repository-itens-pedido.ts";
import { DateService } from "../../utils/date.ts";
import dbConn, { MOBILE, VENDAS } from "../../database/connection/database-connection.ts";
import { SalesOrderRepository } from "./repository-pedido.ts";
import { ServiceSendCustomer } from "../customer/service-send-customer.ts";


type typeresultDefaultSector = { SETOR:number};


export class OrderMapper {
    static async mapping(codigo_sistema:number ){

            const dateService = new DateService();

            const result_erp_order= await SalesOrderRepository.findSalesOrderErp(codigo_sistema);
        
            if(result_erp_order.length > 0 ){
                const erp_order =   result_erp_order[0];
                const arr_produtos = await repositoryItensSalesOrder.findItemsSalesOrder(codigo_sistema);

                 let    codigoClienteMobile = erp_order.CLIENTE || 0 ;
                 
                if(erp_order.CLIENTE != 0 ){
                    
                let [resultArrClient]  = await  dbConn.query( `SELECT * FROM ${MOBILE}.clientes_enviados WHERE codigo_sistema = '${erp_order.CLIENTE}';`);
                let arrClient =  resultArrClient as any[];
                
                if(arrClient.length === 0 ){
                    console.log(`[X] Não foi encontrado registro do envio do cliente do pedido de venda [ERP] codigo: ${codigo_sistema} cliente ${erp_order.CLIENTE} .`)
                    console.log(`[V] Verificando possibilidade de envio do cliente[ERP] ${erp_order.CLIENTE}.`)
                        const resultServiceSyncCustomer = await ServiceSendCustomer.send(erp_order.CLIENTE);  
                        if(resultServiceSyncCustomer.success){
                        }else{
                            console.log(`[X] Não foi possivel enviar o cliente [ERP] ${erp_order.CLIENTE} do pedido ${codigo_sistema}, resultado da tentativa de envio ${resultServiceSyncCustomer.message}`)
                        }
                            arrClient  = await SalesOrderRepository.findCustomerSalesOrder(erp_order.CLIENTE);
                              arrClient  = await SalesOrderRepository.findCustomerSalesOrder(erp_order.CLIENTE);
                            codigoClienteMobile = arrClient[0].id_mobile;
                    }

                }

                    const prod:any=[]
                        for( const i of arr_produtos ) {
                            const series = []
                             const resultSeries = await repositoryItensSalesOrder.findSeriesSalesOrder(codigo_sistema);
                                for(const serie of resultSeries){
                                    series.push({
                                         lote_serie : Number(serie.CODIGO),
                                         quantidade : String(serie.QTDE_SEPARADA),
                                         serie : String(serie.SERIE),
                                         lote : null
                                    })
                                } 

                            prod.push(
                                                {
                                                     pedido : codigo_sistema,
                                                     sequencia: i.SEQUENCIA,
                                                     codigo : i.id,
                                                     desconto : i.DESCONTO,
                                                     quantidade : i.QUANTIDADE,
                                                     preco : i.PRECO_TABELA,
                                                     total : i.TOTAL_LIQ,
                                                     quantidade_faturada : i.QTDE_FATURADA,
                                                     quantidade_separada : i.QTDE_SEPARADA,
                                                      controle_lote_serie: i.controle_lote_serie,
                                                      series:series
                                                }
                            )
                        }
                  

                    const arr_parcelas = await  repositoryItensSalesOrder.findInstallmentsSalesOrder(codigo_sistema);

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


                        const [resultDefaultSector] = await dbConn.query(` SELECT SETOR from  ${VENDAS}.empresas_setor 
                                WHERE FILIAL = ( SELECT MIN(FILIAL) FROM ${VENDAS}.empresas_setor)
                                AND PADRAO_VENDA = 'X'  Limit 1`)  ;

                            const defaultSector = resultDefaultSector as typeresultDefaultSector[];
                            let setor = defaultSector[0].SETOR;
                            
                            if(erp_order.SETOR > 0 ){
                                setor =erp_order.SETOR;
                            }

                            let tipo = 1;
                            if( erp_order.TIPO == 3 ){
                                tipo = 3;
                            }

                            const obj =  {        
                                             id :  `#V-${codigo_sistema}` , 
                                             id_externo :   String(codigo_sistema)   ,
                                             id_interno :   String(codigo_sistema) ,
                                             vendedor :  erp_order.VENDEDOR ,
                                             situacao :   erp_order.SITUACAO ,
                                             situacao_separacao :  erp_order.SIT_SEPAR ,
                                             contato :  erp_order.CONTATO ,
                                             descontos :  erp_order.DESC_PROD ,
                                             frete: erp_order.VALOR_FRETE,
                                             forma_pagamento :  erp_order.FORMA_PAGAMENTO ,
                                             observacoes : erp_order.OBSERVACOES || ''  ,
                                             observacoes2 : erp_order.OBSERVACOES2 || ''   ,
                                             quantidade_parcelas :  erp_order.QTDE_PARCELAS  ,
                                             total_geral :  erp_order.TOTAL_GERAL ,
                                             total_produtos : erp_order.TOTAL_PRODUTOS ,
                                             total_servicos :  erp_order.TOTAL_SERVICOS ,
                                             cliente : {
                                                 codigo :  Number(codigoClienteMobile)   
                                            },
                                             veiculo :  erp_order.VEICULO ,
                                             data_cadastro :    erp_order.DATA_CADASTRO ,
                                             data_recadastro :   dateService.obterDataHoraAtual() ,
                                             tipo_os :   erp_order.TIPO_OS ,
                                             enviado : "S",
                                             tipo :  tipo ,
                                             produtos:  prod,
                                             servicos : [],
                                             parcelas :   parcelas,
                                             operacao : 'V',
                                            setor: setor || 1, 
                                            filial: erp_order.FILIAL
                                        }
                                        
                                     
                                     return obj;

            }else{
                console.log(`[X] Não foi encontrado pedido codigo: ${codigo_sistema} no sistema.`)

            }
    }
}