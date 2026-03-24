import { type ResultSetHeader } from "mysql2"
import dbConn, { MOBILE, PUBLICO, VENDAS } from "../connection/database-connection.ts"
import { DateService } from "../utils/date.ts"
import { deleteParcelasPedido, deleteProdutosPedido, deleteServicosPedido, insertParcelas, insertProdutosPedido, insertServicos, type IParcelasPedidoSistema, type IProdutoPedidoSistema, type IServicosPedidoSistema } from "./repository-itens-pedido.ts"
import { type cad_orca } from "../contracts/cad_orca.ts"
import { type cad_clie } from "../contracts/cad_clie.ts"



export interface IClientePedidoSistema {
  codigo: number
  id: number
  nome: string
  cnpj: string
  celular: string
  data_cadastro: string
  data_recadastro: string
}

interface tipos_os {
  id: number
  codigo: number
  data_cadastro: string
  data_recadastro: string
}
interface veiculo {
  id: number
  codigo: number
  placa: string
  data_cadastro: string
  data_recadastro: string
}
export interface IPedidoSistema {
  codigo: number
  id: number
  id_externo: number
  vendedor: number
  situacao: string
  contato: string
  descontos: number
  forma_pagamento: number
  observacoes: string
  observacoes2: string
  quantidade_parcelas: number
  total_geral: number
  total_produtos: number
  total_servicos: number
  cliente: IClientePedidoSistema
  veiculo: veiculo
  situacao_separacao:'N' | 'I' | 'P'
  data_cadastro: string
  data_recadastro: string
  tipo_os: tipos_os
  enviado: string
  tipo: number
  just_ipi: string
  just_icms: string
  just_subst: string
  frete: number
  produtos: IProdutoPedidoSistema[]
  servicos: IServicosPedidoSistema[]
  parcelas: IParcelasPedidoSistema[]
}


