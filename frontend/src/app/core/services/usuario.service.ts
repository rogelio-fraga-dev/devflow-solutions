import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Usuario, UsuarioRequest } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private url = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Usuario[]>(this.url); }
  getById(id: number) { return this.http.get<Usuario>(`${this.url}/${id}`); }
  create(data: UsuarioRequest) { return this.http.post<Usuario>(this.url, data); }
  update(id: number, data: UsuarioRequest) { return this.http.put<Usuario>(`${this.url}/${id}`, data); }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}
