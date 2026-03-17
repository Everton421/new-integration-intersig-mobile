 
 

        const database_mobile = `\`${process.env.MOBILE}\``;

    export const sqlTables   = [
          `
          CREATE DATABASE IF NOT EXISTS${database_mobile}; 
          `,
         
             `CREATE TABLE  IF NOT EXISTS ${database_mobile}.setores_enviados (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
               createdAt timestamp NULL DEFAULT current_timestamp(),
               updatedAt timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
               PRIMARY KEY ( id ),
               KEY  codigo_sistema  ( codigo_sistema , id_mobile )
           ) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;  `
          ,
             `CREATE TABLE  IF NOT EXISTS ${database_mobile}.produtos_enviados (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
               PRIMARY KEY ( id ),
               KEY  codigo_sistema  ( codigo_sistema , id_mobile )
          ) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
             `,
            `CREATE TABLE  IF NOT EXISTS ${database_mobile}.clientes_enviados  (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
                createdAt timestamp NULL DEFAULT current_timestamp(),
               updatedAt timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
               PRIMARY KEY ( id ),
                KEY  codigo_sistema  ( codigo_sistema , id_mobile )

             ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,
              `CREATE TABLE  IF NOT EXISTS ${database_mobile}.marcas_enviadas  (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
                createdAt timestamp NULL DEFAULT current_timestamp(),
               updatedAt timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
               PRIMARY KEY ( id ),
                KEY  codigo_sistema  ( codigo_sistema , id_mobile )

             ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,
              `CREATE TABLE  IF NOT EXISTS ${database_mobile}.categorias_enviadas  (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
                createdAt timestamp NULL DEFAULT current_timestamp(),
               updatedAt timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
               PRIMARY KEY ( id ),
                KEY  codigo_sistema  ( codigo_sistema , id_mobile )
             ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,
              `CREATE TABLE  IF NOT EXISTS ${database_mobile}.servicos_enviados  (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
                createdAt timestamp NULL DEFAULT current_timestamp(),
               updatedAt timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
               PRIMARY KEY ( id ),
                KEY  codigo_sistema  ( codigo_sistema , id_mobile )
               ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,
              `CREATE TABLE  IF NOT EXISTS ${database_mobile}.tiposos_enviadas  (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
                createdAt timestamp NULL DEFAULT current_timestamp(),
               updatedAt timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
               PRIMARY KEY ( id ),
                KEY  codigo_sistema  ( codigo_sistema , id_mobile )
             ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,
            `CREATE TABLE  IF NOT EXISTS ${database_mobile}.veiculos_enviados  (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
                createdAt timestamp NULL DEFAULT current_timestamp(),
               updatedAt timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
               PRIMARY KEY ( id ),
                KEY  codigo_sistema  ( codigo_sistema , id_mobile )
             ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,
             `CREATE TABLE  IF NOT EXISTS ${database_mobile}.formaspagamento_enviados  (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
                createdAt timestamp NULL DEFAULT current_timestamp(),
               updatedAt timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
               PRIMARY KEY ( id ),
                KEY  codigo_sistema  ( codigo_sistema , id_mobile )
             ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,

            ` CREATE TABLE IF NOT EXISTS  ${database_mobile}.movimentos_produtos  (
             id  int(11) NOT NULL AUTO_INCREMENT,
             id_mobile  varchar(255) NOT NULL DEFAULT '0',
             codigo_sistema  varchar(255) DEFAULT '0',
              createdAt timestamp NULL DEFAULT current_timestamp(),
               updatedAt timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
            PRIMARY KEY ( Id ),
                KEY  codigo_sistema  ( codigo_sistema , id_mobile )
            ) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
            `,
           ` CREATE TABLE IF NOT EXISTS  ${database_mobile}.pedidos  (
               id  int(11) NOT NULL AUTO_INCREMENT,
               id_mobile  varchar(255) NOT NULL DEFAULT '0',
               codigo_sistema  varchar(255) DEFAULT '0',
               createdAt  timestamp NULL DEFAULT current_timestamp(),
               updatedAt  timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
              PRIMARY KEY ( id ),
                KEY  codigo_sistema  ( codigo_sistema , id_mobile )
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;`,
          
         
              
        ] 



 