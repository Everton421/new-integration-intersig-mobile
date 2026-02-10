import { ESTOQUE, FINANCEIRO, PUBLICO, VENDAS } from "../../connection/database-connection.ts";

const databaseEventos = `\`${process.env.EVENTOS}\``;
const publico = `\`${PUBLICO}\``;
const vendas = `\`${VENDAS}\``;
const estoque = `\`${ESTOQUE}\``;
const financeiro = `\`${FINANCEIRO}\``

export const sqlTriggers = [
      `
        DROP TRIGGER IF EXISTS ${publico}.trg_produtos_update;
        `,
    // 1. Produtos UPDATE
    `CREATE TRIGGER ${publico}.trg_produtos_update
        AFTER UPDATE ON ${publico}.cad_prod
        FOR EACH ROW
        BEGIN
            IF (OLD.DATA_RECAD != NEW.DATA_RECAD) THEN
                INSERT INTO ${databaseEventos}.eventos_produtos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('cad_prod', OLD.CODIGO, 'UPDATE', 'PENDENTE');
            END IF;
        END`,
        `
        DROP TRIGGER IF EXISTS ${publico}.trg_produtos_delete;
        `,
    // 2. Produtos DELETE
    `CREATE TRIGGER ${publico}.trg_produtos_delete
        AFTER DELETE ON ${publico}.cad_prod
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_produtos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('cad_prod', OLD.CODIGO, 'DELETE', 'PENDENTE');
        END`,
        `
        DROP TRIGGER IF EXISTS ${publico}.trg_produtos_insert;
        `,
    // 3. Produtos INSERT
    `CREATE TRIGGER ${publico}.trg_produtos_insert
        AFTER INSERT ON ${publico}.cad_prod
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_produtos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('cad_prod', NEW.CODIGO, 'INSERT', 'PENDENTE');
        END`,
         `
        DROP TRIGGER IF EXISTS ${publico}.trg_preco_produto_insert;
        `,
    // 4. Preço Produto INSERT
    `CREATE TRIGGER ${publico}.trg_preco_produto_insert
        AFTER INSERT ON ${publico}.prod_tabprecos
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_produtos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('prod_tabprecos', NEW.PRODUTO, 'INSERT', 'PENDENTE');
        END`,
        `
        DROP TRIGGER IF EXISTS ${publico}.trg_preco_produto_update;
        `,

    // 5. Preço Produto UPDATE (Corrigida condição duplicada)
    `CREATE TRIGGER ${publico}.trg_preco_produto_update
        AFTER UPDATE ON ${publico}.prod_tabprecos
        FOR EACH ROW
        BEGIN
            IF (OLD.PRECO != NEW.PRECO) THEN
                INSERT INTO ${databaseEventos}.eventos_produtos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('prod_tabprecos', OLD.PRODUTO, 'UPDATE', 'PENDENTE');
            END IF;
        END`,
        `
        DROP TRIGGER IF EXISTS ${publico}.trg_preco_produto_delete;
        `,
    // 6. Preço Produto DELETE
    `CREATE TRIGGER ${publico}.trg_preco_produto_delete
        AFTER DELETE ON ${publico}.prod_tabprecos
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_produtos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('prod_tabprecos', OLD.PRODUTO, 'DELETE', 'PENDENTE');
        END`,
        `
        DROP TRIGGER IF EXISTS ${vendas}.trg_pro_orca_update;
        `,
    // 7. Pro Orca UPDATE (Separação)
    `CREATE TRIGGER ${vendas}.trg_pro_orca_update
        AFTER UPDATE ON ${vendas}.pro_orca
        FOR EACH ROW
        BEGIN
            IF (NEW.QTDE_SEPARADA <> OLD.QTDE_SEPARADA) THEN
                INSERT INTO ${databaseEventos}.eventos_produtos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('pro_orca', NEW.PRODUTO, 'UPDATE', 'PENDENTE');
            END IF;
        END`,
         `
        DROP TRIGGER IF EXISTS ${vendas}.trg_pro_orca_insert;
        `,
    // 8. Pro Orca INSERT
    `CREATE TRIGGER ${vendas}.trg_pro_orca_insert
        AFTER INSERT ON ${vendas}.pro_orca
        FOR EACH ROW
        BEGIN
            IF (NEW.QTDE_SEPARADA > 0) THEN
                INSERT INTO ${databaseEventos}.eventos_produtos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('pro_orca', NEW.PRODUTO, 'UPDATE', 'PENDENTE');
            END IF;
        END`,
          `
        DROP TRIGGER IF EXISTS ${estoque}.trg_prod_setor_update;
        `,

    // 9. Prod Setor UPDATE
    `CREATE TRIGGER ${estoque}.trg_prod_setor_update
        AFTER UPDATE ON ${estoque}.prod_setor
        FOR EACH ROW
        BEGIN
            IF (NEW.DATA_RECAD <> OLD.DATA_RECAD OR OLD.ESTOQUE <> NEW.ESTOQUE) THEN
                INSERT INTO ${databaseEventos}.eventos_produtos_sistema(tabela_origem, id_registro, tipo_evento, status, setor)
                VALUES ('prod_setor', NEW.PRODUTO, 'UPDATE', 'PENDENTE', NEW.SETOR);
            END IF;
        END`,
         `
        DROP TRIGGER IF EXISTS ${publico}.trg_cad_clie_update;
        `,
    // 10. Clientes UPDATE
    `CREATE TRIGGER ${publico}.trg_cad_clie_update
        AFTER UPDATE ON ${publico}.cad_clie
        FOR EACH ROW
        BEGIN
            IF (OLD.DATA_RECAD != NEW.DATA_RECAD OR OLD.ATIVO != NEW.ATIVO) THEN
                INSERT INTO ${databaseEventos}.eventos_clientes_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('cad_clie', NEW.CODIGO, 'UPDATE', 'PENDENTE');
            END IF;
        END`,
         `
        DROP TRIGGER IF EXISTS ${publico}.trg_cad_clie_insert;
        `,
    // 11. Clientes INSERT (CORRIGIDO: estava AFTER UPDATE)
    `CREATE TRIGGER ${publico}.trg_cad_clie_insert
        AFTER INSERT ON ${publico}.cad_clie
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_clientes_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('cad_clie', NEW.CODIGO, 'INSERT', 'PENDENTE');
        END`,

        `
        DROP TRIGGER IF EXISTS ${publico}.trg_cad_clie_delete;
        `,
       
    `CREATE TRIGGER ${publico}.trg_cad_clie_delete
        AFTER DELETE ON ${publico}.cad_clie
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_clientes_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('cad_clie', OLD.CODIGO, 'DELETE', 'PENDENTE');
        END`,


    /// trigger recebimentos
     `
      DROP TRIGGER IF EXISTS ${financeiro}.trg_ct_receb_update;
     `,
 `CREATE TRIGGER ${financeiro}.trg_ct_receb_update
        AFTER UPDATE ON ${financeiro}.ct_receb
        FOR EACH ROW
        BEGIN
            IF (
              OLD.VENCIMENTO != NEW.VENCIMENTO
              OR OLD.HISTORICO != NEW.HISTORICO
              OR OLD.DATA_PGTO != NEW.DATA_PGTO
              OR OLD.TIPO_RECEBIMENTO != NEW.TIPO_RECEBIMENTO
              OR OLD.PARCIAL != NEW.PARCIAL
              OR OLD.AGRUP_ORIGEM != NEW.AGRUP_ORIGEM
              OR OLD.AGRUP_DESTINO != NEW.AGRUP_DESTINO
              ) THEN
                INSERT INTO ${databaseEventos}.eventos_recebimentos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('ct_receb', NEW.CODIGO, 'UPDATE', 'PENDENTE');
            END IF;
        END`,
        `
        DROP TRIGGER IF EXISTS ${financeiro}.trg_ct_receb_insert;
        `,
    `CREATE TRIGGER ${financeiro}.trg_ct_receb_insert
        AFTER INSERT ON ${financeiro}.ct_receb
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_recebimentos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('ct_receb', NEW.CODIGO, 'INSERT', 'PENDENTE');
        END`,

        `
        DROP TRIGGER IF EXISTS ${financeiro}.trg_ct_receb_delete;
        `,
       
    `CREATE TRIGGER ${financeiro}.trg_ct_receb_delete
        AFTER DELETE ON ${financeiro}.ct_receb
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_recebimentos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('ct_receb', OLD.CODIGO, 'DELETE', 'PENDENTE');
        END`,

// pedidos  
    `  DROP TRIGGER IF EXISTS ${vendas}.trg_pedidos_update;`,
 `CREATE TRIGGER ${vendas}.trg_pedidos_update
        AFTER UPDATE ON ${vendas}.cad_orca
        FOR EACH ROW
        BEGIN
            IF (
              OLD.CLIENTE != NEW.CLIENTE
              OR OLD.SITUACAO != NEW.SITUACAO
              OR OLD.SIT_SEPAR != NEW.SIT_SEPAR
              OR OLD.DATA_PEDIDO != NEW.DATA_PEDIDO
              OR OLD.VENDEDOR != NEW.VENDEDOR
              OR OLD.SETOR != NEW.SETOR
              OR OLD.DATA_RECAD != NEW.DATA_RECAD
              ) THEN
                INSERT INTO ${databaseEventos}.eventos_pedidos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('cad_orca', NEW.CODIGO, 'UPDATE', 'PENDENTE');
            END IF;
        END`,
        `
        DROP TRIGGER IF EXISTS ${vendas}.trg_pedidos_insert;
        `,
    `CREATE TRIGGER ${vendas}.trg_pedidos_insert
        AFTER INSERT ON ${vendas}.cad_orca
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_pedidos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('cad_orca', NEW.CODIGO, 'INSERT', 'PENDENTE');
        END`,

        `
        DROP TRIGGER IF EXISTS ${vendas}.trg_pedidos_delete;
        `,
       
    `CREATE TRIGGER ${vendas}.trg_pedidos_delete
        AFTER DELETE ON ${vendas}.cad_orca
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_recebimentos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('cad_orca', OLD.CODIGO, 'DELETE', 'PENDENTE');
        END`,
        /// 

        `
        DROP TRIGGER IF EXISTS ${estoque}.trg_setores;
        `,
    //     SETORES  UPDATE
    `CREATE TRIGGER ${estoque}.trg_setores
        AFTER UPDATE ON ${estoque}.setores
        FOR EACH ROW
        BEGIN
            
                INSERT INTO ${databaseEventos}.eventos_setores_sistema(tabela_origem, id_registro, tipo_evento, status )
                VALUES ('setores', NEW.CODIGO, 'UPDATE', 'PENDENTE' );
           
        END`,
          





        


];