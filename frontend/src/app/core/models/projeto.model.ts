export type StatusProjeto =
  | 'RASCUNHO'
  | 'PLANEJADO'
  | 'EM_ANDAMENTO'
  | 'ALERTA'
  | 'ESTOURADO'
  | 'PAUSADO'
  | 'CONCLUIDO'
  | 'CANCELADO';

export interface Projeto {
  id: number;
  nome: string;
  stackTecnologica: string;
  budgetTotal: number;
  custoAtualAcumulado: number;
  dataInicio: string;
  dataPrevisaoEntrega: string;
  status: StatusProjeto;
  clienteId?: number;
  clienteNome?: string;
}

export interface ProjetoRequest {
  nome: string;
  stackTecnologica: string;
  budgetTotal: number;
  dataInicio: string;
  dataPrevisaoEntrega: string;
  status: StatusProjeto;
  clienteId?: number;
}