export async function insertPedido(orcamento: IPedidoSistema): Promise<number> {

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
    frete
  } = orcamento;
  const codigoCliente = cliente.codigo;
  const codigo_site = id;

  let id_tipo_os = 0;

  if (tipo_os) {
    id_tipo_os = tipo_os.id;
  }
  let id_veiculo = 0

  if (veiculo) {
    id_veiculo = veiculo.id
  }

  const servicos = orcamento.servicos as IServicosPedidoSistema[];
  const parcelas = orcamento.parcelas as IParcelasPedidoSistema[];
  const produtos = orcamento.produtos as IProdutoPedidoSistema[];

  if (!situacao) situacao = 'EA';
  if (!vendedor) vendedor = 1;
  if (!id_veiculo) id_veiculo = 0;
  if (!data_cadastro) data_cadastro = dateService.obterDataAtual();
  if (!data_recadastro) data_recadastro = dateService.obterDataHoraAtual();
  if (!total_servicos) total_servicos = 0;

  if (!observacoes) observacoes = '';
  if (!observacoes2) observacoes2 = '';
  if (!just_ipi) just_ipi = '';
  if (!just_icms) just_icms = '';
  if (!just_subst) just_subst = '';
  if (!forma_pagamento) forma_pagamento = 0
  if (!descontos) descontos = 0
  if (!quantidade_parcelas) quantidade_parcelas = 0

  const sql = `INSERT INTO ${VENDAS}.cad_orca   
             (cliente, cod_site, cod_externo,id_interna, veiculo, total_produtos,total_servicos, forma_pagamento, tipo,  tipo_os, DESC_PROD, TOTAL_GERAL, DATA_CADASTRO, SITUACAO,VENDEDOR,CONTATO , DATA_INICIO,DATA_PEDIDO, DATA_APROV, QTDE_PARCELAS, OBSERVACOES,OBSERVACOES2, USUARIO, DATA_RECAD, FRETE)  
                VALUES ( ? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [codigoCliente, codigo_site, 0, 0, id_veiculo, total_produtos, total_servicos, forma_pagamento, tipo, id_tipo_os, descontos, total_geral, data_cadastro, situacao, vendedor, contato, data_cadastro, data_cadastro, data_cadastro, quantidade_parcelas, observacoes, observacoes2, vendedor, data_recadastro, frete];
  const [resultInsert] = await dbConn.query(sql, values);
  const result = resultInsert as ResultSetHeader;

  if (result.insertId && result.insertId > 0) {
    await insertProdutosPedido(produtos, result.insertId)
    await insertServicos(servicos, result.insertId);
    await insertParcelas(parcelas, result.insertId)
  }
  return result.insertId;
}

export async function updatePedido(orcamento: IPedidoSistema, codigoPedido: number) {
  const contato = orcamento.contato
  const servicos = orcamento.servicos as IServicosPedidoSistema[];
  const parcelas = orcamento.parcelas as IParcelasPedidoSistema[];
  const produtos = orcamento.produtos as IProdutoPedidoSistema[];
  const tipo_os = orcamento.tipo_os && orcamento.tipo_os.codigo ? orcamento.tipo_os.codigo : 0;
  const veiculo = orcamento.veiculo && orcamento.veiculo.codigo ? orcamento.veiculo.codigo : 0;
  const codigo_site = orcamento.codigo;

  let  resultFunction  =  { sucess: true, message: ''};

  try{

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
                    sit_separ       = '${orcamento.situacao_separacao}',
                    qtde_parcelas   =  ${orcamento.quantidade_parcelas} ,
                    contato         = '${contato}',
                    veiculo         =  ${veiculo},
                    forma_pagamento =  ${orcamento.forma_pagamento},
                    observacoes     = '${orcamento.observacoes}',
                    data_cadastro   = '${orcamento.data_cadastro}',
                    data_recad      = '${orcamento.data_recadastro}',
                    situacao        = '${orcamento.situacao}',
                    VALOR_FRETE           = '${orcamento.frete}'
                    where codigo = ${codigoPedido}
                `;

      const [rows] = await dbConn.query(sql);

      const resultUpdatePdido = rows as ResultSetHeader;
      if (resultUpdatePdido.affectedRows > 0) {


        if (parcelas.length > 0) {

          const resultDeleteParcelas = await deleteParcelasPedido(codigoPedido);
          if (resultDeleteParcelas.affectedRows > 0) {
            await insertParcelas(parcelas, codigoPedido);
          }

        }

        if (orcamento.servicos.length > 0) {
          const resutlDeleteServ = await deleteServicosPedido(codigoPedido);
          if (resutlDeleteServ.affectedRows > 0) {
            await insertServicos(servicos, codigoPedido);
          }
        }

        if (orcamento.produtos.length > 0) {
          const resultDelete = await deleteProdutosPedido(codigoPedido);
          if (resultDelete.affectedRows > 0) {
            await insertProdutosPedido(produtos, codigoPedido)
          }
        }
          resultFunction.sucess = true;
        }else{
          resultFunction.message = "Nenhuma alteração ocorreu no pedido.";
          resultFunction.sucess = false;
          
        }

        
        return    resultFunction 
      
  }catch(e){
          resultFunction.sucess = false;
          resultFunction.message = e as any;
        return    resultFunction 

      }finally{
        return    resultFunction 
      }


}

export async function selectPedidoSistema(codigo_pedido?: number) {

  const sql = ` SELECT 
                    *,
                    DATE_FORMAT(DATA_CADASTRO, '%Y-%m-%d') AS DATA_CADASTRO,
                    DATE_FORMAT(DATA_RECAD, '%Y-%m-%d %H:%i:%s') AS DATA_RECAD,
                     CAST(OBSERVACOES AS CHAR(10000) CHARACTER SET latin1 ) as OBSERVACOES,
                     CAST(OBSERVACOES2 AS CHAR(10000) CHARACTER SET latin1 ) as OBSERVACOES2

                     from ${VENDAS}.cad_orca   `;
  
                      let whereClause = ` ;` 
                      const values = [];

              if( codigo_pedido && codigo_pedido != undefined){
                whereClause = ` where codigo = ? ;`;
                values.push(codigo_pedido); 
              }

      const finalSql = sql + whereClause

  const [rows] = await dbConn.query(finalSql, values);
  return rows as cad_orca[];

}

export async function selectClientePedido(codigo_cliente: number) {

  const sql = ` SELECT c.*, ce.id_mobile from ${PUBLICO}.cad_clie as c
                            JOIN ${MOBILE}.clientes_enviados ce on ce.codigo_sistema = c.CODIGO  
                    where c.codigo = ?  `;
  const values = [codigo_cliente]
  const [rows] = await dbConn.query(sql, values);
  return rows as cad_clie[];

}