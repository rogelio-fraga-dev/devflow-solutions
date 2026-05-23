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
import { extractErrorMessage } from '../../core/utils/error.util';

@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  template: `
    <div class="page">
      <div class="page-header" style="align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 24px; margin-bottom: 32px;">
        <div style="display: flex; gap: 20px; align-items: center;">
          <div style="width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, var(--purple), #7C3AED); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 24px rgba(79,70,229,0.4);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <h1 class="page-title" style="margin:0;font-size:32px;letter-spacing:-1px;">Timesheet</h1>
            <p class="page-subtitle" style="font-size:15px;margin:0">Registro de horas trabalhadas</p>
          </div>
        </div>
        <div style="display:flex;gap:12px;">
          <button class="btn btn-primary" style="padding:10px 20px" (click)="openDrawer(null)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Registrar Horas
          </button>
        </div>
      </div>

      <!-- Filters in Premium Glass Card -->
      <div class="card card-premium" style="margin-bottom: 24px; padding: 16px 20px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--purple-light)"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <span style="font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Filtrar Timesheet:</span>
        </div>
        <select class="select" style="max-width: 240px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border); color: #fff;" [(ngModel)]="filterDev" (ngModelChange)="loadTimesheets()">
          <option value="">Todos os devs</option>
          @for (d of devs(); track d.id) { <option [value]="d.id">{{ d.nome }}</option> }
        </select>
        <select class="select" style="max-width: 280px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border); color: #fff;" [(ngModel)]="filterSprint" (ngModelChange)="loadTimesheets()">
          <option value="">Todas as sprints</option>
          @for (s of sprints(); track s.id) { <option [value]="s.id">{{ projetoNome(s.projetoId) }} – {{ s.nomeFase }}</option> }
        </select>
      </div>

      <!-- Summary in Premium Glass Cards -->
      <div class="grid-3" style="margin-bottom:24px">
        <div class="card card-premium" style="margin:0; display:flex; flex-direction:column; justify-content:space-between; min-height:110px;">
          <div>
            <div class="stat-label" style="font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted)">Horas Normais</div>
            <div class="stat-value" style="font-size:32px;font-weight:800;color:#fff;margin-top:8px">{{ totalHoras() }}h</div>
          </div>
        </div>
        <div class="card card-premium" style="margin:0; display:flex; flex-direction:column; justify-content:space-between; min-height:110px; position:relative; overflow:hidden;">
          <div style="position:absolute;top:0;right:0;width:80px;height:80px;background:radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%);pointer-events:none;"></div>
          <div>
            <div class="stat-label" style="font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted)">Horas Extras</div>
            <div class="stat-value" style="font-size:32px;font-weight:800;color:var(--purple-light);margin-top:8px">{{ totalExtras() }}h</div>
          </div>
        </div>
        <div class="card card-premium" style="margin:0; display:flex; flex-direction:column; justify-content:space-between; min-height:110px;">
          <div>
            <div class="stat-label" style="font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted)">Total de Registros</div>
            <div class="stat-value" style="font-size:32px;font-weight:800;color:#10B981;margin-top:8px">{{ timesheets().length }}</div>
          </div>
        </div>
      </div>

      <!-- Table in Premium Glass Card -->
      <div class="card card-premium" style="padding: 0; overflow: hidden;">
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;"></th>
                <th>Desenvolvedor</th>
                <th>Sprint</th>
                <th>Data</th>
                <th>Horas Trabalhadas</th>
                <th>Horas Extras</th>
                <th style="text-align:right">Ações</th>
              </tr>
            </thead>
            <tbody>
              @for (t of paginatedTimesheets(); track t.id) {
                <tr style="cursor: pointer;" (click)="toggleTsDetail(t.id)">
                  <td style="width: 40px; text-align: center; vertical-align: middle;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                         [style.transform]="expandedTsId() === t.id ? 'rotate(180deg)' : 'none'" style="transition: transform 0.2s; color: var(--purple-light);">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </td>
                  <td style="font-weight:600">{{ devNome(t.desenvolvedorId) }}</td>
                  <td style="color:var(--text-secondary)">{{ sprintLabel(t.sprintId) }}</td>
                  <td>{{ t.dataRegistro | date:'dd/MM/yy' }}</td>
                  <td>{{ t.horasTrabalhadas }}h</td>
                  <td>
                    @if (t.horasExtras > 0) {
                      <span class="chip-premium purple" style="border:1px solid rgba(139,92,246,0.25)">
                        <span class="dot-ping"></span>
                        {{ t.horasExtras }}h extra
                      </span>
                    } @else { <span style="color:var(--text-muted)">—</span> }
                  </td>
                  <td>
                    <div style="display:flex;gap:6px;justify-content:flex-end" (click)="$event.stopPropagation()">
                      <button class="btn btn-ghost" style="padding:6px 10px" (click)="openDrawer(t)">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button class="btn btn-ghost" style="padding:6px 10px;color:#EF4444" (click)="confirmDel = t">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                @if (expandedTsId() === t.id) {
                  <tr style="background: rgba(139, 92, 246, 0.03);">
                    <td colspan="7" style="padding: 16px 24px; border-bottom: 1px solid rgba(139, 92, 246, 0.15);">
                      <div style="display: flex; flex-direction: column; gap: 10px; border-left: 3px solid var(--purple); padding-left: 16px;">
                        <div>
                          <strong style="color: #fff; font-size: 13px;">Descrição Detalhada da Tarefa:</strong>
                          <div style="color: var(--text-secondary); margin-top: 4px; font-size: 13px; line-height: 1.5;">{{ t.descricaoTarefa || 'Nenhuma descrição fornecida.' }}</div>
                        </div>
                        <div style="display: flex; gap: 40px; flex-wrap: wrap; margin-top: 4px;">
                          <div>
                            <strong style="color: #fff; font-size: 13px;">Colaborador:</strong>
                            <span style="color: var(--text-secondary); margin-left: 8px; font-size: 13px;">{{ devNome(t.desenvolvedorId) }}</span>
                          </div>
                          <div>
                            <strong style="color: #fff; font-size: 13px;">Sprint Associada:</strong>
                            <span style="color: var(--text-secondary); margin-left: 8px; font-size: 13px;">{{ sprintLabel(t.sprintId) }}</span>
                          </div>
                          <div>
                            <strong style="color: #fff; font-size: 13px;">Data Lançamento:</strong>
                            <span style="color: var(--text-secondary); margin-left: 8px; font-size: 13px;">{{ t.dataRegistro | date:'dd/MM/yyyy' }}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                }
              }
              @empty {
                <tr><td colspan="7"><div class="empty-state"><p>Nenhum registro encontrado</p></div></td></tr>
              }
            </tbody>
          </table>
        </div>

        @if (totalPages() > 1) {
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-top: 1px solid var(--border)">
            <button class="btn btn-ghost" style="padding: 8px 16px"
                    [disabled]="currentPage() === 1" (click)="prevPage()">Anterior</button>
            <span style="font-size: 13px; color: var(--text-muted)">Página {{ currentPage() }} de {{ totalPages() }}</span>
            <button class="btn btn-ghost" style="padding: 8px 16px"
                    [disabled]="currentPage() === totalPages()" (click)="nextPage()">Próximo</button>
          </div>
        }
      </div>
    </div>

    <!-- Centered Premium Modal -->
    @if (drawerOpen()) {
      <div class="modal-overlay" (click)="drawerOpen.set(false)">
        <div class="modal modal-content" (click)="$event.stopPropagation()" style="border: 1px solid rgba(139, 92, 246, 0.35); width: 460px; max-width: 95vw; max-height: 90vh; overflow-y: auto;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 12px;">
            <h3 style="font-size: 18px; margin: 0; font-family: var(--font_display);">{{ editingId() ? 'Editar Registro' : 'Registrar Horas' }}</h3>
            <button class="btn btn-ghost" style="padding: 6px; border: none; font-size: 16px;" (click)="drawerOpen.set(false)">✕</button>
          </div>
          
          <div style="display:flex; flex-direction:column; gap:16px; margin-bottom: 24px;">
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
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
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

  currentPage = signal(1); // Mapeado no seeder
  pageSize = 10;
  expandedTsId = signal<number | null>(null);

  paginatedTimesheets() {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.timesheets().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.max(1, Math.ceil(this.timesheets().length / this.pageSize));
  }

  prevPage() { if (this.currentPage() > 1) this.currentPage.update(v => v - 1); }
  nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(v => v + 1); }

  toggleTsDetail(id: number) {
    if (this.expandedTsId() === id) {
      this.expandedTsId.set(null);
    } else {
      this.expandedTsId.set(id);
    }
  }

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
      this.svc.getAll().subscribe(timesheets => {
        this.timesheets.set(timesheets);
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
    if (!this.form.horasTrabalhadas || this.form.horasTrabalhadas <= 0) {
      this.toast.error('Horas trabalhadas deve ser maior que 0.'); return;
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
      error: (err) => { this.saving.set(false); this.toast.error(extractErrorMessage(err)); }
    });
  }

  deleteTs() {
    if (!this.confirmDel) return;
    const id = this.confirmDel.id;
    this.svc.delete(id).subscribe({
      next: () => { this.timesheets.update(l => l.filter(t => t.id !== id)); this.toast.success('Removido.'); },
      error: (err) => this.toast.error(extractErrorMessage(err))
    });
    this.confirmDel = null;
  }

  emptyForm(): TimesheetRequest {
    return { dataRegistro: '', horasTrabalhadas: 8, horasExtras: 0, descricaoTarefa: '', desenvolvedorId: 0, sprintId: 0 };
  }
}
