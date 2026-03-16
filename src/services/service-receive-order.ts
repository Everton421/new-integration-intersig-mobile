import { isQuestionOrExclamationToken } from "typescript";
import dbConn, { MOBILE } from "../connection/database-connection.ts";
import { pedidosRecebidos } from "../contracts/pedidos-recebidos.ts";
import { insertPedido, updatePedido } from "../repository/repository-pedido.ts";
import { api } from "../services/api.ts";

async function insertNewOrder(order:any){
    if(order.codigo){

           const [rows] =  await dbConn.query(`SELECT * FROM ${MOBILE}.pedidos WHERE id_mobile = ${order.codigo} `);
                    const verify = rows as pedidosRecebidos[];
                    if( verify.length > 0 ){
                        console.log(`O pedido já foi registrado anteriormente`)
                    }else{

                const result = await api.get(`/pedido?codigo=${order.codigo}`);
                        
                if(result.data && result.data.length > 0 ){
                      const resultInsert = await insertPedido(result.data[0] );
//
                 if(resultInsert){
                     const resultInsertEvent = await dbConn.query(`INSERT INTO ${MOBILE}.pedidos SET id_mobile = ${order.codigo}, codigo_sistema=${resultInsert} `);
                 }
                }else{
                        console.log(`[X] Resulta da consulta vazio, codigo pedido: ${order.codigo}  `)
                }

            }
        }   

}


async function updateOrder(order:any){
    if(order.codigo){
            const [rows] =  await dbConn.query(`SELECT * FROM ${MOBILE}.pedidos WHERE id_mobile = ${order.codigo} `);
                    const verify = rows as pedidosRecebidos[];
                    if( verify.length > 0 ){
                const result = await api.get(`/pedido?codigo=${order.codigo}`);

                 if(result.data && result.data.length > 0 ){
                     await updatePedido(result.data[0], verify[0].codigo_sistema )    
                 }

               }
    }

}

