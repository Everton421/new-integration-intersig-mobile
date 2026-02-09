import dbConn, { EVENTOS } from "../../connection/database-connection.ts";

 

        const databaseEventos = `\`${process.env.EVENTOS}\``;

    export const sqlTables = [
        `
         CREATE DATABASE IF NOT EXISTS${databaseEventos}; 
        `,
         `
         CREATE TABLE IF NOT EXISTS ${databaseEventos}.eventos_produtos_sistema (
             id  int(11) NOT NULL AUTO_INCREMENT,
             tabela_origem  varchar(50) DEFAULT NULL,
             id_registro  int(11) DEFAULT NULL,
             tipo_evento  enum('INSERT','UPDATE','DELETE') NOT NULL DEFAULT 'INSERT',
             dados_json  blob DEFAULT NULL,
             status  enum('PENDENTE','PROCESSADO','ERRO') DEFAULT 'PENDENTE',
             setor int(11) DEFAULT 0,
             tabela int(11) DEFAULT 0,
              id_message  varchar(255) DEFAULT NULL,
             criado_em  timestamp NULL DEFAULT current_timestamp(),
            PRIMARY KEY ( id )
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci; `,
          //  
          //  ` CREATE TABLE IF NOT EXISTS  ${databaseEventos}.produto_setor (
          //       setor  int(10) unsigned NOT NULL DEFAULT 0,
          //       produto  int(10) unsigned NOT NULL DEFAULT 0,
          //       estoque  float(15,6) NOT NULL DEFAULT 0.000000,
          //       local_produto  varchar(20) DEFAULT '',
          //       local1_produto  varchar(20) DEFAULT '',
          //       local2_produto  varchar(20) DEFAULT '',
          //       local3_produto  varchar(20) DEFAULT '',
          //       local4_produto  varchar(20) DEFAULT '',
          //       data_recadastro  datetime NOT NULL DEFAULT '2000-01-01 00:00:00',
          //      PRIMARY KEY (setor , produto ) USING BTREE,
          //      KEY  PRODUTO  ( produto , setor ) USING BTREE
          //      ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC COMMENT='Produtos do Setor';
          //  `,
          ,
            `
            CREATE TABLE  IF NOT EXISTS ${databaseEventos}.produtos_enviados  (
             id  int(11) NOT NULL AUTO_INCREMENT,
             id_mobile  varchar(255) NOT NULL DEFAULT '0',
             codigo_sistema  varchar(255) DEFAULT '0',
            PRIMARY KEY ( id )
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,
            `CREATE TABLE  IF NOT EXISTS ${databaseEventos}.clientes_enviados  (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
               PRIMARY KEY ( id )
             ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,
            `
            CREATE TABLE IF NOT EXISTS  ${databaseEventos}.movimentos_produtos  (
             id  int(11) NOT NULL AUTO_INCREMENT,
             id_mobile  varchar(255) NOT NULL DEFAULT '0',
             codigo_sistema  varchar(255) DEFAULT '0',
            PRIMARY KEY ( Id )
            ) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,
            `
            CREATE TABLE IF NOt EXISTS ${databaseEventos}.eventos_clientes_sistema  (
             id  int(11) NOT NULL AUTO_INCREMENT,
             tabela_origem  varchar(50) DEFAULT NULL,
             id_registro  int(11) DEFAULT NULL,
             tipo_evento  enum('INSERT','UPDATE','DELETE') NOT NULL DEFAULT 'INSERT',
             dados_json  blob DEFAULT NULL,
             status  enum('PENDENTE','PROCESSADO','ERRO') DEFAULT 'PENDENTE',
             id_message  varchar(255) DEFAULT NULL,
             criado_em  timestamp NULL DEFAULT current_timestamp(),
            PRIMARY KEY (id )
            ) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,
            `
            CREATE TABLE IF NOt EXISTS ${databaseEventos}.eventos_recebimentos_sistema  (
             id  int(11) NOT NULL AUTO_INCREMENT,
             tabela_origem  varchar(50) DEFAULT NULL,
             id_registro  int(11) DEFAULT NULL,
             tipo_evento  enum('INSERT','UPDATE','DELETE') NOT NULL DEFAULT 'INSERT',
             dados_json  blob DEFAULT NULL,
             status  enum('PENDENTE','PROCESSADO','ERRO') DEFAULT 'PENDENTE',
             id_message  varchar(255) DEFAULT NULL,
             criado_em  timestamp NULL DEFAULT current_timestamp(),
            PRIMARY KEY (id )
            ) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `  ,
            `
            CREATE TABLE IF NOt EXISTS ${databaseEventos}.eventos_pedidos_sistema  (
             id  int(11) NOT NULL AUTO_INCREMENT,
             tabela_origem  varchar(50) DEFAULT NULL,
             id_registro  int(11) DEFAULT NULL,
             tipo_evento  enum('INSERT','UPDATE','DELETE') NOT NULL DEFAULT 'INSERT',
             dados_json  blob DEFAULT NULL,
             status  enum('PENDENTE','PROCESSADO','ERRO') DEFAULT 'PENDENTE',
             id_message  varchar(255) DEFAULT NULL,
             criado_em  timestamp NULL DEFAULT current_timestamp(),
            PRIMARY KEY (id )
            ) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `
        ] 



 