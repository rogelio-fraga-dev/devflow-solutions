export interface CustoAdicional {
  id: number;
  descricao: string;
  valorAdicional: number;
  projetoId: number;
}

export interface CustoAdicionalRequest {
  descricao: string;
  valorAdicional: number;
  projetoId: number;
}
