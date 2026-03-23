import dbConn, { PUBLICO } from "../connection/database-connection.ts";

type resultProductMobile = {
        codigo: number
        preco: number
        estoque:number
        unidade_medida: string
        descricao: string
        num_fabricante: string
        num_original: string
        sku: string
        grupo: number
        marca: number
        ativo: string
        tipo: number
        class_fiscal: string
        origem: string
        data_cadastro: string
        observacoes1: string
        observacoes2: string
        observacoes3: string
}
export async function getProduct (  codigo?:number ) {

                                                         const baseSql = ` SELECT  
                                                                            p.CODIGO codigo,  
                                                                            COALESCE(   ROUND(pp.preco,2 ),  0.00 ) as preco,
                                                                            COALESCE( p.GRUPO, 0) as grupo, 
                                                                            coalesce(und.SIGLA,'UND') as unidade_medida,
                                                                            p.DESCRICAO descricao, 
                                                                            p.NUM_FABRICANTE num_fabricante,
                                                                            p.NUM_ORIGINAL num_original,
                                                                            p.OUTRO_COD sku,
                                                                            COALESCE( p.MARCA, 0) as marca,
                                                                            p.ATIVO ativo,
                                                                            p.TIPO tipo,
                                                                            cf.NCM class_fiscal,
                                                                            p.ORIGEM origem,
                                                                            p.CST cst,
                                                                            coalesce(DATE_FORMAT(p.DATA_CADASTRO, '%Y-%m-%d'),'0000-00-00 00:00:00') AS data_cadastro,
                                                                            CONVERT( p.OBSERVACOES1 USING utf8) as observacoes1,
                                                                            CONVERT(p.OBSERVACOES2 USING utf8) as observacoes2,
                                                                            CONVERT(p.OBSERVACOES3 USING utf8) as observacoes3
                                                                            FROM   ${PUBLICO}.cad_prod p 
                                                                                    left join  ${PUBLICO}.prod_tabprecos pp on pp.produto = p.codigo
                                                                                    left join  ${PUBLICO}.tab_precos tp on tp.codigo = pp.tabela
                                                                                    left join  ${PUBLICO}.class_fiscal cf on cf.codigo = p.class_fiscal
                                                                                    left join  ${PUBLICO}.unid_prod und on und.produto = p.CODIGO and und.PADR_SAI = 'S' AND und.PADR_SEP= 'S' 
                                                                              `

                                                                            let param = ` WHERE tp.padrao = 'S'
                                                                                group by  p.CODIGO
                                                                                order by p.CODIGO;`;
                                                                            if(codigo && codigo != undefined){
                                                                                param = `
                                                                               WHERE  p.CODIGO = '${codigo}' AND tp.padrao = 'S'
                                                                                group by  p.CODIGO
                                                                                order by p.CODIGO;
                                                                                `
                                                                            } 
                                                                            const sql = baseSql + param;
                                                                                const [ rows ] = await dbConn.query(sql);
                                                                            return rows as resultProductMobile[];
                                                                                


}