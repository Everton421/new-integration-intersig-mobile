import { randomUUID } from "node:crypto";
import { dispathProdutos } from "./broker/producers/produtos-producer.ts";
import dbConn, { PUBLICO } from "./connection/database-connection.ts";
import { type eventos_produtos_sistema } from "./interfaces/eventos_produtos_sistema.ts";
import {type eventos_clientes_sistema } from "./interfaces/eventos_clientes_sistema.ts";


    const eventos = process.env.EVENTOS

        const databaseEventos = `\`${process.env.EVENTOS}\``;

    setInterval( async ()=>{
             const [rows  , fields ] = await dbConn.query(`SELECT * FROM ${eventos}.eventos_produtos_sistema where STATUS = 'PENDENTE' LIMIT 100 ;`);

          const data = rows as eventos_produtos_sistema[]
     if( data.length > 0   ){
           
          for(const i of data ){
               const id_message = randomUUID() as string;
                const resultMsg =  await dispathProdutos({
                         id_message: id_message,
                         criado_em: i.criado_em,
                         dados_json:'',
                         id_evento: Number(i.id),
                         id_registro: Number(i.id_registro),
                         status: i.status,
                         tabela_origem: i.tabela_origem,
                         tipo_evento: i.tipo_evento
                    })

                    if(resultMsg){
                         console.log(`[X] Enviado Evento produto | RabbitMQ: id ${id_message}`)
                         await dbConn.query( `UPDATE ${databaseEventos}.eventos_produtos_sistema SET status = 'PROCESSADO', id_message = '${id_message}' WHERE id = ${i.id}  ;`);
                    } 
          }
     }
    }, 10000)
  
/*
setInterval( async ()=>{
             const [rows  , fields ] = await dbConn.query(`SELECT * FROM ${eventos}.eventos_clientes_sistema where STATUS = 'PENDENTE' LIMIT 100 ;`);

          const data = rows as eventos_clientes_sistema[]
     if( data.length > 0   ){
           
          for(const i of data ){
               const id_message = randomUUID() as string;
                const resultMsg =  await dispathClientes({
                         id_message: id_message,
                         criado_em: i.criado_em,
                         dados_json:'',
                         id_evento: Number(i.id),
                         id_registro: Number(i.id_registro),
                         status: i.status,
                         tabela_origem: i.tabela_origem,
                         tipo_evento: i.tipo_evento
                    })

                    if(resultMsg){
                         console.log(`[X] Enviado Evento cliente | RabbitMQ: id ${id_message}`)
                         await dbConn.query( `UPDATE ${databaseEventos}.eventos_clientes_sistema SET status = 'PROCESSADO', id_message = '${id_message}' WHERE id = ${i.id}  ;`);
                    } 
          }
     }
    }, 10000)

*/
     



 