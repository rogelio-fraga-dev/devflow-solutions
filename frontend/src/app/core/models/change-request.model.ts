export interface ChangeRequest {
  id: number;
  descricaoMudanca: string;
  valorAdicional: number;
  dataAprovacao?: string;
  projetoId: number;
}

export interface ChangeRequestRequest {
  descricaoMudanca: string;
  valorAdicional: number;
  dataAprovacao?: string;
  projetoId: number;
}
