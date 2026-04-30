import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CustoApi, CustoApiRequest } from '../models/custo-api.model';

@Injectable({ providedIn: 'root' })
export class CustoApiService {
  private url = `${environment.apiUrl}/custos-api`;

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<CustoApi[]>(this.url); }
  getByProjeto(projetoId: number) { return this.http.get<CustoApi[]>(`${this.url}/projeto/${projetoId}`); }
  getById(id: number) { return this.http.get<CustoApi>(`${this.url}/${id}`); }
  create(data: CustoApiRequest) { return this.http.post<CustoApi>(this.url, data); }
  update(id: number, data: CustoApiRequest) { return this.http.put<CustoApi>(`${this.url}/${id}`, data); }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}
