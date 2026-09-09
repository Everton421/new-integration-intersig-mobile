import test from "node:test";
import { UpdateSalesOrderSeparation } from "../service-receive-sales-order-separation.ts";

 

test("SERVICE RECEIVE SALES ORDER SEPARATION" , async ( t )=>{
   
    await t.test(" update separation ", async ()=>{
        const resultUpdateSalesOrder = await UpdateSalesOrderSeparation.updateErpOrderSeparation( { pedido :1944088, tipo :1, situacao_separacao: 'I', itens_processados :1, series_registradas :1})
        console.log(resultUpdateSalesOrder);
    })

   //     await t.test(" update separation ", async ()=>{
   //     const resultUpdateSalesOrder = await UpdateSalesOrderSeparation.updateErpOrder( { codigo :1944088, status_separacao:'RECUSADA'})
   //     console.log(resultUpdateSalesOrder);
    //})

})