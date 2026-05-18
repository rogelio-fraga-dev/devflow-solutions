import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjetoService } from '../../core/services/projeto.service';
import { AnaliseService, DashboardExecutivo, DreIndividual } from '../../core/services/analise.service';
import { DesenvolvedorService } from '../../core/services/desenvolvedor.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard Executivo</h1>
          <p class="page-subtitle">Visão consolidada do portfólio da empresa</p>
        </div>
      </div>

      <!-- LINHA 1 — KPI Cards (6 cards na horizontal) -->
      @if (dashboard()) {
        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; margin-bottom: 24px;">
          <div class="stat-card">
            <div class="stat-label">Total Projetos</div>
            <div class="stat-value">{{ dashboard()?.totalProjetos }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Em Andamento</div>
            <div class="stat-value" style="color: var(--brand-primary)">{{ dashboard()?.emAndamento }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Em Alerta 🟡</div>
            <div class="stat-value" style="color: var(--status-warning)">{{ dashboard()?.emAlerta }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Estourados 🔴</div>
            <div class="stat-value" style="color: var(--status-danger)">{{ dashboard()?.estourados }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Budget Global</div>
            <div class="stat-value" style="font-size: 20px;">{{ dashboard()?.budgetGlobal | currency:'BRL':'symbol':'1.0-0' }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Burn Rate %</div>
            <div class="stat-value" [style.color]="(dashboard()?.burnRatePercentual ?? 0) > 80 ? 'var(--status-danger)' : 'inherit'">{{ dashboard()?.burnRatePercentual | number:'1.1-1' }}%</div>
          </div>
        </div>
      }

      <!-- LINHA 2 — Tabela de Projetos -->
      <div class="card" style="margin-bottom: 24px;">
        <h3 style="margin-bottom: 16px;">Projetos</h3>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Projeto</th>
                <th>Cliente</th>
                <th style="text-align:right">Budget</th>
                <th style="text-align:right">Custo Atual</th>
                <th style="width:150px">Burn Rate</th>
                <th>Status</th>
                <th style="text-align:center">Ações</th>
              </tr>
            </thead>
            <tbody>
              @for (p of dashboard()?.projetos; track p.id) {
                <tr>
                  <td style="font-weight:600">{{ p.nome }}</td>
                  <td style="color: var(--text-muted)">{{ p.clienteNome || '—' }}</td>
                  <td style="text-align:right">{{ p.budgetTotal | currency:'BRL':'symbol':'1.0-0' }}</td>
                  <td style="text-align:right">{{ p.custoAtualAcumulado | currency:'BRL':'symbol':'1.0-0' }}</td>
                  <td>
                    <div class="progress-bar" style="margin-bottom:4px">
                      <div class="progress-fill" [style.width]="(p.burnRatePercentual > 100 ? 100 : p.burnRatePercentual) + '%'"
                           [ngClass]="{'warn': p.burnRatePercentual >= 60 && p.burnRatePercentual < 80, 'danger': p.burnRatePercentual >= 80}">
                      </div>
                    </div>
                    <span style="font-size:11px;color:var(--text-muted)">{{ p.burnRatePercentual | number:'1.1-1' }}%</span>
                  </td>
                  <td>
                    <span class="chip" [style.background]="getStatusBadge(p.status).color" style="color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
                      {{ getStatusBadge(p.status).label }}
                    </span>
                  </td>
                  <td style="text-align:center">
                    <button class="btn btn-ghost" style="padding:4px 8px; font-size:11px; margin-right: 4px;" (click)="verDre(p.id)">Ver DRE</button>
                    <button class="btn btn-ghost" style="padding:4px 8px; font-size:11px;" (click)="exportarPdf(p.id)">PDF</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- LINHA 3 — Ranking de Desenvolvedores -->
      <div class="card">
        <h3 style="margin-bottom: 16px;">Ranking de Desenvolvedores</h3>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Dev</th>
                <th>Senioridade</th>
                <th style="text-align:right">Horas Lançadas</th>
                <th style="text-align:right">Custo Gerado</th>
              </tr>
            </thead>
            <tbody>
              @for (d of produtividade(); track d.devNome) {
                <tr>
                  <td style="font-weight:600">{{ d.devNome }}</td>
                  <td>{{ d.senioridade }}</td>
                  <td style="text-align:right">{{ d.horasTotais }}h</td>
                  <td style="text-align:right; color: var(--status-danger)">{{ d.custoGerado | currency:'BRL':'symbol':'1.0-0' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal DRE -->
    @if (modalDreOpen()) {
      <div class="modal-overlay" (click)="fecharModal()">
        <div class="modal modal-content" (click)="$event.stopPropagation()">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
            <h3>DRE Consolidado</h3>
            <button class="btn btn-ghost" style="padding:4px;" (click)="fecharModal()">✕</button>
          </div>
          
          @if (dreIndividual()) {
            <div style="display:flex; flex-direction:column; gap:12px; margin-bottom: 24px;">
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border); padding-bottom:8px;">
                <span style="color:var(--text-muted)">Budget Total</span>
                <span style="font-weight:600">{{ dreIndividual()?.budgetTotal | currency:'BRL':'symbol':'1.2-2' }}</span>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border); padding-bottom:8px;">
                <span style="color:var(--text-muted)">Custo Atual</span>
                <span style="font-weight:600; color:var(--status-danger)">{{ dreIndividual()?.custoAtualAcumulado | currency:'BRL':'symbol':'1.2-2' }}</span>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border); padding-bottom:8px;">
                <span style="color:var(--text-muted)">Margem de Lucro Bruto</span>
                <span style="font-weight:600; color:var(--status-safe)">{{ dreIndividual()?.margemLucro | currency:'BRL':'symbol':'1.2-2' }}</span>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border); padding-bottom:8px;">
                <span style="color:var(--text-muted)">Burn Rate</span>
                <span style="font-weight:600">{{ dreIndividual()?.burnRatePercentual | number:'1.1-1' }}%</span>
              </div>
              <div style="display:flex; justify-content:space-between; padding-bottom:8px;">
                <span style="color:var(--text-muted)">Previsão de Esgotamento</span>
                <span style="font-weight:600">{{ dreIndividual()?.dataPrevisaoEsgotamento ? (dreIndividual()?.dataPrevisaoEsgotamento | date:'dd/MM/yyyy') : 'N/A' }}</span>
              </div>
            </div>
            
            <div class="modal-actions">
              <button class="btn btn-primary" style="width:100%; justify-content:center;" (click)="exportarPdf(projetoDreId())">Exportar PDF</button>
            </div>
          } @else {
            <p>Carregando...</p>
          }
        </div>
      </div>
    }
  `
})
export class FinanceiroComponent implements OnInit {
  private analiseSvc = inject(AnaliseService);
  private devSvc = inject(DesenvolvedorService);
  private projSvc = inject(ProjetoService);
  private toast = inject(ToastService);

  dashboard = signal<DashboardExecutivo | null>(null);
  produtividade = signal<any[]>([]);
  
  modalDreOpen = signal(false);
  dreIndividual = signal<DreIndividual | null>(null);
  projetoDreId = signal<number>(0);

  ngOnInit() {
    this.analiseSvc.getDashboardExecutivo().subscribe(d => this.dashboard.set(d));
    this.devSvc.getProdutividade().subscribe(p => this.produtividade.set(p));
  }

  getStatusBadge(status: string): { label: string; color: string } {
    const map: Record<string, { label: string; color: string }> = {
      RASCUNHO:     { label: 'Rascunho',     color: '#64748B'  },
      PLANEJADO:    { label: 'Planejado',    color: '#3B82F6'     },
      EM_ANDAMENTO: { label: 'Em Andamento', color: '#6366F1'   },
      ALERTA:       { label: '⚠️ Alerta',    color: '#F59E0B'  },
      ESTOURADO:    { label: '🔴 Estourado', color: '#EF4444'   },
      PAUSADO:      { label: 'Pausado',      color: '#64748B'  },
      CONCLUIDO:    { label: '✅ Concluído', color: '#10B981'     },
      CANCELADO:    { label: 'Cancelado',    color: '#EF4444'   },
    };
    return map[status] ?? { label: status, color: '#64748B' };
  }

  verDre(projetoId: number) {
    this.projetoDreId.set(projetoId);
    this.dreIndividual.set(null);
    this.modalDreOpen.set(true);
    this.analiseSvc.getDreIndividual(projetoId).subscribe({
      next: (dre) => this.dreIndividual.set(dre),
      error: () => {
        this.toast.error('Erro ao carregar DRE');
        this.modalDreOpen.set(false);
      }
    });
  }

  fecharModal() {
    this.modalDreOpen.set(false);
    this.dreIndividual.set(null);
  }

  exportarPdf(projetoId: number) {
    this.projSvc.getCloseoutPdf(projetoId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dre-projeto-${projetoId}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.toast.error('Erro ao gerar PDF')
    });
  }
}
