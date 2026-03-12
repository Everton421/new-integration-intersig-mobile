import { ResultSetHeader } from "mysql2"
import dbConn, { VENDAS } from "../connection/database-connection.ts"
import { DateService } from "../utils/date.ts"
import { deleteParcelasPedido, deleteProdutosPedido, deleteServicosPedido, insertParcelas, insertProdutosPedido, insertServicos, IParcelasPedidoSistema, IProdutoPedidoSistema, IServicosPedidoSistema } from "./repository-itens-pedido.ts"



  export interface IClientePedidoSistema
{
        codigo: number
        id:number
        nome: string
        cnpj: string
        celular: string
        data_cadastro: string
        data_recadastro: string
}

interface tipos_os{
    id:number 
    codigo:number
      data_cadastro:string
    data_recadastro:string
}
 interface veiculo{
      id:number 
      codigo:number
      placa:string
      data_cadastro:string
    data_recadastro:string
}
export interface IPedidoSistema
{
    codigo:number
    id:number
    id_externo:number
    vendedor:number
    situacao: string
    contato: string
    descontos: number
    forma_pagamento:number
    observacoes: string
    observacoes2:string
    quantidade_parcelas:number
    total_geral: number
    total_produtos: number
    total_servicos: number
    cliente:  IClientePedidoSistema
    veiculo:veiculo
    data_cadastro:string
    data_recadastro:string
    tipo_os: tipos_os
    enviado:string
    tipo:number
    just_ipi:string
    just_icms:string
    just_subst:string
    produtos:  IProdutoPedidoSistema[]
    servicos: IServicosPedidoSistema[]
    parcelas:  IParcelasPedidoSistema[]  
  }

 
     export async function insertPedido(orcamento:IPedidoSistema  ):Promise<number> {

        const dateService = new DateService();
        let {
            forma_pagamento,
            cliente,
            descontos,
            observacoes,
            observacoes2,
            quantidade_parcelas,
            total_geral,
            total_produtos,
            total_servicos,
            situacao,
            tipo,
            vendedor,
            data_cadastro,
            data_recadastro,
            veiculo,
            tipo_os,
            contato,
            just_ipi,
            just_icms,
            just_subst,
             id,
        } = orcamento;
           const codigoCliente = cliente.codigo;
           const codigo_site =id;

            let id_tipo_os =  0;

            if(tipo_os){
              id_tipo_os = tipo_os.id;
            }
                let id_veiculo = 0

            if(veiculo){
                  id_veiculo = veiculo.id
            }

            contato = 'APP /'+ id 

        const servicos = orcamento.servicos as IServicosPedidoSistema[];
        const parcelas = orcamento.parcelas as IParcelasPedidoSistema[];
        const produtos = orcamento.produtos as IProdutoPedidoSistema[];

        if (!situacao)  situacao = 'EA';
        if (!vendedor)   vendedor = 1;
        if (!id_veiculo)   id_veiculo = 0;
        if (!data_cadastro)   data_cadastro = dateService.obterDataAtual();
        if (!data_recadastro)  data_recadastro = dateService.obterDataHoraAtual();
        if (!total_servicos)   total_servicos = 0;
         
        if (!observacoes)   observacoes = '';
        if (!observacoes2)  observacoes2 = '';
        if (!just_ipi)  just_ipi = '';
        if (!just_icms)   just_icms = '';
        if (!just_subst)   just_subst = '';
     if (!forma_pagamento)   forma_pagamento = 0
      if (!descontos)   descontos = 0
        if (!quantidade_parcelas)   quantidade_parcelas = 0
       
        const sql  =`INSERT INTO ${VENDAS}.cad_orca   
             (cliente, cod_site, cod_externo,id_interna, veiculo, total_produtos,total_servicos, forma_pagamento, tipo,  tipo_os, DESC_PROD, TOTAL_GERAL, DATA_CADASTRO, SITUACAO,VENDEDOR,CONTATO , DATA_INICIO,DATA_PEDIDO, DATA_APROV, QTDE_PARCELAS, OBSERVACOES,OBSERVACOES2, USUARIO, DATA_RECAD)  
                VALUES ( ? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    const values = [codigoCliente,  codigo_site, 0, 0 , id_veiculo, total_produtos, total_servicos ,forma_pagamento, tipo, id_tipo_os, descontos, total_geral, data_cadastro, situacao, vendedor, contato, data_cadastro, data_cadastro, data_cadastro, quantidade_parcelas, observacoes, observacoes2, vendedor, data_recadastro]; 
        const [resultInsert ]    = await dbConn.query( sql, values) ; 
         const   result = resultInsert as ResultSetHeader;

                 if(result.insertId && result.insertId > 0 ){
                        await insertProdutosPedido(produtos,result.insertId )
                        await insertServicos(servicos, result.insertId);
                        await insertParcelas(parcelas, result.insertId)
                    }
                    return result.insertId;
    }
 
  export async function updatePedido( orcamento:IPedidoSistema,codigoPedido:number ){
            const contato = 'APP /'+ orcamento.id 
        const servicos = orcamento.servicos as IServicosPedidoSistema[];
        const parcelas = orcamento.parcelas as IParcelasPedidoSistema[];
        const produtos = orcamento.produtos as IProdutoPedidoSistema[];
      const tipo_os  = orcamento.tipo_os && orcamento.tipo_os.codigo ? orcamento.tipo_os.codigo : 0;
      const veiculo = orcamento.veiculo  &&  orcamento.veiculo.codigo ? orcamento.veiculo.codigo : 0; 
           const codigo_site =orcamento.codigo;

        let sql = `
                    UPDATE ${VENDAS}.cad_orca  
                    set 
                    cod_site        = ${codigo_site},
                    cliente         =  ${orcamento.cliente.id},
                    total_geral     =  ${orcamento.total_geral} ,
                    total_produtos  =  ${orcamento.total_produtos} ,
                    total_servicos  =  ${orcamento.total_servicos} ,
                    tipo             =  ${orcamento.tipo},
                    tipo_os         =  ${tipo_os},
                    qtde_parcelas   =  ${orcamento.quantidade_parcelas} ,
                    contato         = '${contato}',
                    veiculo         =  ${veiculo},
                    forma_pagamento =  ${orcamento.forma_pagamento},
                    observacoes     = '${orcamento.observacoes}',
                    data_cadastro   = '${orcamento.data_cadastro}',
                    data_recad      = '${orcamento.data_recadastro}',
                    situacao        = '${orcamento.situacao}'
                    where codigo = ${codigoPedido}
                `;

               const [ rows ] =  await dbConn.query(sql);

                const resultUpdatePdido = rows as ResultSetHeader;
                  if(resultUpdatePdido.affectedRows > 0 ){

                    await deleteParcelasPedido(codigoPedido);
                      if(parcelas.length > 0 ){
                        await insertParcelas(parcelas, codigoPedido);
                      }

                    if( orcamento.servicos.length >  0 ){
                      await deleteServicosPedido(codigoPedido);
                      await insertServicos(servicos, codigoPedido);
                    }

                      if(orcamento.produtos.length > 0  ){
                        await deleteProdutosPedido(codigoPedido);
                        await insertProdutosPedido(produtos, codigoPedido)
                      } 
                  }


  }