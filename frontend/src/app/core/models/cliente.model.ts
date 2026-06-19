export interface Endereco {
  logradouro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

export interface Cliente {
  id: number;
  razaoSocial: string;
  cnpj: string;
  pessoaContato: string;
  endereco?: Endereco;
  foto?: string;
}

export interface ClienteRequest {
  razaoSocial: string;
  cnpj: string;
  pessoaContato: string;
  endereco?: Endereco;
  foto?: string;
}

