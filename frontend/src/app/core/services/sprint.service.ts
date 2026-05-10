import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Sprint, SprintRequest } from '../models/sprint.model';

@Injectable({ providedIn: 'root' })
export class SprintService {
  private url = `${environment.apiUrl}/sprints`;

  constructor(private http: HttpClient) {}

  getByProjeto(projetoId: number) { return this.http.get<Sprint[]>(`${this.url}/projeto/${projetoId}`); }
  getById(id: number) { return this.http.get<Sprint>(`${this.url}/${id}`); }
  create(data: SprintRequest) { return this.http.post<Sprint>(this.url, data); }
  update(id: number, data: SprintRequest) { return this.http.put<Sprint>(`${this.url}/${id}`, data); }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}
