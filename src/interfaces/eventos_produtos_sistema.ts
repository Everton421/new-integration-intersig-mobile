export interface eventos_produtos_sistema { 
    id:string
    tabela_origem:string
    id_registro:string
    tipo_evento: 'INSERT' | 'UPDATE' | 'DELETE'
    dados_json:string
    status: 'PENDENTE' | 'PROCESSADO' | 'ERRO'
    setor:number
    tabela:number
    criado_em:string
    saldo:number
id_message:string
}
