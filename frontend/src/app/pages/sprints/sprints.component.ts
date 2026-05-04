import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
      <div class="page-header">
        <div>
          <h1 class="page-title">Sprints</h1>
          <p class="page-subtitle">Gerenciamento de ciclos de desenvolvimento</p>
        </div>
        <button class="btn btn-primary" (click)="openDrawer(null)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nova Sprint
        </button>
      </div>

      <!-- Filters -->
      <div class="card" style="margin-bottom:20px">
        <div style="display:flex;gap:12px">
          <select class="select" [(ngModel)]="filterProjeto" (ngModelChange)="loadSprints()">
            <option value="">Todos os projetos</option>
            @for (p of projetos(); track p.id) { <option [value]="p.id">{{ p.nome }}</option> }
          </select>
          <select class="select" [(ngModel)]="filterStatus">
            <option value="">Todos os status</option>
            @for (s of statusList; track s) { <option [value]="s">{{ s }}</option> }
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Fase</th>
              <th>Projeto</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Status</th>
              <th style="text-align:right">Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (s of filtered(); track s.id) {
              <tr>
                <td style="font-weight:600">{{ s.nomeFase }}</td>
                <td style="color:var(--text-muted)">{{ projetoNome(s.projetoId) }}</td>
                <td>{{ s.dataInicio | date:'dd/MM/yy' }}</td>
                <td>{{ s.dataFim | date:'dd/MM/yy' }}</td>
                <td><span class="chip {{ sprintClass(s.status) }}">{{ s.status }}</span></td>
                <td>
                  <div style="display:flex;gap:6px;justify-content:flex-end">
                    <button class="btn btn-ghost" style="padding:6px 10px" (click)="openDrawer(s)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn btn-ghost" style="padding:6px 10px;color:#EF4444" (click)="confirmDel = s">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            }
            @empty {
              <tr><td colspan="6"><div class="empty-state"><p>Nenhuma sprint encontrada</p></div></td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    @if (drawerOpen()) {
      <div class="drawer-overlay" (click)="drawerOpen.set(false)"></div>
      <div class="drawer">
        <div class="drawer-header">
          <h3>{{ editingId() ? 'Editar Sprint' : 'Nova Sprint' }}</h3>
          <button class="btn btn-ghost" style="padding:6px" (click)="drawerOpen.set(false)">✕</button>
        </div>
        <div class="drawer-body">
          <div class="form-group">
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
          <div class="form-row">
            <div class="form-group">
              <label class="label">Data de Início</label>
              <input class="input" type="date" [(ngModel)]="form.dataInicio" />
            </div>
            <div class="form-group">
              <label class="label">Data de Fim</label>
              <input class="input" type="date" [(ngModel)]="form.dataFim" />
            </div>
          </div>
          <div style="display:flex;gap:10px;margin-top:8px">
            <button class="btn btn-ghost" style="flex:1" (click)="drawerOpen.set(false)">Cancelar</button>
            <button class="btn btn-primary" style="flex:1" [disabled]="saving()" (click)="save()">
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
      const reqs = this.projetos().map(p => this.svc.getByProjeto(p.id).toPromise());
      Promise.all(reqs).then(results => this.sprints.set((results.flat() as Sprint[]).filter(Boolean)));
    }
  }

  filtered() {
    return this.sprints().filter(s => !this.filterStatus || s.status === this.filterStatus);
  }

  projetoNome(id: number) { return this.projetos().find(p => p.id === id)?.nome || '—'; }

  sprintClass(s: string) {
    const map: Record<string, string> = { PLANEJADA: 'info', EM_ANDAMENTO: 'purple', CONCLUIDA: 'success', CANCELADA: 'error' };
    return map[s] || 'gray';
  }

  openDrawer(s: Sprint | null) {
    this.editingId.set(s?.id ?? null);
    this.form = s ? { nomeFase: s.nomeFase, status: s.status, dataInicio: s.dataInicio, dataFim: s.dataFim, projetoId: s.projetoId } : this.emptyForm();
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
