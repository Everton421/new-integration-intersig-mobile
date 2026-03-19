export interface message_movimento_produtos {
   codigo:  number
  setor: number
  ent_sai: 'E' | 'S' 
  unidade_medida: string
  produto: number
  quantidade: number
  tipo: 'A' | string 
  historico: string
  data_recadastro:string  
  usuario: number
  id:number
}