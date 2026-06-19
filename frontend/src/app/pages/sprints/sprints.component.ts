import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SprintService } from '../../core/services/sprint.service';
import { ProjetoService } from '../../core/services/projeto.service';
import { ToastService } from '../../core/services/toast.service';
import { Sprint, SprintRequest, FaseSprint, StatusSprint } from '../../core/models/sprint.model';
import { Projeto } from '../../core/models/projeto.model';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { extractErrorMessage } from '../../core/utils/error.util';

@Component({
  selector: 'app-sprints',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  template: `
    <div class="page">
      <div class="page-header" style="align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 24px; margin-bottom: 32px;">
        <div style="display: flex; gap: 20px; align-items: center;">
          <div style="width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, var(--purple), #7C3AED); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 24px rgba(79,70,229,0.4);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <div>
            <h1 class="page-title" style="margin:0;font-size:32px;letter-spacing:-1px;">Sprints</h1>
            <p class="page-subtitle" style="font-size:15px;margin:0">Gerenciamento de ciclos de desenvolvimento</p>
          </div>
        </div>
        <div style="display:flex;gap:12px;">
          <button class="btn btn-primary" style="padding:10px 20px" (click)="openDrawer(null)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nova Sprint
          </button>
        </div>
      </div>

      <!-- Stats Cockpit -->
      <div class="grid-3" style="margin-bottom:24px">
        <div class="card card-premium" style="margin:0; display:flex; flex-direction:column; justify-content:space-between; min-height:110px;">
          <div>
            <div class="stat-label" style="font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted)">Total de Sprints</div>
            <div class="stat-value" style="font-size:32px;font-weight:800;color:#fff;margin-top:8px">{{ filtered().length }}</div>
          </div>
        </div>
        <div class="card card-premium" style="margin:0; display:flex; flex-direction:column; justify-content:space-between; min-height:110px; position:relative; overflow:hidden;">
          <div style="position:absolute;top:0;right:0;width:80px;height:80px;background:radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%);pointer-events:none;"></div>
          <div>
            <div class="stat-label" style="font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted)">Em Andamento</div>
            <div class="stat-value" style="font-size:32px;font-weight:800;color:var(--purple-light);margin-top:8px">{{ emAndamentoCount() }}</div>
          </div>
        </div>
        <div class="card card-premium" style="margin:0; display:flex; flex-direction:column; justify-content:space-between; min-height:110px;">
          <div>
            <div class="stat-label" style="font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted)">Horas Estimadas</div>
            <div class="stat-value" style="font-size:32px;font-weight:800;color:#10B981;margin-top:8px">{{ totalHoras() }}h</div>
          </div>
        </div>
      </div>

      <!-- Filters in Premium Glass Card -->
      <div class="card card-premium" style="margin-bottom:24px; padding: 16px 20px; display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
        <div style="display:flex; align-items:center; gap:8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--purple-light)"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <span style="font-size:13px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">Filtrar Sprints:</span>
        </div>
        <select class="select" style="max-width:240px; background:rgba(255,255,255,0.05); border:1px solid var(--border); color:#fff;" [(ngModel)]="filterProjeto" (ngModelChange)="loadSprints()">
          <option value="">Todos os projetos</option>
          @for (p of projetos(); track p.id) { <option [value]="p.id">{{ p.nome }}</option> }
        </select>
        <select class="select" style="max-width:240px; background:rgba(255,255,255,0.05); border:1px solid var(--border); color:#fff;" [(ngModel)]="filterStatus">
          <option value="">Todos os status</option>
          @for (s of statusList; track s) { <option [value]="s">{{ s }}</option> }
        </select>
      </div>

      <!-- Table in Premium Glass Card -->
      <div class="card card-premium" style="padding:0; overflow:hidden;">
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;"></th>
                <th>Fase</th>
                <th>Projeto</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Status</th>
                <th style="text-align:right">Ações</th>
              </tr>
            </thead>
            <tbody>
              @for (s of paginated(); track s.id) {
                <tr style="cursor: pointer;" (click)="toggleSprintDetail(s.id)">
                  <td style="width: 40px; text-align: center; vertical-align: middle;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                         [style.transform]="expandedSprintId() === s.id ? 'rotate(180deg)' : 'none'" style="transition: transform 0.2s; color: var(--purple-light);">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </td>
                  <td style="font-weight:600">{{ s.nomeFase }}</td>
                  <td style="color:var(--text-secondary)">{{ projetoNome(s.projetoId) }}</td>
                  <td>{{ s.dataInicio | date:'dd/MM/yy' }}</td>
                  <td>{{ s.dataFim | date:'dd/MM/yy' }}</td>
                  <td>
                    <span class="chip-premium {{ getPremiumChipClass(s.status) }}">
                      <span class="dot-ping"></span>
                      {{ s.status }}
                    </span>
                  </td>
                  <td>
                    <div style="display:flex;gap:6px;justify-content:flex-end" (click)="$event.stopPropagation()">
                      <button class="btn btn-ghost" style="padding:6px 10px" (click)="openDrawer(s)">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button class="btn btn-ghost" style="padding:6px 10px;color:#EF4444" (click)="confirmDel = s">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                @if (expandedSprintId() === s.id) {
                  <tr style="background: rgba(139, 92, 246, 0.03);">
                    <td colspan="7" style="padding: 16px 24px; border-bottom: 1px solid rgba(139, 92, 246, 0.15);">
                      <div style="display: flex; flex-direction: column; gap: 12px; border-left: 3px solid var(--purple); padding-left: 16px;">
                        <div>
                          <strong style="color: #fff; font-size: 13px;">Objetivo da Sprint:</strong>
                          <div style="color: var(--text-secondary); margin-top: 4px; font-size: 13px; line-height: 1.5;">{{ s.objetivo || 'Nenhum objetivo específico definido para este ciclo.' }}</div>
                        </div>
                        <div style="display: flex; gap: 40px; flex-wrap: wrap; margin-top: 4px;">
                          <div>
                            <strong style="color: #fff; font-size: 13px;">Horas Estimadas:</strong>
                            <span class="chip-premium purple" style="margin-left: 8px; border: 1px solid rgba(139, 92, 246, 0.25);">
                              <span class="dot-ping"></span>
                              {{ s.horasEstimadas ? s.horasEstimadas + ' horas' : 'Sem esforço estimado' }}
                            </span>
                          </div>
                          @if (s.observacoes) {
                            <div>
                              <strong style="color: #fff; font-size: 13px;">Observações do Ciclo:</strong>
                              <span style="color: var(--text-muted); margin-left: 8px; font-size: 13px;">{{ s.observacoes }}</span>
                            </div>
                          }
                        </div>
                      </div>
                    </td>
                  </tr>
                }
              }
              @empty {
                <tr><td colspan="7"><div class="empty-state"><p>Nenhuma sprint encontrada</p></div></td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination Controls -->
      @if (totalPages() > 1) {
        <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 16px;">
          <button class="btn btn-ghost" style="padding: 6px 12px; font-size: 13px;" 
                  [disabled]="currentPage() === 1" (click)="prevPage()">Anterior</button>
          <span style="font-size: 13px; color: var(--text-muted)">Página {{ currentPage() }} de {{ totalPages() }}</span>
          <button class="btn btn-ghost" style="padding: 6px 12px; font-size: 13px;" 
                  [disabled]="currentPage() === totalPages()" (click)="nextPage()">Próximo</button>
        </div>
      }
    </div>

    <!-- Centered Premium Modal -->
    @if (drawerOpen()) {
      <div class="modal-overlay" (click)="drawerOpen.set(false)">
        <div class="modal modal-content" (click)="$event.stopPropagation()" style="border: 1px solid rgba(139, 92, 246, 0.35); width: 700px; max-width: 95vw; max-height: 90vh; overflow-y: auto;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 12px;">
            <h3 style="font-size: 18px; margin: 0; font-family: var(--font_display);">{{ editingId() ? 'Editar Sprint' : 'Nova Sprint' }}</h3>
            <button class="btn btn-ghost" style="padding: 6px; border: none; font-size: 16px;" (click)="drawerOpen.set(false)">✕</button>
          </div>
          
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom: 24px;">
            <div class="form-group" style="grid-column: 1 / -1;">
              <label class="label">Projeto *</label>
              <select class="select" [(ngModel)]="form.projetoId">
                <option [ngValue]="0">Selecione...</option>
                @for (p of projetos(); track p.id) { <option [ngValue]="p.id">{{ p.nome }}</option> }
              </select>
            </div>
            
            <div class="form-group">
              <label class="label">Fase *</label>
              <select class="select" [(ngModel)]="form.nomeFase">
                @for (f of faseList; track f) { <option [value]="f">{{ f }}</option> }
              </select>
            </div>
            
            <div class="form-group">
              <label class="label">Status</label>
              <select class="select" [(ngModel)]="form.status">
                @for (s of statusList; track s) { <option [value]="s">{{ s }}</option> }
              </select>
            </div>
            
            <div class="form-group" style="grid-column: 1 / -1;">
              <label class="label">Objetivo da Sprint</label>
              <input class="input" placeholder="Ex: Entregar dashboard principal" [(ngModel)]="form.objetivo" />
            </div>
            
            <div class="form-group">
              <label class="label">Horas Estimadas</label>
              <input class="input" type="number" placeholder="Ex: 120" [(ngModel)]="form.horasEstimadas" />
            </div>
            <div class="form-group">
              <label class="label">Observações</label>
              <input class="input" placeholder="Notas adicionais" [(ngModel)]="form.observacoes" />
            </div>
            
            <div class="form-group">
              <label class="label">Data de Início</label>
              <input class="input" type="date" [(ngModel)]="form.dataInicio" />
            </div>
            <div class="form-group">
              <label class="label">Data de Fim</label>
              <input class="input" type="date" [(ngModel)]="form.dataFim" />
            </div>
          </div>
          
          <div style="display:flex; gap:12px; justify-content:flex-end;">
            <button class="btn btn-ghost" style="padding: 10px 20px;" (click)="drawerOpen.set(false)">Cancelar</button>
            <button class="btn btn-primary" style="padding: 10px 24px;" [disabled]="saving()" (click)="save()">
              {{ saving() ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </div>
      </div>
    }

    <app-confirm-modal
      [open]="!!confirmDel"
      title="Remover Sprint"
      message="Tem certeza que deseja remover esta sprint?"
      confirmLabel="Remover"
      (confirm)="deleteSprint()"
      (cancel)="confirmDel = null"
    />
  `
})
export class SprintsComponent implements OnInit {
  private svc       = inject(SprintService);
  private projetoSvc= inject(ProjetoService);
  private toast     = inject(ToastService);

