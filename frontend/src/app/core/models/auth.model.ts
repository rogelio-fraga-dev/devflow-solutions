export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}

export interface CurrentUser {
  email: string;
  role: 'ADMIN' | 'GESTOR' | 'DESENVOLVEDOR' | 'CLIENTE';
  nome?: string;
  empresa?: string;
  foto?: string;
}

