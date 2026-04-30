export interface CustoApi {
  id: number;
  nomeFerramenta: string;
  valorLicenca: number;
  projetoId: number;
}

export interface CustoApiRequest {
  nomeFerramenta: string;
  valorLicenca: number;
  projetoId: number;
}
