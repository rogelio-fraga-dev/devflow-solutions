export type Senioridade = 'JUNIOR' | 'PLENO' | 'SENIOR' | 'GESTOR_TECH_LEAD';

export interface Desenvolvedor {
  id: number;
  nome: string;
  senioridade: Senioridade;
  valorHoraCusto: number;
  valorHoraExtra: number;
  usuarioId?: number;
}

export interface DesenvolvedorRequest {
  nome: string;
  senioridade: Senioridade;
  valorHoraCusto: number;
  valorHoraExtra: number;
  usuarioId?: number;
}
