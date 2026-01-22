import dbConn from "../../connection/database-connection.ts";

 

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
            
        ] 



 