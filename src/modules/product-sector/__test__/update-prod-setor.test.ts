import test from "node:test";
import { ProdSetorRepository } from "../repository-prod-setor.ts";


test("", async ( t )=>{

    await t.test("", async ( )=>{
    //  const resultUpdateProdSetor = await ProdSetorRepository.updateProdSetor(
    //            {
    //                data_recadastro:'',
    //                estoque: 1,
    //                id_produto: '21734' ,
    //                id_setor: '1' ,
    //                local1_produto: '',
    //                local2_produto: '',
    //                local3_produto: '',
    //                local4_produto: '',
    //                local_produto: '',
    //                produto: 21734,
    //                setor: 1
//
    //              }
    //        )
//
    //        console.log(resultUpdateProdSetor)


 

      const resultUpdateProdSetor = await ProdSetorRepository.updateStockBySectorAndProduct(56098, 1, 2)
        console.log(resultUpdateProdSetor)

})
})