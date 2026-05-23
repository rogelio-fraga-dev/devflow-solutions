import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, map } from 'rxjs';

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
  private url = `${environment.apiUrl}/projetos`;

  constructor(private http: HttpClient) {}

  getDashboardExecutivo(): Observable<DashboardExecutivo> {
    return this.http.get<any>(`${this.url}/dashboard-executivo`).pipe(
      map(res => ({
        totalProjetos: res.totalProjetos,
        emAndamento: res.projetosEmAndamento,
        emAlerta: res.projetosEmAlerta,
        estourados: res.projetosEstourados,
        budgetGlobal: res.investimentoTotalAlocado,
        burnRatePercentual: res.burnRateGlobal,
        projetos: (res.resumoProjetos || []).map((p: any) => ({
          id: p.id,
          nome: p.nome,
          clienteNome: p.clienteNome,
          budgetTotal: p.budgetTotal,
          custoAtualAcumulado: p.custoAtual,
          burnRatePercentual: p.burnRatePercentual,
          status: p.status
        }))
      }))
    );
  }

  getDreIndividual(projetoId: number): Observable<DreIndividual> {
    return this.http.get<any>(`${this.url}/${projetoId}/financeiro/dre`).pipe(
      map(res => ({
        budgetTotal: res.budgetTotal,
        custoAtualAcumulado: res.custoAtual,
        margemLucro: res.margemLucroBruta,
        burnRatePercentual: res.burnRatePercentual,
        dataPrevisaoEsgotamento: res.dataPrevisaoEsgotamento
      }))
    );
  }
}

