
/**
 *  Contrato referente a mensagem enviada ao rabbitmq
 */
export interface message {
    id_message: string 
    id_evento:number
    tabela_origem: string
    id_registro: number
    tipo_evento: 'INSERT' | 'UPDATE' | 'DELETE'
    dados_json: string
    status: 'PENDENTE' | 'PROCESSADO' | 'ERRO'
    criado_em: string
}