  sprints    = signal<Sprint[]>([]);
  projetos   = signal<Projeto[]>([]);
  saving     = signal(false);
  drawerOpen = signal(false);
  editingId  = signal<number|null>(null);
  confirmDel: Sprint | null = null;

  filterProjeto = '';
  filterStatus  = '';

  currentPage = signal(1);
  pageSize = 10;

  expandedSprintId = signal<number | null>(null);

  toggleSprintDetail(id: number) {
    if (this.expandedSprintId() === id) {
      this.expandedSprintId.set(null);
    } else {
      this.expandedSprintId.set(id);
    }
  }

  faseList:   FaseSprint[]   = ['BACKLOG','PLANEJAMENTO','DESENVOLVIMENTO','TESTES','HOMOLOGACAO','ENCERRAMENTO'];
  statusList: StatusSprint[] = ['PLANEJADA','EM_ANDAMENTO','CONCLUIDA','CANCELADA'];

  form: SprintRequest = this.emptyForm();

  ngOnInit() {
    this.projetoSvc.getAll().subscribe(p => { this.projetos.set(p); this.loadSprints(); });
  }

  loadSprints() {
    if (this.filterProjeto) {
      this.svc.getByProjeto(Number(this.filterProjeto)).subscribe(s => this.sprints.set(s));
    } else {
      const reqs = this.projetos().map(p =>
        firstValueFrom(this.svc.getByProjeto(p.id).pipe(catchError(() => of([] as Sprint[])))));
      Promise.all(reqs)
        .then(results => this.sprints.set((results.flat() as Sprint[]).filter(Boolean)))
        .catch(() => this.toast.error('Não foi possível carregar as sprints.'));
    }
  }

