export type FaseSprint =
  | 'BACKLOG'
  | 'PLANEJAMENTO'
  | 'DESENVOLVIMENTO'
  | 'TESTES'
  | 'HOMOLOGACAO'
  | 'ENCERRAMENTO';

export type StatusSprint =
  | 'PLANEJADA'
  | 'EM_ANDAMENTO'
  | 'CONCLUIDA'
  | 'CANCELADA';

export interface Sprint {
  id: number;
  nomeFase: FaseSprint;
  status: StatusSprint;
  dataInicio: string;
  dataFim: string;
  objetivo?: string;
  observacoes?: string;
  horasEstimadas?: number;
  projetoId: number;
}

export interface SprintRequest {
  nomeFase: FaseSprint;
  status: StatusSprint;
  dataInicio: string;
  dataFim: string;
  objetivo?: string;
  observacoes?: string;
  horasEstimadas?: number;
  projetoId: number;
}
