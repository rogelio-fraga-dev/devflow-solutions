export type StatusChangeRequest = 'PENDENTE' | 'EM_ANALISE' | 'APROVADO' | 'REJEITADO';

export interface ChangeRequest {
  id: number;
  descricaoMudanca: string;
  valorAdicional: number;
  dataAprovacao?: string;
  status?: StatusChangeRequest;
  impactoHoras?: number;
  solicitante?: string;
  justificativa?: string;
  projetoId: number;
}

export interface ChangeRequestRequest {
  descricaoMudanca: string;
  valorAdicional: number;
  dataAprovacao?: string;
  status?: StatusChangeRequest;
  impactoHoras?: number;
  solicitante?: string;
  justificativa?: string;
  projetoId: number;
}
