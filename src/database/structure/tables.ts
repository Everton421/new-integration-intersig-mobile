import dbConn, { EVENTOS } from "../../connection/database-connection.ts";

 

        const databaseEventos = `\`${process.env.EVENTOS}\``;

    export const sqlTables   = [
          `
          CREATE DATABASE IF NOT EXISTS${databaseEventos}; 
          `,
         
             `CREATE TABLE  IF NOT EXISTS ${databaseEventos}.setores_enviados (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
               createdAt timestamp NULL DEFAULT current_timestamp(),
               updatedAt timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
               PRIMARY KEY ( id ),
               KEY  codigo_sistema  ( codigo_sistema , id_mobile )
           ) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;  `
          ,
             `CREATE TABLE  IF NOT EXISTS ${databaseEventos}.produtos_enviados (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
               PRIMARY KEY ( id ),
               KEY  codigo_sistema  ( codigo_sistema , id_mobile )
          ) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
             `,
            `CREATE TABLE  IF NOT EXISTS ${databaseEventos}.clientes_enviados  (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
                createdAt timestamp NULL DEFAULT current_timestamp(),
               updatedAt timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
               PRIMARY KEY ( id ),
                KEY  codigo_sistema  ( codigo_sistema , id_mobile )

             ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,
              `CREATE TABLE  IF NOT EXISTS ${databaseEventos}.marcas_enviadas  (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
                createdAt timestamp NULL DEFAULT current_timestamp(),
               updatedAt timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
               PRIMARY KEY ( id ),
                KEY  codigo_sistema  ( codigo_sistema , id_mobile )

             ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,
              `CREATE TABLE  IF NOT EXISTS ${databaseEventos}.categorias_enviadas  (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
                createdAt timestamp NULL DEFAULT current_timestamp(),
               updatedAt timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
               PRIMARY KEY ( id ),
                KEY  codigo_sistema  ( codigo_sistema , id_mobile )
             ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,
              `CREATE TABLE  IF NOT EXISTS ${databaseEventos}.servicos_enviados  (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
                createdAt timestamp NULL DEFAULT current_timestamp(),
               updatedAt timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
               PRIMARY KEY ( id ),
                KEY  codigo_sistema  ( codigo_sistema , id_mobile )
               ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,
              `CREATE TABLE  IF NOT EXISTS ${databaseEventos}.tiposos_enviadas  (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
                createdAt timestamp NULL DEFAULT current_timestamp(),
               updatedAt timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
               PRIMARY KEY ( id ),
                KEY  codigo_sistema  ( codigo_sistema , id_mobile )
             ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,
            `CREATE TABLE  IF NOT EXISTS ${databaseEventos}.veiculos_enviados  (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
                createdAt timestamp NULL DEFAULT current_timestamp(),
               updatedAt timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
               PRIMARY KEY ( id ),
                KEY  codigo_sistema  ( codigo_sistema , id_mobile )
             ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,
             `CREATE TABLE  IF NOT EXISTS ${databaseEventos}.formaspagamento_enviados  (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
                createdAt timestamp NULL DEFAULT current_timestamp(),
               updatedAt timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
               PRIMARY KEY ( id ),
                KEY  codigo_sistema  ( codigo_sistema , id_mobile )
             ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,

            ` CREATE TABLE IF NOT EXISTS  ${databaseEventos}.movimentos_produtos  (
             id  int(11) NOT NULL AUTO_INCREMENT,
             id_mobile  varchar(255) NOT NULL DEFAULT '0',
             codigo_sistema  varchar(255) DEFAULT '0',
              createdAt timestamp NULL DEFAULT current_timestamp(),
               updatedAt timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
            PRIMARY KEY ( Id ),
                KEY  codigo_sistema  ( codigo_sistema , id_mobile )
            ) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,
           ` CREATE TABLE IF NOT EXISTS  ${databaseEventos}.pedidos  (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
               createdAt  timestamp NULL DEFAULT current_timestamp(),
               updatedAt  timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
              PRIMARY KEY ( id ),
                KEY  codigo_sistema  ( codigo_sistema , id_mobile )
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;`,
          
            `  CREATE TABLE IF NOT EXISTS ${databaseEventos}.eventos_sistema (
              id  int(11) NOT NULL AUTO_INCREMENT,
              tabela_origem  varchar(50) DEFAULT NULL,
              id_registro  int(11) DEFAULT NULL,
              tipo_evento  enum('INSERT','UPDATE','DELETE') NOT NULL DEFAULT 'INSERT',
              dados_json  blob DEFAULT NULL,
              status  enum('PENDENTE','PROCESSADO','ERRO') DEFAULT 'PENDENTE',
              setor int(11) DEFAULT 0,
              tabela int(11) DEFAULT 0,
              id_message  varchar(255) DEFAULT NULL,
              createdAt timestamp NULL DEFAULT current_timestamp(),
              updatedAt timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
              PRIMARY KEY ( id )
              ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci; ` 
            
              
        ] 



 