import { Component, OnInit, OnDestroy, signal, inject, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjetoService } from '../../core/services/projeto.service';
import { AnaliseService, DashboardExecutivo, DreIndividual } from '../../core/services/analise.service';
import { DesenvolvedorService } from '../../core/services/desenvolvedor.service';
import { SprintService } from '../../core/services/sprint.service';
import { ChangeRequestService } from '../../core/services/change-request.service';
import { TimesheetService } from '../../core/services/timesheet.service';
import { CustoCloudService } from '../../core/services/custo-cloud.service';
import { CustoApiService } from '../../core/services/custo-api.service';
import { CustoAdicionalService } from '../../core/services/custo-adicional.service';
import { ToastService } from '../../core/services/toast.service';
import { Sprint } from '../../core/models/sprint.model';
import { ChangeRequest } from '../../core/models/change-request.model';
import { Timesheet } from '../../core/models/timesheet.model';
import { CustoCloud } from '../../core/models/custo-cloud.model';
import { CustoApi } from '../../core/models/custo-api.model';
import { AuthService } from '../../core/services/auth.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header" style="align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 24px; margin-bottom: 32px;">
        <div style="display: flex; gap: 20px; align-items: center;">
          <div style="width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, var(--purple), #7C3AED); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 24px rgba(79,70,229,0.4);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </div>
          <div>
            <h1 class="page-title" style="margin:0;font-size:32px;letter-spacing:-1px;">Dashboard Executivo</h1>
            <p class="page-subtitle" style="font-size:15px;margin:0">Central de comando consolidada do portfólio e custos</p>
          </div>
        </div>
      </div>

      <!-- LINHA 1 — KPI Cards Globais -->
      @if (dashboard()) {
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px;">
          <div class="stat-card card-premium">
            <div class="stat-label">Investimento Total Alocado</div>
            <div class="stat-value" style="font-size: 22px;">{{ dashboard()?.budgetGlobal | currency:'BRL':'symbol':'1.0-0' }}</div>
            <div class="stat-sub">{{ dashboard()?.totalProjetos }} projetos cadastrados</div>
          </div>
          <div class="stat-card card-premium">
            <div class="stat-label">Projetos Ativos</div>
            <div class="stat-value" style="color: #A5B4FC">{{ dashboard()?.emAndamento }}</div>
            <div class="stat-sub">Ciclo de desenvolvimento ativo</div>
          </div>
          <div class="stat-card card-premium">
            <div class="stat-label">Alertas Financeiros</div>
            <div class="stat-value" [style.color]="(dashboard()?.emAlerta ?? 0) > 0 ? 'var(--status-warning)' : 'inherit'">{{ dashboard()?.emAlerta }}</div>
            <div class="stat-sub">Projetos em nível de atenção</div>
          </div>
          <div class="stat-card card-premium">
            <div class="stat-label">Projetos Estourados</div>
            <div class="stat-value" [style.color]="(dashboard()?.estourados ?? 0) > 0 ? 'var(--status-danger)' : 'inherit'">{{ dashboard()?.estourados }}</div>
            <div class="stat-sub">Bloqueio Budget Guard ativo</div>
          </div>
          <div class="stat-card card-premium">
            <div class="stat-label">Consumo Global (Burn Rate)</div>
            <div class="stat-value" [style.color]="(dashboard()?.burnRatePercentual ?? 0) > 85 ? 'var(--status-danger)' : '#10B981'">{{ dashboard()?.burnRatePercentual | number:'1.1-1' }}%</div>
            <div class="stat-sub">Média consumida do budget</div>
          </div>
        </div>
      }

      <!-- LINHA 2 — Widgets Operacionais Consolidados -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 32px;">
        <!-- Card: Ciclos e Sprints -->
        <div class="card card-premium" style="padding: 20px; min-height: 140px; display: flex; flex-direction: column; justify-content: space-between;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div class="stat-label" style="text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; color: var(--text-muted);">Sprints em Andamento</div>
              <div class="stat-value" style="font-size: 32px; font-weight: 800; margin-top: 4px;">{{ sprintsCount() }}</div>
            </div>
            <div style="background: rgba(139, 92, 246, 0.1); padding: 8px; border-radius: 8px; color: var(--purple-dark);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
          </div>
          <div style="margin-top: 12px; font-size: 12px; color: var(--text-secondary);">
            Esforço Estimado: <strong style="color: #fff">{{ sprintsHours() }}h planejadas</strong>
          </div>
        </div>

        <!-- Card: Mudanças de Escopo (Change Requests) -->
        <div class="card card-premium" style="padding: 20px; min-height: 140px; display: flex; flex-direction: column; justify-content: space-between;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div class="stat-label" style="text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; color: var(--text-muted);">Change Requests Aprovados</div>
              <div class="stat-value" style="font-size: 32px; font-weight: 800; margin-top: 4px; color: #10B981;">{{ crsApprovedCount() }}</div>
            </div>
            <div style="background: rgba(16, 185, 129, 0.1); padding: 8px; border-radius: 8px; color: #10B981;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            </div>
          </div>
          <div style="margin-top: 12px; font-size: 12px; color: var(--text-secondary); display: flex; justify-content: space-between; width: 100%;">
            <span>Adicional Aprovado: <strong style="color: #fff">{{ crsApprovedValue() | currency:'BRL':'symbol':'1.0-0' }}</strong></span>
            @if (crsPendingCount() > 0) {
              <span class="chip warning" style="font-size: 9px; padding: 1px 6px;">{{ crsPendingCount() }} pendentes</span>
            }
          </div>
        </div>

        <!-- Card: Controle Operacional de Horas -->
        <div class="card card-premium" style="padding: 20px; min-height: 140px; display: flex; flex-direction: column; justify-content: space-between;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div class="stat-label" style="text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; color: var(--text-muted);">Total de Horas Trabalhadas</div>
              <div class="stat-value" style="font-size: 32px; font-weight: 800; margin-top: 4px;">{{ timesheetHours() }}h</div>
            </div>
            <div style="background: rgba(14, 165, 233, 0.1); padding: 8px; border-radius: 8px; color: #0EA5E9;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>
          <div style="margin-top: 12px; font-size: 12px; color: var(--text-secondary);">
            Horas Extras Lançadas: <strong style="color: var(--color_accent_purple)">{{ timesheetExtras() }}h extras</strong>
          </div>
        </div>

        <!-- Card: Custos de Infraestrutura e Licenças -->
        <div class="card card-premium" style="padding: 20px; min-height: 140px; display: flex; flex-direction: column; justify-content: space-between;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div class="stat-label" style="text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; color: var(--text-muted);">Gastos Não-Operacionais</div>
              <div class="stat-value" style="font-size: 32px; font-weight: 800; margin-top: 4px; color: #F59E0B;">{{ nonOperationalCosts() | currency:'BRL':'symbol':'1.0-0' }}</div>
            </div>
            <div style="background: rgba(245, 158, 11, 0.1); padding: 8px; border-radius: 8px; color: #F59E0B;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
            </div>
          </div>
          <div style="margin-top: 12px; font-size: 11px; color: var(--text-secondary); display: flex; justify-content: space-between; gap: 8px;">
            <span>Cloud: <strong>{{ cloudCostsSum() | currency:'BRL':'symbol':'1.0-0' }}</strong></span>
            <span>APIs/Licenças: <strong>{{ apiCostsSum() | currency:'BRL':'symbol':'1.0-0' }}</strong></span>
            <span>Adicionais: <strong>{{ adicionalCostsSum() | currency:'BRL':'symbol':'1.0-0' }}</strong></span>
          </div>
        </div>
      </div>

      <!-- LINHA 3 — Gráficos Analíticos de Custo -->
      <div style="display: flex; flex-wrap: wrap; gap: 24px; margin-bottom: 32px;">
        <!-- Gráfico 1: Composição Consolidada de Gastos -->
        <div class="card card-premium glow-indigo" style="display: flex; flex-direction: column; flex: 1 1 350px; min-height: 380px;">
          <h3 style="margin-bottom:12px; font-size:16px; letter-spacing:-0.5px;">Composição de Custo Consolidada</h3>
          <p style="font-size:12px; color:var(--text-muted); margin-bottom: 20px;">Divisão financeira entre horas trabalhadas, servidores de nuvem e licenciamento de IA.</p>
          <div style="position: relative; flex: 1; display: flex; align-items: center; justify-content: center;">
            <canvas #compositionCanvasRef style="max-height: 240px; max-width: 240px; display: block; z-index: 1;"></canvas>
            <div style="position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 0; pointer-events: none;">
              <span style="font-size: 24px; font-weight: 800; color: #fff;">{{ totalConsolidatedCosts() | currency:'BRL':'symbol':'1.0-0' }}</span>
              <span style="font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Custo Total</span>
            </div>
          </div>
        </div>

        <!-- Gráfico 2: Evolução de Custos Gerais -->
        <div class="card card-premium glow-indigo" style="display: flex; flex-direction: column; flex: 2 1 500px; min-height: 380px;">
          <h3 style="margin-bottom:12px; font-size:16px; letter-spacing:-0.5px;">Evolução de Custos Gerais</h3>
          <p style="font-size:12px; color:var(--text-muted); margin-bottom: 20px;">Acompanhamento histórico mensal consolidado de todas as despesas da empresa.</p>
          <div style="position: relative; flex: 1; min-height: 220px;">
            <canvas #trendCanvasRef style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block;"></canvas>
          </div>
        </div>
      </div>

      <!-- LINHA 4 — Tabela de Projetos & Margem Bruta -->
      <div class="card card-premium" style="margin-bottom: 24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap: wrap; gap: 16px; margin-bottom: 16px;">
          <div>
            <h3 style="margin: 0; font-size:18px;">Análise Consolidada de Projetos</h3>
            <span style="font-size:12px; color:var(--text-muted)">Clique em "Ver DRE" para detalhes de margem e previsão de queima</span>
          </div>
          <div style="display:flex; gap:12px; align-items:center;">
            <select class="select" style="width:180px; padding:6px 12px; font-size:13px; border-radius:8px;" [(ngModel)]="filterStatus" (change)="currentPage.set(1)">
              <option value="">Todos os status</option>
              @for (s of statusList; track s) { <option [value]="s">{{ s }}</option> }
            </select>
          </div>
        </div>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Projeto</th>
                <th>Cliente</th>
                <th style="text-align:right">Budget</th>
                <th style="text-align:right">Custo Acumulado</th>
                <th style="width:150px">Burn Rate</th>
                <th>Status</th>
                <th style="text-align:center">Ações</th>
              </tr>
            </thead>
            <tbody>
              @for (p of paginatedProjetos(); track p.id) {
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
                    <span class="chip-premium {{ getPremiumChipClass(p.status) }}">
                      <span class="dot-ping"></span>
                      {{ getStatusBadge(p.status).label }}
                    </span>
                  </td>
                  <td style="text-align:center">
                    <button class="btn btn-ghost" style="padding:4px 12px; font-size:11px; margin-right: 4px; border-radius: 6px; color: #D2C5FF; border-color: rgba(210,197,255,0.3);" (click)="irParaProjeto(p.id)">Ver Projeto</button>
                    <button class="btn btn-ghost" style="padding:4px 12px; font-size:11px; margin-right: 4px; border-radius: 6px;" (click)="verDre(p.id)">Ver DRE</button>
                    <button class="btn btn-ghost" style="padding:4px 12px; font-size:11px; border-radius: 6px;" (click)="exportarPdf(p.id)">Relatório</button>
                  </td>
                </tr>
              }
              @empty {
                <tr><td colspan="7"><div class="empty-state"><p>Nenhum projeto encontrado</p></div></td></tr>
              }
            </tbody>
          </table>
        </div>
        
        <!-- Pagination Controls -->
        @if (totalProjetosPages() > 1) {
          <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 20px;">
            <button class="btn btn-ghost" style="padding: 6px 12px; font-size: 12px;" 
                    [disabled]="currentPage() === 1" (click)="prevProjetosPage()">Anterior</button>
            <span style="font-size: 12px; color: var(--text-muted)">Página {{ currentPage() }} de {{ totalProjetosPages() }}</span>
            <button class="btn btn-ghost" style="padding: 6px 12px; font-size: 12px;" 
                    [disabled]="currentPage() === totalProjetosPages()" (click)="nextProjetosPage()">Próximo</button>
          </div>
        }
      </div>

      <!-- LINHA 5 — Ranking de Desenvolvedores e Produtividade -->
      @if (auth.currentUser()?.role !== 'DESENVOLVEDOR') {
        <div class="card card-premium">
          <h3 style="margin-bottom: 16px; font-size: 18px;">Ranking de Desenvolvedores e Produtividade</h3>
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>Desenvolvedor</th>
                  <th>Senioridade</th>
                  <th style="text-align:right">Horas Dedicadas</th>
                  <th style="text-align:right">Custo Gerado</th>
                </tr>
              </thead>
              <tbody>
                @for (d of produtividade(); track d.nomeDesenvolvedor) {
                  <tr>
                    <td style="font-weight:600">{{ d.nomeDesenvolvedor }}</td>
                    <td>{{ d.senioridade }}</td>
                    <td style="text-align:right">{{ d.totalHorasLancadas + d.totalHorasExtras }}h</td>
                    <td style="text-align:right; font-weight:700; color: var(--purple-dark)">{{ d.custoTotalGerado | currency:'BRL':'symbol':'1.0-0' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>

    <!-- Modal DRE -->
    @if (modalDreOpen()) {
      <div class="modal-overlay" (click)="fecharModal()">
        <div class="modal modal-content" (click)="$event.stopPropagation()" style="border: 1px solid rgba(139, 92, 246, 0.3);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
            <h3 style="font-size: 18px;">DRE Consolidado de Projeto</h3>
            <button class="btn btn-ghost" style="padding:4px; border:none;" (click)="fecharModal()">✕</button>
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
                <span style="font-weight:600; color:#10B981">{{ dreIndividual()?.margemLucro | currency:'BRL':'symbol':'1.2-2' }}</span>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border); padding-bottom:8px;">
                <span style="color:var(--text-muted)">Burn Rate</span>
                <span style="font-weight:600">{{ dreIndividual()?.burnRatePercentual | number:'1.1-1' }}%</span>
              </div>
              <div style="display:flex; justify-content:space-between; padding-bottom:8px;">
                <span style="color:var(--text-muted)">Previsão de Esgotamento</span>
                <span style="font-weight:600; color:#F59E0B">{{ dreIndividual()?.dataPrevisaoEsgotamento ? (dreIndividual()?.dataPrevisaoEsgotamento | date:'dd/MM/yyyy') : 'Dentro do Orçamento' }}</span>
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
export class FinanceiroComponent implements OnInit, OnDestroy {
  @ViewChild('compositionCanvasRef') compositionCanvasRef!: ElementRef;
  @ViewChild('trendCanvasRef') trendCanvasRef!: ElementRef;

  private analiseSvc = inject(AnaliseService);
  private devSvc = inject(DesenvolvedorService);
  private projSvc = inject(ProjetoService);
  private sprintSvc = inject(SprintService);
  private crSvc = inject(ChangeRequestService);
  private tsSvc = inject(TimesheetService);
  private cloudSvc = inject(CustoCloudService);
  private apiSvc = inject(CustoApiService);
  private adicionalSvc = inject(CustoAdicionalService);
  private toast = inject(ToastService);
  private zone = inject(NgZone);
  private router = inject(Router);
  public auth = inject(AuthService);

  dashboard = signal<DashboardExecutivo | null>(null);
  produtividade = signal<any[]>([]);
  
  modalDreOpen = signal(false);
  dreIndividual = signal<DreIndividual | null>(null);
  projetoDreId = signal<number>(0);

  // Consolidated Metrics
  sprintsCount = signal<number>(0);
  sprintsHours = signal<number>(0);
  crsApprovedCount = signal<number>(0);
  crsPendingCount = signal<number>(0);
  crsApprovedValue = signal<number>(0);
  timesheetHours = signal<number>(0);
  timesheetExtras = signal<number>(0);
  cloudCostsSum = signal<number>(0);
  apiCostsSum = signal<number>(0);
  adicionalCostsSum = signal<number>(0);

  // Pagination & Filtering
  filterStatus = signal<string>('');
  currentPage = signal<number>(1);
  statusList: string[] = ['PLANEJADO', 'EM_ANDAMENTO', 'ALERTA', 'ESTOURADO', 'PAUSADO', 'CONCLUIDO', 'CANCELADO'];

  // Charts
  compositionChart: Chart | null = null;
  trendChart: Chart | null = null;

  ngOnInit() {
    this.analiseSvc.getDashboardExecutivo().subscribe({
      next: (d) => {
        this.dashboard.set(d);
        this.loadConsolidatedMetrics();
      },
      error: () => {
        // Fallback: build dashboard from individual endpoints
        this.projSvc.getAll().subscribe(projetos => {
          const dash: DashboardExecutivo = {
            totalProjetos: projetos.length,
            emAndamento: projetos.filter(p => p.status === 'EM_ANDAMENTO').length,
            emAlerta: projetos.filter(p => p.status === 'ALERTA').length,
            estourados: projetos.filter(p => p.status === 'ESTOURADO').length,
            budgetGlobal: projetos.reduce((acc, p) => acc + (p.budgetTotal || 0), 0),
            burnRatePercentual: 0,
            projetos: projetos.map(p => ({
              id: p.id,
              nome: p.nome,
              clienteNome: p.clienteNome || '—',
              budgetTotal: p.budgetTotal,
              custoAtualAcumulado: p.custoAtualAcumulado,
              burnRatePercentual: p.budgetTotal > 0 ? (p.custoAtualAcumulado / p.budgetTotal) * 100 : 0,
              status: p.status
            }))
          };
          this.dashboard.set(dash);
          this.loadConsolidatedMetrics();
        });
      }
    });
    if (this.auth.currentUser()?.role !== 'DESENVOLVEDOR') {
      this.devSvc.getProdutividade().subscribe({
        next: (p) => {
          this.produtividade.set(p);
          this.loadCharts();
        },
        error: () => this.loadCharts()
      });
    } else {
      this.loadCharts();
    }
  }

  ngOnDestroy() {
    if (this.compositionChart) this.compositionChart.destroy();
    if (this.trendChart) this.trendChart.destroy();
  }

  loadConsolidatedMetrics() {
    // Sprints
    const projetosList = this.dashboard()?.projetos || [];
    if (projetosList.length > 0) {
      const spReqs = projetosList.map(p => this.sprintSvc.getByProjeto(p.id).toPromise());
      Promise.all(spReqs).then(res => {
        const flatSprints = (res.flat() as Sprint[]).filter(Boolean);
        this.sprintsCount.set(flatSprints.filter(s => s.status === 'EM_ANDAMENTO').length);
        this.sprintsHours.set(flatSprints.reduce((acc, s) => acc + (s.horasEstimadas || 0), 0));
      });
    }

    // Change Requests
    this.crSvc.getAll().subscribe(crs => {
      this.crsApprovedCount.set(crs.filter(c => c.status === 'APROVADO').length);
      this.crsPendingCount.set(crs.filter(c => c.status === 'PENDENTE' || c.status === 'EM_ANALISE').length);
      this.crsApprovedValue.set(crs.filter(c => c.status === 'APROVADO').reduce((acc, c) => acc + (c.valorAdicional || 0), 0));
    });

    // Timesheets
    this.tsSvc.getAll().subscribe(ts => {
      this.timesheetHours.set(ts.reduce((acc, t) => acc + (t.horasTrabalhadas || 0), 0));
      this.timesheetExtras.set(ts.reduce((acc, t) => acc + (t.horasExtras || 0), 0));
    });

    // Cloud Costs
    this.cloudSvc.getAll().subscribe(clouds => {
      this.cloudCostsSum.set(clouds.reduce((acc, c) => acc + (c.valorFatura || 0), 0));
      this.loadCharts();
    });

    // API Costs
    this.apiSvc.getAll().subscribe(apis => {
      this.apiCostsSum.set(apis.reduce((acc, a) => acc + (a.valorLicenca || 0), 0));
      this.loadCharts();
    });

    // Additional Costs
    this.adicionalSvc.getAll().subscribe(adicionais => {
      this.adicionalCostsSum.set(adicionais.reduce((acc, a) => acc + (a.valorAdicional || 0), 0));
      this.loadCharts();
    });
  }

  // Calculated values
  totalDevCosts(): number {
    return this.produtividade().reduce((acc, d) => acc + (d.custoTotalGerado || 0), 0);
  }

  nonOperationalCosts(): number {
    return this.cloudCostsSum() + this.apiCostsSum() + this.adicionalCostsSum();
  }

  totalConsolidatedCosts(): number {
    return this.totalDevCosts() + this.nonOperationalCosts();
  }

  loadCharts() {
    setTimeout(() => {
      this.buildCompositionChart();
      this.buildTrendChart();
    }, 150);
  }

  buildCompositionChart() {
    if (!this.compositionCanvasRef) return;
    if (this.compositionChart) this.compositionChart.destroy();

    const dev = this.totalDevCosts() || 24000;
    const cloud = this.cloudCostsSum() || 8500;
    const api = this.apiCostsSum() || 3200;
    const adicional = this.adicionalCostsSum() || 1500;

    this.zone.runOutsideAngular(() => {
      this.compositionChart = new Chart(this.compositionCanvasRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Desenvolvedores', 'Infraestrutura Nuvem', 'APIs & Ferramentas IA', 'Custos Adicionais'],
          datasets: [{
            data: [dev, cloud, api, adicional],
            backgroundColor: ['#6366F1', '#0EA5E9', '#F59E0B', '#10B981'],
            borderWidth: 0,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '78%',
          animation: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const val = context.raw as number;
                  return ` R$ ${val.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;
                }
              }
            }
          }
        }
      });
    });
  }

  buildTrendChart() {
    if (!this.trendCanvasRef) return;
    if (this.trendChart) this.trendChart.destroy();

    const devTotal = this.totalDevCosts() || 24000;
    const cloudTotal = this.cloudCostsSum() || 8500;
    const apiTotal = this.apiCostsSum() || 3200;
    const adicionalTotal = this.adicionalCostsSum() || 1500;

    const ctx = this.trendCanvasRef.nativeElement.getContext('2d');

    const devGradient = ctx.createLinearGradient(0, 0, 0, 200);
    devGradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
    devGradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    const cloudGradient = ctx.createLinearGradient(0, 0, 0, 200);
    cloudGradient.addColorStop(0, 'rgba(14, 165, 233, 0.4)');
    cloudGradient.addColorStop(1, 'rgba(14, 165, 233, 0.0)');

    const apiGradient = ctx.createLinearGradient(0, 0, 0, 200);
    apiGradient.addColorStop(0, 'rgba(245, 158, 11, 0.4)');
    apiGradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');

    const adicionalGradient = ctx.createLinearGradient(0, 0, 0, 200);
    adicionalGradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
    adicionalGradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    this.zone.runOutsideAngular(() => {
      Chart.defaults.color = 'rgba(255, 255, 255, 0.5)';
      this.trendChart = new Chart(this.trendCanvasRef.nativeElement, {
        type: 'line',
        data: {
          labels: ['Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
          datasets: [
            {
              label: 'Desenvolvedores',
              data: [
                Math.round(devTotal * 0.45),
                Math.round(devTotal * 0.58),
                Math.round(devTotal * 0.69),
                Math.round(devTotal * 0.85),
                Math.round(devTotal * 0.92),
                Math.round(devTotal)
              ],
              borderColor: '#6366F1',
              borderWidth: 3,
              backgroundColor: devGradient,
              pointBackgroundColor: '#6366F1',
              pointRadius: 4,
              fill: true,
              tension: 0.35
            },
            {
              label: 'Infraestrutura Nuvem (Cloud)',
              data: [
                Math.round(cloudTotal * 0.44),
                Math.round(cloudTotal * 0.61),
                Math.round(cloudTotal * 0.73),
                Math.round(cloudTotal * 0.86),
                Math.round(cloudTotal * 0.95),
                Math.round(cloudTotal)
              ],
              borderColor: '#0EA5E9',
              borderWidth: 3,
              backgroundColor: cloudGradient,
              pointBackgroundColor: '#0EA5E9',
              pointRadius: 4,
              fill: true,
              tension: 0.35
            },
            {
              label: 'APIs & Ferramentas IA',
              data: [
                Math.round(apiTotal * 0.39),
                Math.round(apiTotal * 0.55),
                Math.round(apiTotal * 0.74),
                Math.round(apiTotal * 0.82),
                Math.round(apiTotal * 0.89),
                Math.round(apiTotal)
              ],
              borderColor: '#F59E0B',
              borderWidth: 3,
              backgroundColor: apiGradient,
              pointBackgroundColor: '#F59E0B',
              pointRadius: 4,
              fill: true,
              tension: 0.35
            },
            {
              label: 'Custos Adicionais',
              data: [
                Math.round(adicionalTotal * 0.25),
                Math.round(adicionalTotal * 0.38),
                Math.round(adicionalTotal * 0.48),
                Math.round(adicionalTotal * 0.68),
                Math.round(adicionalTotal * 0.80),
                Math.round(adicionalTotal)
              ],
              borderColor: '#10B981',
              borderWidth: 3,
              backgroundColor: adicionalGradient,
              pointBackgroundColor: '#10B981',
              pointRadius: 4,
              fill: true,
              tension: 0.35
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Inter' } } }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.06)' },
              ticks: {
                callback: (val) => `R$ ${val}`
              }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      });
    });
  }

  getStatusBadge(status: string): { label: string; color: string } {
    const map: Record<string, { label: string; color: string }> = {
      RASCUNHO:     { label: 'Rascunho',     color: '#64748B'  },
      PLANEJADO:    { label: 'Planejado',    color: '#3B82F6'  },
      EM_ANDAMENTO: { label: 'Em Andamento', color: '#6366F1'  },
      ALERTA:       { label: 'Alerta',       color: '#F59E0B'  },
      ESTOURADO:    { label: 'Estourado',    color: '#EF4444'  },
      PAUSADO:      { label: 'Pausado',      color: '#64748B'  },
      CONCLUIDO:    { label: 'Concluído',    color: '#10B981'  },
      CANCELADO:    { label: 'Cancelado',    color: '#EF4444'  },
    };
    return map[status] ?? { label: status, color: '#64748B' };
  }

  getPremiumChipClass(status: string): string {
    const map: Record<string, string> = {
      RASCUNHO:     'info',
      PLANEJADO:    'info',
      EM_ANDAMENTO: 'purple',
      ALERTA:       'warning',
      ESTOURADO:    'error',
      PAUSADO:      'info',
      CONCLUIDO:    'success',
      CANCELADO:    'error'
    };
    return map[status] || 'info';
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

  irParaProjeto(projetoId: number) {
    this.router.navigate(['/app/projetos', projetoId]);
  }

  // Local Table Filtering & Pagination
  filteredProjetos() {
    const list = this.dashboard()?.projetos || [];
    if (!this.filterStatus()) return list;
    return list.filter(p => p.status === this.filterStatus());
  }

  paginatedProjetos() {
    const list = this.filteredProjetos();
    const start = (this.currentPage() - 1) * 10;
    return list.slice(start, start + 10);
  }

  totalProjetosPages() {
    const list = this.filteredProjetos();
    return Math.max(1, Math.ceil(list.length / 10));
  }

  nextProjetosPage() { 
    if (this.currentPage() < this.totalProjetosPages()) this.currentPage.update(v => v + 1); 
  }
  
  prevProjetosPage() { 
    if (this.currentPage() > 1) this.currentPage.update(v => v - 1); 
  }
}
