import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Cliente, ClienteRequest } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private url = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Cliente[]>(this.url); }
  getById(id: number) { return this.http.get<Cliente>(`${this.url}/${id}`); }
  create(data: ClienteRequest) { return this.http.post<Cliente>(this.url, data); }
  update(id: number, data: ClienteRequest) { return this.http.put<Cliente>(`${this.url}/${id}`, data); }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}
