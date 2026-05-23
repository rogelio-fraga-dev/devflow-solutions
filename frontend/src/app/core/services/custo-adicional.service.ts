import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CustoAdicional, CustoAdicionalRequest } from '../models/custo-adicional.model';

@Injectable({ providedIn: 'root' })
export class CustoAdicionalService {
  private url = `${environment.apiUrl}/custos-adicionais`;

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<CustoAdicional[]>(this.url); }
  getByProjeto(projetoId: number) { return this.http.get<CustoAdicional[]>(`${this.url}/projeto/${projetoId}`); }
  getById(id: number) { return this.http.get<CustoAdicional>(`${this.url}/${id}`); }
  create(data: CustoAdicionalRequest) { return this.http.post<CustoAdicional>(this.url, data); }
  update(id: number, data: CustoAdicionalRequest) { return this.http.put<CustoAdicional>(`${this.url}/${id}`, data); }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}
