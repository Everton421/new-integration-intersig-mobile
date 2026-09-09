import test from "node:test";
import { UpdateSalesOrderSeparation } from "../service-receive-sales-order-separation.ts";

 

test("UpdateSalesOrderSeparation" , async ( t )=>{
   
    await t.test("updateErpOrder ", async ()=>{
        const resultUpdateSalesOrder = await UpdateSalesOrderSeparation.updateErpOrder( { pedido :1944088, tipo :1, situacao_separacao: 'I', itens_processados :1, series_registradas :1})
        console.log(resultUpdateSalesOrder);
    })

})