import { ResultSetHeader } from "mysql2"
import dbConn, { VENDAS } from "../connection/database-connection.ts"

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
       pedido: number
       desconto: number
       quantidade: number
       preco: number 
       total: number
       id: number
       codigo: number
   
       just_icms:string
       just_ipi:string
       just_subst:string
       fator_val:number
       fator_qtde:number
       tabela:number
     }
    
    export interface IParcelasPedidoSistema
   {
       pedido:number
       parcela:number
       valor:number
       vencimento:string
   
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
    console.log(sql)
     const [ rows ] = await dbConn.query(sql);
        console.log(rows);    
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
			 
             const sql =  `INSERT INTO ${VENDAS}.pro_orca (orcamento, sequencia, produto, fator_val, fator_qtde, unitario, quantidade, preco_tabela, desconto, tabela,  just_ipi, just_icms, just_subst, total_liq, unit_orig)
                VALUES ( 
                    '${codigoPedido}',
                    '${i}',
                    '${id}',
                    '${fator_val}',
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
                    '${preco}'  
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


    export async function deleteServicosPedido(codigoPedido:number){
    const sql = `DELETE FROM ${VENDAS}.ser_orca WHERE ORCAMENTO = ${codigoPedido}`
     const [ rows ] = await dbConn.query(sql);
     return rows as ResultSetHeader;
}
