import test from "node:test";
import { ErpLogsRepository } from "../erp-logs-repository.ts";
import assert from "node:assert";
 
test("test logs erp repository" , async ( t )=>{
   
    const obj = new ErpLogsRepository();

    try{
        const data =    await obj.createLog({
                ACAO:1,
                APELIDO:'teste',
                HISTORICO:'teste',
                IP_CPU:'192.168.100.106',
            });

            assert.strictEqual(data.affectedRows , 1)

    }catch(e){
        console.log(e)
    }

})