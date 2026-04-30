import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjetoService } from '../../core/services/projeto.service';
import { CustoApiService } from '../../core/services/custo-api.service';
import { CustoCloudService } from '../../core/services/custo-cloud.service';
import { ChangeRequestService } from '../../core/services/change-request.service';
import { Projeto } from '../../core/models/projeto.model';
import { CustoApi } from '../../core/models/custo-api.model';
import { CustoCloud } from '../../core/models/custo-cloud.model';
import { ChangeRequest } from '../../core/models/change-request.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Financeiro</h1>
          <p class="page-subtitle">Visão consolidada dos custos do portfólio</p>
        </div>
        @if (selectedProjetoId()) {
          <button class="btn btn-ghost" (click)="downloadPdf()">📄 DRE / Closeout PDF</button>
        }
      </div>

      <!-- Project selector -->
      <div class="card" style="margin-bottom:20px">
        <select class="select" style="max-width:280px" [(ngModel)]="projetoSel" (ngModelChange)="onProjetoChange($event)">
          <option value="">Visão geral do portfólio</option>
          @for (p of projetos(); track p.id) { <option [value]="p.id">{{ p.nome }}</option> }
        </select>
      </div>

      <!-- KPIs -->
      <div class="grid-4" style="margin-bottom:20px">
        <div class="stat-card">
          <div class="stat-label">Budget Total</div>
          <div class="stat-value">{{ totalBudget() | currency:'BRL':'symbol':'1.0-0' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Custo Acumulado</div>
          <div class="stat-value" [style.color]="pctGeral() >= 80 ? '#EF4444' : 'inherit'">{{ totalCusto() | currency:'BRL':'symbol':'1.0-0' }}</div>
          <div class="stat-sub">{{ pctGeral() }}% do budget</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Custos API</div>
          <div class="stat-value" style="color:var(--purple)">{{ totalApi() | currency:'BRL':'symbol':'1.0-0' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Custos Cloud</div>
          <div class="stat-value" style="color:#0EA5E9">{{ totalCloud() | currency:'BRL':'symbol':'1.0-0' }}</div>
        </div>
      </div>

      <!-- Projetos table -->
      <div class="card" style="margin-bottom:20px">
        <h3 style="margin-bottom:16px">Situação por Projeto</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Projeto</th>
              <th>Status</th>
              <th style="text-align:right">Budget</th>
              <th style="text-align:right">Custo Atual</th>
              <th>Consumo</th>
              <th style="text-align:right">CRs</th>
            </tr>
          </thead>
          <tbody>
            @for (p of projetosFiltrados(); track p.id) {
              <tr>
                <td style="font-weight:600">{{ p.nome }}</td>
                <td><span class="chip {{ statusClass(p.status) }}">{{ p.status }}</span></td>
                <td style="text-align:right">{{ p.budgetTotal | currency:'BRL':'symbol':'1.0-0' }}</td>
                <td style="text-align:right" [style.color]="projPct(p) >= 80 ? '#EF4444' : 'inherit'">
                  {{ p.custoAtualAcumulado | currency:'BRL':'symbol':'1.0-0' }}
                </td>
                <td style="min-width:120px">
                  <div class="progress-bar" style="margin-bottom:4px">
                    <div class="progress-fill {{ projPct(p) >= 100 ? 'danger' : projPct(p) >= 80 ? 'warn' : '' }}"
                         [style.width]="projPct(p) + '%'"></div>
                  </div>
                  <span style="font-size:11px;color:var(--text-muted)">{{ projPct(p) }}%</span>
                </td>
                <td style="text-align:right">{{ crCount(p.id) }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Custos API + Cloud -->
      <div class="grid-2">
        <div class="card">
          <h3 style="margin-bottom:16px">Custos de API</h3>
          @if (apisFiltradas().length === 0) {
            <div class="empty-state" style="padding:24px"><p>Sem custos de API</p></div>
          }
          @for (a of apisFiltradas(); track a.id) {
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
              <span style="font-size:13px;color:var(--text-secondary)">{{ a.nomeFerramenta }}</span>
              <span style="font-weight:700;color:var(--purple)">{{ a.valorLicenca | currency:'BRL':'symbol':'1.2-2' }}</span>
            </div>
          }
        </div>
        <div class="card">
          <h3 style="margin-bottom:16px">Custos Cloud</h3>
          @if (cloudFiltrado().length === 0) {
            <div class="empty-state" style="padding:24px"><p>Sem custos cloud</p></div>
          }
          @for (c of cloudFiltrado(); track c.id) {
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
              <div>
                <span style="font-size:13px;font-weight:600">{{ c.provedor }}</span>
                <span style="font-size:11px;color:var(--text-muted);margin-left:8px">{{ c.mesReferencia }}</span>
              </div>
              <span style="font-weight:700;color:#0EA5E9">{{ c.valorFatura | currency:'BRL':'symbol':'1.2-2' }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class FinanceiroComponent implements OnInit {
  private projSvc  = inject(ProjetoService);
  private apiSvc   = inject(CustoApiService);
  private cloudSvc = inject(CustoCloudService);
  private crSvc    = inject(ChangeRequestService);
  private toast    = inject(ToastService);

  projetos  = signal<Projeto[]>([]);
  apis      = signal<CustoApi[]>([]);
  clouds    = signal<CustoCloud[]>([]);
  crs       = signal<ChangeRequest[]>([]);

  projetoSel = '';

  selectedProjetoId() { return this.projetoSel ? Number(this.projetoSel) : null; }

  ngOnInit() {
    this.projSvc.getAll().subscribe(p => this.projetos.set(p));
    this.apiSvc.getAll().subscribe(a => this.apis.set(a));
    this.cloudSvc.getAll().subscribe(c => this.clouds.set(c));
    this.crSvc.getAll().subscribe(c => this.crs.set(c));
  }

  onProjetoChange(_: any) {}

  projetosFiltrados() {
    const id = this.selectedProjetoId();
    return id ? this.projetos().filter(p => p.id === id) : this.projetos();
  }

  apisFiltradas() {
    const id = this.selectedProjetoId();
    return id ? this.apis().filter(a => a.projetoId === id) : this.apis();
  }

  cloudFiltrado() {
    const id = this.selectedProjetoId();
    return id ? this.clouds().filter(c => c.projetoId === id) : this.clouds();
  }

  totalBudget() { return this.projetosFiltrados().reduce((s, p) => s + (p.budgetTotal || 0), 0); }
  totalCusto()  { return this.projetosFiltrados().reduce((s, p) => s + (p.custoAtualAcumulado || 0), 0); }
  totalApi()    { return this.apisFiltradas().reduce((s, a) => s + (a.valorLicenca || 0), 0); }
  totalCloud()  { return this.cloudFiltrado().reduce((s, c) => s + (c.valorFatura || 0), 0); }
  pctGeral()    { const b = this.totalBudget(); return b ? Math.min(Math.round(this.totalCusto() / b * 100), 100) : 0; }
  projPct(p: Projeto) { return p.budgetTotal ? Math.min(Math.round(p.custoAtualAcumulado / p.budgetTotal * 100), 100) : 0; }
  crCount(id: number) { return this.crs().filter(c => c.projetoId === id).length; }

  statusClass(s: string) {
    const map: Record<string, string> = { RASCUNHO:'gray',PLANEJADO:'info',EM_ANDAMENTO:'purple',ALERTA:'warning',ESTOURADO:'error',PAUSADO:'gray',CONCLUIDO:'success',CANCELADO:'error' };
    return map[s] || 'gray';
  }

  downloadPdf() {
    const id = this.selectedProjetoId();
    if (!id) return;
    this.projSvc.getCloseoutPdf(id).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `closeout-${id}.pdf`; a.click();
      URL.revokeObjectURL(url);
    });
  }
}
