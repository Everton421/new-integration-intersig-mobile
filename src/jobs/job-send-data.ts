import { getBrand } from "../repository/repository-brand.ts";
import { getAllClients } from "../repository/repository-client.ts";
import { getAllProdSetor } from "../repository/repository-prod-setor.ts";
import { getProduct } from "../repository/repository-produto.ts";
import { getSetores } from "../repository/repository-setor.ts";
import { getCategory } from "../repository/repositry-category.ts";
import { serviceSendBrands } from "../services/service-send-brands.ts";
import { serviceSendCategory } from "../services/service-send-category.ts";
import { serviceSendClient } from "../services/service-send-client.ts";
import { serviceSendProdSetor } from "../services/service-send-prod-setor.ts";
import { serviceSendProduct } from "../services/service-send-product.ts";
import { serviceSendSetor } from "../services/service-send-setor.ts";


async function jobSendData(){
          const dataProd = await getProduct ();
        if(dataProd.length >  0 ){
            for( const i of dataProd ){
                await serviceSendProduct({
                    criado_em: i.data_cadastro,
                    dados_json: String(i),
                    id:  0 ,
                    id_evento:  0 ,
                    id_message: '0',
                    id_registro: i.codigo,
                    setor: 0,
                    status: 'PROCESSADO',
                    tabela:  0 ,
                    tabela_origem: 'cad_prod',
                    tipo_evento: 'UPDATE'
                     
                })
            }
        }

  

            const dataClient = await getAllClients();
            for( const i of dataClient ){
                await serviceSendClient({ 
                    criado_em: i.DATA_CADASTRO,
                    dados_json: String(i),
                    id: 0,
                    id_evento: i.CODIGO,
                    id_message: '0',
                    id_registro: 0,
                    setor:1,
                    status: 'PROCESSADO',
                    tabela: 0,
                    tabela_origem: 'cad_clie',
                    tipo_evento: 'UPDATE'
                }) 
            }


            const dataBrand = await getBrand();
            for( const i of dataBrand ){
                await serviceSendBrands({
                 criado_em: i.DATA_CADASTRO,
                    dados_json: String(i),
                    id: 0,
                    id_evento: i.CODIGO,
                    id_message: '0',
                    id_registro: 0,
                    setor:1,
                    status: 'PROCESSADO',
                    tabela: 0,
                    tabela_origem: 'cad_pmar',
                    tipo_evento: 'UPDATE'
                }) 
            }
                
            const dataCategory = await getCategory();
            for(const i of dataCategory ){
                    await serviceSendCategory({
                         criado_em: i.DATA_CADASTRO,
                    dados_json: String(i),
                    id: 0,
                    id_evento: i.CODIGO,
                    id_message: '0',
                    id_registro: 0,
                    setor:1,
                    status: 'PROCESSADO',
                    tabela: 0,
                    tabela_origem: 'cad_pgru',
                    tipo_evento: 'UPDATE'
                }) 
            }
            const dataSetores = await getSetores();
            for( const i of dataSetores){
                    await serviceSendSetor({
                    criado_em: i.DATA_CADASTRO,
                    dados_json: String(i),
                    id: 0,
                    id_evento: i.CODIGO,
                    id_message: '0',
                    id_registro: 0,
                    setor:1,
                    status: 'PROCESSADO',
                    tabela: 0,
                    tabela_origem: 'setores',
                    tipo_evento: 'UPDATE'
                }) 
                }

                        const dataProdSetor = await getAllProdSetor();
        if( dataProdSetor.length >  0 ){

            for(const i of dataProdSetor ){
                await serviceSendProdSetor({ 
                    criado_em: i.DATA_RECAD,
                    dados_json: String(i),
                    id:0,
                    id_evento:0,
                    id_message: '0',
                    id_registro: i.PRODUTO,
                    setor: i.SETOR,
                    status:'PROCESSADO',
                    tabela: 0,
                    tabela_origem:'prod_setor',
                    tipo_evento:'INSERT'
                })
            }
        } 

            console.log("[X] fim do processo.")
                return
        }

        await jobSendData();