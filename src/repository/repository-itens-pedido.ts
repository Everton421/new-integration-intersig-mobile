import { type ResultSetHeader } from "mysql2"
import dbConn, { MOBILE, VENDAS } from "../connection/database-connection.ts"
import { type pro_orca } from "../contracts/pro_orca.ts"
import { type par_orca } from "../contracts/par_orca.ts"

   export interface IServicosPedidoSistema
   {
       pedido: number
       desconto: number
       quantidade: number
       preco: number 
       total: number
       id: number,
       valor:number,
       codigo:number
     }
   export type IProdutoPedidoSistema
   = {
       orcamento: number
       desconto: number
       quantidade: number
       preco: number 
       total: number
       id?: number
       codigo: number
        frete:number
       just_icms:string
       just_ipi:string
       just_subst:string
       fator_val:number
       fator_qtde:number
       tabela:number
       quantidade_separada:number
       quantidade_faturada:number
     }
    
    export interface IParcelasPedidoSistema
   {
       pedido:number
       parcela:number
       valor:number
       vencimento:string
        dt_pagamento: string
        id:number
        tipo_receb:number
   }
   
   export async function insertParcelas(parcelas:IParcelasPedidoSistema[], codigo_pedido:number  ){
        
        for( const p of parcelas ){
                 const sql = ` INSERT INTO ${VENDAS}.par_orca ( ORCAMENTO, PARCELA, VALOR , VENCIMENTO, TIPO_RECEB)
                              VALUES ( ?,?,?,?,?)`;
                              const values = [codigo_pedido, p.parcela, p.valor, p.vencimento, 1]
                        await   dbConn.query( sql, values);
            }
    }

  export async function deleteParcelasPedido(codigoPedido:number){
    const sql = `DELETE FROM ${VENDAS}.par_orca WHERE ORCAMENTO = ${codigoPedido}`;
     const [ rows ] = await dbConn.query(sql);
     return rows as ResultSetHeader;
}

   export async function insertProdutosPedido(produtos:IProdutoPedidoSistema[] , codigoPedido:number ){
          
         if( produtos.length > 0 ){
			let i=1;
			for(let p of produtos){
                let {
                    id,
                    codigo,
                    preco,
                    quantidade,
                    desconto,
                    just_icms,
                    just_ipi,
                    just_subst,
                    total,
                    fator_val,
                    fator_qtde,
                    tabela,
                    frete,
                    quantidade_separada,
                    quantidade_faturada,
                } = p

                 if( !preco) preco = 0;
                 if( !quantidade) quantidade = 0;
                 if( !desconto) desconto = 0;
                 if( !just_icms) just_icms = '';
                 if( !just_ipi) just_ipi = '';
                 if( !just_subst) just_subst = '';
                 if( !total) total = 0;
                 if ( !fator_val ) fator_val = 1;
                 if ( !fator_qtde ) fator_qtde = 1;
                 if ( !tabela ) tabela = 1; 
			 
             const sql =  `INSERT INTO ${VENDAS}.pro_orca (orcamento, sequencia, produto, fator_val, qtde_separada, qtde_faturada, fator_qtde, unitario, quantidade, preco_tabela, desconto, tabela,  just_ipi, just_icms, just_subst, total_liq, unit_orig, frete)
                VALUES ( 
                    '${codigoPedido}',
                    '${i}',
                    '${id}',
                    '${fator_val}',
                    '${quantidade_separada}',
                    '${quantidade_faturada}',
                    '${fator_qtde}',
                    '${preco}',
                    '${quantidade}',
                    '${preco}',
                    '${desconto}',  
                    '${tabela}',  
                    '${just_ipi}',  
                    '${just_icms}',  
                    '${just_subst}',  
                    '${total}',  
                    '${preco}',
                    '${frete}'  
                ) `;

			  await dbConn.query( sql)

				if(i === produtos.length){
					return;
				}
				i++;
			}
			}else{
                console.log('nenhum produto informado')
            }

    }

    export async function deleteProdutosPedido(codigoPedido:number){
        const sql = `DELETE FROM ${VENDAS}.pro_orca WHERE ORCAMENTO = ${codigoPedido}`
        const [ rows ] = await dbConn.query(sql);
        return rows as ResultSetHeader;
    }

   export async function insertServicos( servicos:IServicosPedidoSistema[], codigo_pedido:number ){
            if (servicos.length > 0) {
                let j=1;

                for(let i of servicos ){
                    const sql =  ` INSERT INTO ${VENDAS}.ser_orca ( ORCAMENTO , SEQUENCIA, SERVICO, QUANTIDADE, UNITARIO, DESCONTO, PRECO_TABELA )
                            VALUES ( ?, ?, ?, ?, ?, ?, ?  ) `;
                            const values =[codigo_pedido, j, i.id, i.quantidade, i.valor, i.desconto, i.valor ]
                    

                               await dbConn.query( sql, values );

                    if(j === servicos.length){
                        return;
                    }
                    j++;
                }
            } 
    }


     export async function selectProdutoDoPedido( codigo_pedido:number ){

                    const sql =  ` SELECT 
                    p.*,
                    pe.id_mobile as id 
                     from ${VENDAS}.pro_orca p
                     join ${MOBILE}.produtos_enviados pe on pe.codigo_sistema = p.PRODUTO
                      where p.orcamento = ?  `;
                            const values =[codigo_pedido ]
                             const [ rows ] =  await dbConn.query( sql, values );
                return rows as pro_orca[];
                  
    }
   export async function selectParcelasDoPedido( codigo_pedido:number ){

                    const sql =  ` SELECT 
                     *,
                    DATE_FORMAT(VENCIMENTO, '%Y-%m-%d') AS  VENCIMENTO
                     from ${VENDAS}.par_orca
                      where  orcamento = ?  `;
                            const values =[codigo_pedido ]
                             const [ rows ] =  await dbConn.query( sql, values );
                return rows as par_orca[];
                  
    }
   
    export async function deleteServicosPedido(codigoPedido:number){
    const sql = `DELETE FROM ${VENDAS}.ser_orca WHERE ORCAMENTO = ${codigoPedido}`
     const [ rows ] = await dbConn.query(sql);
     return rows as ResultSetHeader;
}
