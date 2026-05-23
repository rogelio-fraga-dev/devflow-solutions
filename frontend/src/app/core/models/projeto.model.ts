import { Desenvolvedor } from './desenvolvedor.model';

export type StatusProjeto =
  | 'RASCUNHO'
  | 'PLANEJADO'
  | 'EM_ANDAMENTO'
  | 'ALERTA'
  | 'ESTOURADO'
  | 'PAUSADO'
  | 'CONCLUIDO'
  | 'CANCELADO';

export type PrioridadeProjeto = 'BAIXA' | 'MEDIA' | 'ALTA';
export type RiscoProjeto = 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';

export interface Projeto {
  id: number;
  nome: string;
  stackTecnologica: string;
  budgetTotal: number;
  custoAtualAcumulado: number;
  dataInicio: string;
  dataPrevisaoEntrega: string;
  status: StatusProjeto;
  descricao?: string;
  prioridade?: PrioridadeProjeto;
  riscoAtual?: RiscoProjeto;
  clienteId?: number;
  clienteNome?: string;
  gestorId?: number;
  gestorNome?: string;
  desenvolvedores?: Desenvolvedor[];
}

export interface ProjetoRequest {
  nome: string;
  stackTecnologica: string;
  budgetTotal: number;
  dataInicio: string;
  dataPrevisaoEntrega: string;
  status: StatusProjeto;
  descricao?: string;
  prioridade?: PrioridadeProjeto;
  riscoAtual?: RiscoProjeto;
  clienteId?: number;
  gestorId?: number;
  desenvolvedoresIds?: number[];
}
