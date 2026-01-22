export interface eventos_clientes_sistema
{ 
    id:number
    tabela_origem:string
    id_registro:number
    tipo_evento: 'INSERT' | 'UPDATE' | 'DELETE'
    dados_json: string
    status: 'PENDENTE' | 'PROCESSADO' | 'ERRO'
    criado_em: string
}