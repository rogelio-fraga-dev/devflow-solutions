import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimesheetService } from '../../core/services/timesheet.service';
import { DesenvolvedorService } from '../../core/services/desenvolvedor.service';
import { ProjetoService } from '../../core/services/projeto.service';
import { SprintService } from '../../core/services/sprint.service';
import { ToastService } from '../../core/services/toast.service';
import { Timesheet, TimesheetRequest } from '../../core/models/timesheet.model';
import { Desenvolvedor } from '../../core/models/desenvolvedor.model';
import { Projeto } from '../../core/models/projeto.model';
import { Sprint } from '../../core/models/sprint.model';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Timesheet</h1>
          <p class="page-subtitle">Registro de horas trabalhadas</p>
        </div>
        <button class="btn btn-primary" (click)="openDrawer(null)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Registrar Horas
        </button>
      </div>

      <!-- Filters -->
      <div class="card" style="margin-bottom:20px">
        <div style="display:flex;gap:12px">
          <select class="select" [(ngModel)]="filterDev" (ngModelChange)="loadTimesheets()">
            <option value="">Todos os devs</option>
            @for (d of devs(); track d.id) { <option [value]="d.id">{{ d.nome }}</option> }
          </select>
          <select class="select" [(ngModel)]="filterSprint" (ngModelChange)="loadTimesheets()">
            <option value="">Todas as sprints</option>
            @for (s of sprints(); track s.id) { <option [value]="s.id">{{ projetoNome(s.projetoId) }} – {{ s.nomeFase }}</option> }
          </select>
        </div>
      </div>

      <!-- Summary -->
      <div class="grid-3" style="margin-bottom:20px">
        <div class="stat-card">
          <div class="stat-label">Horas Normais</div>
          <div class="stat-value">{{ totalHoras() }}h</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Horas Extras</div>
          <div class="stat-value" style="color:var(--purple)">{{ totalExtras() }}h</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total de Registros</div>
          <div class="stat-value">{{ timesheets().length }}</div>
        </div>
      </div>

      <!-- Table -->
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Desenvolvedor</th>
              <th>Sprint</th>
              <th>Data</th>
              <th>Horas Trabalhadas</th>
              <th>Horas Extras</th>
              <th>Tarefa</th>
              <th style="text-align:right">Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (t of timesheets(); track t.id) {
              <tr>
                <td style="font-weight:600">{{ devNome(t.desenvolvedorId) }}</td>
                <td style="color:var(--text-muted)">{{ sprintLabel(t.sprintId) }}</td>
                <td>{{ t.dataRegistro | date:'dd/MM/yy' }}</td>
                <td>{{ t.horasTrabalhadas }}h</td>
                <td>
                  @if (t.horasExtras > 0) {
                    <span class="chip purple">{{ t.horasExtras }}h</span>
                  } @else { <span style="color:var(--text-muted)">—</span> }
                </td>
                <td style="color:var(--text-muted);font-size:12px;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ t.descricaoTarefa }}</td>
                <td>
                  <div style="display:flex;gap:6px;justify-content:flex-end">
                    <button class="btn btn-ghost" style="padding:6px 10px" (click)="openDrawer(t)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn btn-ghost" style="padding:6px 10px;color:#EF4444" (click)="confirmDel = t">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            }
            @empty {
              <tr><td colspan="7"><div class="empty-state"><p>Nenhum registro encontrado</p></div></td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    @if (drawerOpen()) {
      <div class="drawer-overlay" (click)="drawerOpen.set(false)"></div>
      <div class="drawer">
        <div class="drawer-header">
          <h3>{{ editingId() ? 'Editar Registro' : 'Registrar Horas' }}</h3>
          <button class="btn btn-ghost" style="padding:6px" (click)="drawerOpen.set(false)">✕</button>
        </div>
        <div class="drawer-body">
          <div class="form-group">
            <label class="label">Desenvolvedor *</label>
            <select class="select" [(ngModel)]="form.desenvolvedorId">
              <option [ngValue]="0">Selecione...</option>
              @for (d of devs(); track d.id) { <option [ngValue]="d.id">{{ d.nome }}</option> }
            </select>
          </div>
          <div class="form-group">
            <label class="label">Sprint *</label>
            <select class="select" [(ngModel)]="form.sprintId">
              <option [ngValue]="0">Selecione...</option>
              @for (s of sprints(); track s.id) { <option [ngValue]="s.id">{{ projetoNome(s.projetoId) }} – {{ s.nomeFase }}</option> }
            </select>
          </div>
          <div class="form-group">
            <label class="label">Data do Registro *</label>
            <input class="input" type="date" [(ngModel)]="form.dataRegistro" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="label">Horas Trabalhadas</label>
              <input class="input" type="number" step="0.5" placeholder="8" [(ngModel)]="form.horasTrabalhadas" />
            </div>
            <div class="form-group">
              <label class="label">Horas Extras</label>
              <input class="input" type="number" step="0.5" placeholder="0" [(ngModel)]="form.horasExtras" />
            </div>
          </div>
          <div class="form-group">
            <label class="label">Descrição da Tarefa</label>
            <textarea class="textarea" rows="3" placeholder="O que foi feito..." [(ngModel)]="form.descricaoTarefa"></textarea>
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
      title="Remover Registro"
      message="Tem certeza que deseja remover este registro?"
      confirmLabel="Remover"
      (confirm)="deleteTs()"
      (cancel)="confirmDel = null"
    />
  `
})
export class TimesheetComponent implements OnInit {
  private svc     = inject(TimesheetService);
  private devSvc  = inject(DesenvolvedorService);
  private projSvc = inject(ProjetoService);
  private spSvc   = inject(SprintService);
  private toast   = inject(ToastService);

  timesheets = signal<Timesheet[]>([]);
  devs       = signal<Desenvolvedor[]>([]);
  projetos   = signal<Projeto[]>([]);
  sprints    = signal<Sprint[]>([]);
  saving     = signal(false);
  drawerOpen = signal(false);
  editingId  = signal<number|null>(null);
  confirmDel: Timesheet | null = null;

  filterDev    = '';
  filterSprint = '';
  form: TimesheetRequest = this.emptyForm();

  ngOnInit() {
    this.devSvc.getAll().subscribe(d => this.devs.set(d));
    this.projSvc.getAll().subscribe(async p => {
      this.projetos.set(p);
      const all = await Promise.all(p.map(proj => this.spSvc.getByProjeto(proj.id).toPromise()));
      this.sprints.set((all.flat() as Sprint[]).filter(Boolean));
      this.loadTimesheets();
    });
  }

  loadTimesheets() {
    if (this.filterDev) {
      this.svc.getByDesenvolvedor(Number(this.filterDev)).subscribe(t => this.timesheets.set(t));
    } else if (this.filterSprint) {
      this.svc.getBySprint(Number(this.filterSprint)).subscribe(t => this.timesheets.set(t));
    } else {
      const devIds = this.devs().map(d => d.id);
      if (!devIds.length) { this.timesheets.set([]); return; }
      Promise.all(devIds.map(id => this.svc.getByDesenvolvedor(id).toPromise()))
        .then(results => {
          const all = (results.flat() as Timesheet[]).filter(Boolean);
          const uniq = Array.from(new Map(all.map(t => [t.id, t])).values());
          this.timesheets.set(uniq);
        });
    }
  }

  totalHoras()  { return this.timesheets().reduce((s, t) => s + (t.horasTrabalhadas || 0), 0); }
  totalExtras() { return this.timesheets().reduce((s, t) => s + (t.horasExtras || 0), 0); }

  devNome(id: number)   { return this.devs().find(d => d.id === id)?.nome || '—'; }
  projetoNome(id: number) { return this.projetos().find(p => p.id === id)?.nome || '—'; }
  sprintLabel(id: number) {
    const s = this.sprints().find(x => x.id === id);
    return s ? `${this.projetoNome(s.projetoId)} – ${s.nomeFase}` : '—';
  }

  openDrawer(t: Timesheet | null) {
    this.editingId.set(t?.id ?? null);
    this.form = t ? { ...t } : this.emptyForm();
    this.drawerOpen.set(true);
  }

  save() {
    if (!this.form.desenvolvedorId || !this.form.sprintId) {
      this.toast.error('Selecione desenvolvedor e sprint.'); return;
    }
    this.saving.set(true);
    const id = this.editingId();
    const obs = id ? this.svc.update(id, this.form) : this.svc.create(this.form);
    obs.subscribe({
      next: (t) => {
        if (id) this.timesheets.update(l => l.map(x => x.id === id ? t : x));
        else this.timesheets.update(l => [...l, t]);
        this.drawerOpen.set(false); this.saving.set(false);
        this.toast.success(id ? 'Registro atualizado!' : 'Horas registradas!');
      },
      error: () => { this.saving.set(false); this.toast.error('Erro ao salvar.'); }
    });
  }

  deleteTs() {
    if (!this.confirmDel) return;
    const id = this.confirmDel.id;
    this.svc.delete(id).subscribe({
      next: () => { this.timesheets.update(l => l.filter(t => t.id !== id)); this.toast.success('Removido.'); },
      error: () => this.toast.error('Erro ao remover.')
    });
    this.confirmDel = null;
  }

  emptyForm(): TimesheetRequest {
    return { dataRegistro: '', horasTrabalhadas: 8, horasExtras: 0, descricaoTarefa: '', desenvolvedorId: 0, sprintId: 0 };
  }
}
