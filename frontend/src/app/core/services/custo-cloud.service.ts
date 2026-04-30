import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CustoCloud, CustoCloudRequest } from '../models/custo-cloud.model';

@Injectable({ providedIn: 'root' })
export class CustoCloudService {
  private url = `${environment.apiUrl}/custos-cloud`;

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<CustoCloud[]>(this.url); }
  getByProjeto(projetoId: number) { return this.http.get<CustoCloud[]>(`${this.url}/projeto/${projetoId}`); }
  getById(id: number) { return this.http.get<CustoCloud>(`${this.url}/${id}`); }
  create(data: CustoCloudRequest) { return this.http.post<CustoCloud>(this.url, data); }
  update(id: number, data: CustoCloudRequest) { return this.http.put<CustoCloud>(`${this.url}/${id}`, data); }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}
