import { ESTOQUE, PUBLICO, VENDAS } from "../../connection/database-connection.ts";

const databaseEventos = `\`${process.env.EVENTOS}\``;
const publico = `\`${PUBLICO}\``;
const vendas = `\`${VENDAS}\``;
const estoque = `\`${ESTOQUE}\``;

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
            IF (NEW.DATA_RECAD <> OLD.DATA_RECAD) THEN
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
        END`
];