export type IMvtoProdutos={
                     chave_mvto:number
                     item:number   //sequencia usada por faturamento
                     tipo:  'A'| 'B'| 'E'|'F'|'P'|'PU'|'PP'|'PSD'|'PST'|'R'|'PR' //A=Acerto; B=Balanço; E=Expedição; F=Faturamento; P=Produção (Prod. Acabado); PU=Produção (Prod. Utilizado); PP=Produção (Prod. Perdido); PSD=Produção (Prod. Substituído); PST=Produção (Prod. Substituto); R=Requerimento; PR=Produção (Resíduo)
                     ent_sai: 'E'|'S'  
                     setor:number 
                     mov_saldo:'S' |'N' 
                     produto:number // codigo produto
                     grade:number 
                     padronizado:number,
                     unidade:string
                     item_unid:number 
                     fator_qtde:number 
                     quantidade:number 
                     data_mvto:string 
                     hora_mvto:string
                     just_ipi:string 
                     just_icms:string 
                     just_subst:string 

}