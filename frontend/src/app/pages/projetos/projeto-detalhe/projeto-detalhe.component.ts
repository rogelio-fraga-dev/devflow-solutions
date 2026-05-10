import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjetoService } from '../../../core/services/projeto.service';
import { SprintService } from '../../../core/services/sprint.service';
import { ChangeRequestService } from '../../../core/services/change-request.service';
import { Projeto } from '../../../core/models/projeto.model';
import { Sprint } from '../../../core/models/sprint.model';
import { ChangeRequest } from '../../../core/models/change-request.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-projeto-detalhe',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      @if (projeto()) {
        <!-- Header -->
        <div class="page-header">
          <div>
            <button class="btn btn-ghost" style="margin-bottom:12px;font-size:12px" (click)="router.navigate(['/app/projetos'])">
              ← Voltar
            </button>
            <h1 class="page-title">{{ projeto()!.nome }}</h1>
            <p class="page-subtitle">{{ projeto()!.stackTecnologica }}</p>
          </div>
          <div style="display:flex;gap:8px;align-items:flex-start">
            <span class="chip purple">{{ projeto()!.status }}</span>
            <button class="btn btn-ghost" style="font-size:12px" (click)="downloadPdf()">
              📄 Relatório PDF
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid-4" style="margin-bottom:20px">
          <div class="stat-card">
            <div class="stat-label">Orçamento Total</div>
            <div class="stat-value">{{ projeto()!.budgetTotal | currency:'BRL':'symbol':'1.0-0' }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Custo Acumulado</div>
            <div class="stat-value" [style.color]="pct() >= 80 ? '#EF4444' : 'inherit'">
              {{ projeto()!.custoAtualAcumulado | currency:'BRL':'symbol':'1.0-0' }}
            </div>
            <div class="stat-sub">{{ pct() }}% do orçamento</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Sprints</div>
            <div class="stat-value">{{ sprints().length }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Change Requests</div>
            <div class="stat-value">{{ changeRequests().length }}</div>
          </div>
        </div>

        <!-- Budget bar -->
        <div class="card" style="margin-bottom:20px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="font-weight:600;font-size:13px">Consumo do Orçamento</span>
            <span style="font-weight:700;font-size:13px;color:{{ pct() >= 80 ? '#EF4444' : 'var(--purple)' }}">{{ pct() }}%</span>
          </div>
          <div class="progress-bar" style="height:10px">
            <div class="progress-fill {{ pct() >= 100 ? 'danger' : pct() >= 80 ? 'warn' : '' }}"
                 [style.width]="pct() + '%'"></div>
          </div>
        </div>

        <!-- Sprints -->
        <div class="card" style="margin-bottom:20px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
            <h3>Sprints</h3>
            <button class="btn btn-ghost" style="font-size:12px" (click)="router.navigate(['/app/sprints'])">Ver todas</button>
          </div>
          @if (sprints().length === 0) {
            <div class="empty-state" style="padding:24px"><p>Nenhuma sprint cadastrada</p></div>
          }
          <div style="display:flex;flex-direction:column;gap:8px">
            @for (s of sprints(); track s.id) {
              <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:var(--bg-page);border-radius:8px">
                <div>
                  <span style="font-weight:600;font-size:13px">{{ s.nomeFase }}</span>
                  <span style="font-size:11px;color:var(--text-muted);margin-left:8px">{{ s.dataInicio | date:'dd/MM' }} – {{ s.dataFim | date:'dd/MM/yy' }}</span>
                </div>
                <span class="chip {{ sprintClass(s.status) }}">{{ s.status }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Change Requests -->
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
            <h3>Change Requests</h3>
            <button class="btn btn-ghost" style="font-size:12px" (click)="router.navigate(['/app/change-requests'])">Ver todas</button>
          </div>
          @if (changeRequests().length === 0) {
            <div class="empty-state" style="padding:24px"><p>Nenhum change request</p></div>
          }
          @for (cr of changeRequests(); track cr.id) {
            <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:var(--bg-page);border-radius:8px;margin-bottom:8px">
              <div>
                <div style="font-weight:600;font-size:13px">{{ cr.descricaoMudanca }}</div>
                @if (cr.dataAprovacao) {
                  <div style="font-size:11px;color:var(--text-muted)">Aprovado em {{ cr.dataAprovacao | date:'dd/MM/yy' }}</div>
                }
              </div>
              <span style="font-weight:700;color:var(--purple);font-size:13px">+ {{ cr.valorAdicional | currency:'BRL':'symbol':'1.2-2' }}</span>
            </div>
          }
        </div>
      } @else {
        <div class="empty-state"><p>Carregando...</p></div>
      }
    </div>
  `
})
export class ProjetoDetalheComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private svc    = inject(ProjetoService);
  private sprintSvc = inject(SprintService);
  private crSvc  = inject(ChangeRequestService);
  private toast  = inject(ToastService);
  router = inject(Router);

  projeto        = signal<Projeto | null>(null);
  sprints        = signal<Sprint[]>([]);
  changeRequests = signal<ChangeRequest[]>([]);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.getById(id).subscribe(p => {
      this.projeto.set(p);
      this.sprintSvc.getByProjeto(p.id).subscribe(s => this.sprints.set(s));
      this.crSvc.getByProjeto(p.id).subscribe(cr => this.changeRequests.set(cr));
    });
  }

  pct() {
    const p = this.projeto();
    if (!p || !p.budgetTotal) return 0;
    return Math.min(Math.round((p.custoAtualAcumulado / p.budgetTotal) * 100), 100);
  }

  sprintClass(s: string) {
    const map: Record<string, string> = { PLANEJADA: 'info', EM_ANDAMENTO: 'purple', CONCLUIDA: 'success', CANCELADA: 'error' };
    return map[s] || 'gray';
  }

  downloadPdf() {
    const p = this.projeto();
    if (!p) return;
    this.svc.getCloseoutPdf(p.id).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `closeout-${p.id}.pdf`; a.click();
      URL.revokeObjectURL(url);
    });
  }
}
