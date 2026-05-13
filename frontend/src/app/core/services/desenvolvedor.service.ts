import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Desenvolvedor, DesenvolvedorRequest } from '../models/desenvolvedor.model';

@Injectable({ providedIn: 'root' })
export class DesenvolvedorService {
  private url = `${environment.apiUrl}/desenvolvedores`;

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Desenvolvedor[]>(this.url); }
  getById(id: number) { return this.http.get<Desenvolvedor>(`${this.url}/${id}`); }
  create(data: DesenvolvedorRequest) { return this.http.post<Desenvolvedor>(this.url, data); }
  update(id: number, data: DesenvolvedorRequest) { return this.http.put<Desenvolvedor>(`${this.url}/${id}`, data); }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }

  getProdutividade(): Observable<any[]> { return this.http.get<any[]>(`${this.url}/produtividade`); }
}
