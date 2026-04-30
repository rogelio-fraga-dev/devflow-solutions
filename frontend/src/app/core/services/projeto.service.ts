import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Projeto, ProjetoRequest } from '../models/projeto.model';

@Injectable({ providedIn: 'root' })
export class ProjetoService {
  private url = `${environment.apiUrl}/projetos`;

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Projeto[]>(this.url); }
  getById(id: number) { return this.http.get<Projeto>(`${this.url}/${id}`); }
  create(data: ProjetoRequest) { return this.http.post<Projeto>(this.url, data); }
  update(id: number, data: ProjetoRequest) { return this.http.put<Projeto>(`${this.url}/${id}`, data); }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
  getDre(id: number) { return this.http.get<any>(`${this.url}/${id}/financeiro/dre`); }
  getCloseoutPdf(id: number) {
    return this.http.get(`${this.url}/${id}/financeiro/closeout/pdf`, { responseType: 'blob' });
  }
}