  filtered() {
    return this.sprints().filter(s => !this.filterStatus || s.status === this.filterStatus);
  }

  paginated() {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.max(1, Math.ceil(this.filtered().length / this.pageSize));
  }

  nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(v => v + 1); }
  prevPage() { if (this.currentPage() > 1) this.currentPage.update(v => v - 1); }

  projetoNome(id: number) { return this.projetos().find(p => p.id === id)?.nome || '—'; }

  totalHoras() {
    return this.filtered().reduce((s, x) => s + (x.horasEstimadas || 0), 0);
  }

  emAndamentoCount() {
    return this.filtered().filter(x => x.status === 'EM_ANDAMENTO').length;
  }

  getPremiumChipClass(status: string | undefined): string {
    if (!status) return 'info';
    const map: Record<string, string> = {
      PLANEJADA:    'info',
      EM_ANDAMENTO: 'purple',
      CONCLUIDA:    'success',
      CANCELADA:    'error'
    };
    return map[status] || 'gray';
  }

  openDrawer(s: Sprint | null) {
    this.editingId.set(s?.id ?? null);
    this.form = s ? { 
      nomeFase: s.nomeFase, status: s.status, dataInicio: s.dataInicio, dataFim: s.dataFim, projetoId: s.projetoId,
      objetivo: s.objetivo, observacoes: s.observacoes, horasEstimadas: s.horasEstimadas 
    } : this.emptyForm();
    this.drawerOpen.set(true);
  }

  save() {
    if (!this.form.projetoId) { this.toast.error('Selecione um projeto.'); return; }
    this.saving.set(true);
    const id = this.editingId();
    const obs = id ? this.svc.update(id, this.form) : this.svc.create(this.form);
    obs.subscribe({
      next: (s) => {
        if (id) this.sprints.update(list => list.map(x => x.id === id ? s : x));
        else this.sprints.update(list => [...list, s]);
        this.drawerOpen.set(false); this.saving.set(false);
        this.toast.success(id ? 'Sprint atualizada!' : 'Sprint criada!');
      },
      error: (err) => { this.saving.set(false); this.toast.error(extractErrorMessage(err)); }
    });
  }

  deleteSprint() {
    if (!this.confirmDel) return;
    const id = this.confirmDel.id;
    this.svc.delete(id).subscribe({
      next: () => { this.sprints.update(l => l.filter(s => s.id !== id)); this.toast.success('Sprint removida.'); },
      error: (err) => this.toast.error(extractErrorMessage(err))
    });
    this.confirmDel = null;
  }

  emptyForm(): SprintRequest {
    return { nomeFase: 'BACKLOG', status: 'PLANEJADA', dataInicio: '', dataFim: '', projetoId: 0 };
  }
}
