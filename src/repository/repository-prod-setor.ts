import { type ResultSetHeader } from "mysql2";
 
import dbConn, { ESTOQUE, EVENTOS, PUBLICO, VENDAS } from "../connection/database-connection.ts";
import { type message_prod_setor } from "../contracts/message-prod-setor.ts";



  export  async function updateProdSetor(message: message_prod_setor){
        const data = message as message_prod_setor;
        console.log(`[SQl] Atualizando prod_setor produto: ${data.produto} `)

        const sqlProd_setor = ` INSERT INTO ${ESTOQUE}.prod_setor  
                             set
                            ESTOQUE = ${data.estoque},
                            LOCAL1_PRODUTO = '${data.local1_produto}',
                            LOCAL2_PRODUTO = '${data.local2_produto}',
                            LOCAL3_PRODUTO = '${data.local3_produto}',
                            DATA_RECAD = '${data.data_recadastro}',
                            LOCAL_PRODUTO = '${data.local_produto}',
                            LOCAL4_PRODUTO = '${data.local4_produto}',
                            PRODUTO = '${data.produto}',
                            SETOR = '${data.setor}'
                            ON DUPLICATE KEY UPDATE
                            ESTOQUE = ${data.estoque},
                            LOCAL1_PRODUTO = '${data.local1_produto}',
                            LOCAL2_PRODUTO = '${data.local2_produto}',
                            LOCAL3_PRODUTO = '${data.local3_produto}',
                            DATA_RECAD = '${data.data_recadastro}',
                            LOCAL_PRODUTO = '${data.local_produto}',
                            LOCAL4_PRODUTO = '${data.local4_produto}' 
                         `;
                         try{
                            const [ result ]   = await dbConn.query(sqlProd_setor) as ResultSetHeader[]
                         }catch( e ){
                            console.log("[X] Erro ao tentar atualizar prod_setor: ", e)
                         }
    }

    type resultStock = { 
      CODIGO:number
      DATA_RECAD:string,
      ESTOQUE:number
    }

    export async function findStock( codigo:number, setor?:number){
 let sql = `
                  SELECT  
                        est.CODIGO,
                        IF(est.estoque < 0, 0, est.estoque) AS ESTOQUE,
                        est.DATA_RECAD
                      FROM 
                        (SELECT
                          P.CODIGO,
                          PS.DATA_RECAD,
                          (SUM(PS.ESTOQUE) - 
                            (SELECT COALESCE(SUM((IF(PO.QTDE_SEPARADA > (PO.QUANTIDADE - PO.QTDE_MOV), PO.QTDE_SEPARADA, (PO.QUANTIDADE - PO.QTDE_MOV)) * PO.FATOR_QTDE) * IF(CO.TIPO = '5', -1, 1)), 0)
                              FROM ${VENDAS}.cad_orca AS CO
                              LEFT OUTER JOIN ${VENDAS}.pro_orca AS PO ON PO.ORCAMENTO = CO.CODIGO
                              WHERE CO.SITUACAO IN ('AI', 'AP', 'FP')
                              AND PO.PRODUTO = P.CODIGO)) AS estoque
                        FROM ${ESTOQUE}.prod_setor AS PS
                        LEFT JOIN ${PUBLICO}.cad_prod AS P ON P.CODIGO = PS.PRODUTO
                        INNER JOIN ${PUBLICO}.cad_pgru AS G ON P.GRUPO = G.CODIGO
                        LEFT JOIN ${ESTOQUE}.setores AS S ON PS.SETOR = S.CODIGO
                        WHERE P.CODIGO = ${codigo}
                        
                  `

                  if(setor){
                        sql = sql + `AND PS.SETOR = ${setor}
                        GROUP BY P.CODIGO) AS est;` 
                  }else{
                        sql = sql + ` GROUP BY P.CODIGO) AS est;` 
                  }
                  const [ arrResult ] = await dbConn.query(sql);
                     const result = arrResult  as resultStock[];
                  return result[0] 
    }