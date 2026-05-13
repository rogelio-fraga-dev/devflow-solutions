import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface DashboardExecutivo {
  totalProjetos: number;
  emAndamento: number;
  emAlerta: number;
  estourados: number;
  budgetGlobal: number;
  burnRatePercentual: number;
  projetos: ProjetoResumo[];
}

export interface ProjetoResumo {
  id: number;
  nome: string;
  clienteNome: string;
  budgetTotal: number;
  custoAtualAcumulado: number;
  burnRatePercentual: number;
  status: string;
}

export interface DreIndividual {
  budgetTotal: number;
  custoAtualAcumulado: number;
  margemLucro: number;
  burnRatePercentual: number;
  dataPrevisaoEsgotamento: string | null;
}

@Injectable({ providedIn: 'root' })
export class AnaliseService {
  private url = `${environment.apiUrl}/analise`;

  constructor(private http: HttpClient) {}

  getDashboardExecutivo(): Observable<DashboardExecutivo> {
    return this.http.get<DashboardExecutivo>(`${this.url}/dashboard-executivo`);
  }

  getDreIndividual(projetoId: number): Observable<DreIndividual> {
    return this.http.get<DreIndividual>(`${this.url}/dre/${projetoId}`);
  }
}
