import   mysql  from 'mysql2/promise';

export const PUBLICO = process.env.PUBLICO
export const VENDAS = process.env.VENDAS
export const ESTOQUE = process.env.ESTOQUE
export const FINANCEIRO = process.env.FINANCEIRO

    
const DB_CONFIG = { 
                      host: process.env.HOST,
                      user:  process.env.USER ,
                      password: process.env.PASSWORD,
                      connectionLimit: 10
                    };
   export  const EVENTOS = `\`${process.env.EVENTOS}\``;


 const dbConn = await mysql.createPool(DB_CONFIG);
     
export default dbConn;
