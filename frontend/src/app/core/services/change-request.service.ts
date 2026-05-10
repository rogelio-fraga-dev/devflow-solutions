import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ChangeRequest, ChangeRequestRequest } from '../models/change-request.model';

@Injectable({ providedIn: 'root' })
export class ChangeRequestService {
  private url = `${environment.apiUrl}/change-requests`;

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<ChangeRequest[]>(this.url); }
  getByProjeto(projetoId: number) { return this.http.get<ChangeRequest[]>(`${this.url}/projeto/${projetoId}`); }
  getById(id: number) { return this.http.get<ChangeRequest>(`${this.url}/${id}`); }
  create(data: ChangeRequestRequest) { return this.http.post<ChangeRequest>(this.url, data); }
  update(id: number, data: ChangeRequestRequest) { return this.http.put<ChangeRequest>(`${this.url}/${id}`, data); }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}
