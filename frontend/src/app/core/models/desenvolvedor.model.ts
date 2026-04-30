export type Senioridade = 'ESTAGIARIO' | 'JUNIOR' | 'PLENO' | 'SENIOR' | 'ESPECIALISTA';

export interface Desenvolvedor {
  id: number;
  nome: string;
  senioridade: Senioridade;
  valorHoraCusto: number;
  valorHoraExtra: number;
  usuarioId?: number;
  projetoId?: number;
}

export interface DesenvolvedorRequest {
  nome: string;
  senioridade: Senioridade;
  valorHoraCusto: number;
  valorHoraExtra: number;
  usuarioId?: number;
  projetoId?: number;
}
