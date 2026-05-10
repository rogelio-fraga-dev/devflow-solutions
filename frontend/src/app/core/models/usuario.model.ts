export type Role = 'ADMIN' | 'GESTOR' | 'DESENVOLVEDOR' | 'CLIENTE';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: Role;
  ativo: boolean;
}

export interface UsuarioRequest {
  nome: string;
  email: string;
  senha?: string;
  role: Role;
  ativo: boolean;
}
