export type ProvedorCloud = 'AWS' | 'AZURE' | 'GCP' | 'ORACLE' | 'DIGITALOCEAN';

export interface CustoCloud {
  id: number;
  provedor: ProvedorCloud;
  valorFatura: number;
  mesReferencia: string;
  projetoId: number;
}

export interface CustoCloudRequest {
  provedor: ProvedorCloud;
  valorFatura: number;
  mesReferencia: string;
  projetoId: number;
}
