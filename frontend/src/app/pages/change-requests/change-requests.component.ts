import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeRequestService } from '../../core/services/change-request.service';
import { ProjetoService } from '../../core/services/projeto.service';
import { ToastService } from '../../core/services/toast.service';
import { ChangeRequest, ChangeRequestRequest, StatusChangeRequest } from '../../core/models/change-request.model';
import { Projeto } from '../../core/models/projeto.model';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { extractErrorMessage } from '../../core/utils/error.util';

@Component({
  selector: 'app-change-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  template: `
    <div class="page">
      <div class="page-header" style="align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 24px; margin-bottom: 32px;">
        <div style="display: flex; gap: 20px; align-items: center;">
          <div style="width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, var(--purple), #7C3AED); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 24px rgba(79,70,229,0.4);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          </div>
          <div>
            <h1 class="page-title" style="margin:0;font-size:32px;letter-spacing:-1px;">Change Requests</h1>
            <p class="page-subtitle" style="font-size:15px;margin:0">Mudanças de escopo e custos adicionais</p>
          </div>
        </div>
        <div style="display:flex;gap:12px;">
          <button class="btn btn-primary" style="padding:10px 20px" (click)="openDrawer(null)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Novo CR
          </button>
        </div>
      </div>

      <!-- Stats in Premium Glass Cards -->
      <div class="grid-3" style="margin-bottom:24px">
        <div class="card card-premium" style="margin:0; display:flex; flex-direction:column; justify-content:space-between; min-height:110px;">
          <div>
            <div class="stat-label" style="font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted)">Total de CRs</div>
            <div class="stat-value" style="font-size:32px;font-weight:800;color:#fff;margin-top:8px">{{ crs().length }}</div>
          </div>
        </div>
        <div class="card card-premium" style="margin:0; display:flex; flex-direction:column; justify-content:space-between; min-height:110px; position:relative; overflow:hidden;">
          <div style="position:absolute;top:0;right:0;width:80px;height:80px;background:radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%);pointer-events:none;"></div>
          <div>
            <div class="stat-label" style="font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted)">Valor Total Adicional</div>
            <div class="stat-value" style="font-size:32px;font-weight:800;color:var(--purple-light);margin-top:8px">{{ totalValor() | currency:'BRL':'symbol':'1.0-0' }}</div>
          </div>
        </div>
        <div class="card card-premium" style="margin:0; display:flex; flex-direction:column; justify-content:space-between; min-height:110px;">
          <div>
            <div class="stat-label" style="font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted)">Aprovados</div>
            <div class="stat-value" style="font-size:32px;font-weight:800;color:#10B981;margin-top:8px">{{ aprovados() }}</div>
          </div>
        </div>
      </div>

      <!-- Filter Bar in Premium Glass Card -->
      <div class="card card-premium" style="margin-bottom: 24px; padding: 16px 20px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--purple-light)"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <span style="font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Filtrar por Projeto:</span>
        </div>
        <select class="select" style="max-width: 280px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border); color: #fff;" [(ngModel)]="filterProjeto">
          <option value="">Todos os projetos</option>
          @for (p of projetos(); track p.id) { <option [value]="p.id">{{ p.nome }}</option> }
        </select>
      </div>

      <!-- Table in Premium Glass Card -->
      <div class="card card-premium" style="padding: 0; overflow: hidden;">
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;"></th>
                <th>Projeto</th>
                <th>Descrição</th>
                <th>Valor Adicional</th>
                <th>Status</th>
                <th>Data Aprovação</th>
                <th style="text-align:right">Ações</th>
              </tr>
            </thead>
            <tbody>
              @for (cr of paginated(); track cr.id) {
                <tr style="cursor: pointer;" (click)="toggleCrDetail(cr.id)">
                  <td style="width: 40px; text-align: center; vertical-align: middle;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                         [style.transform]="expandedCrId() === cr.id ? 'rotate(180deg)' : 'none'" style="transition: transform 0.2s; color: var(--purple-light);">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </td>
                  <td style="font-weight:600">{{ projetoNome(cr.projetoId) }}</td>
                  <td style="color:var(--text-secondary);max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ cr.descricaoMudanca }}</td>
                  <td>
                    <span style="font-weight:700;color:var(--purple-light)">+ {{ cr.valorAdicional | currency:'BRL':'symbol':'1.2-2' }}</span>
                  </td>
                  <td>
                    <span class="chip-premium {{ getPremiumChipClass(cr.status) }}">
                      <span class="dot-ping"></span>
                      {{ cr.status || 'PENDENTE' }}
                    </span>
                  </td>
                  <td>
                    @if (cr.dataAprovacao) {
                      <span class="chip-premium success" style="border:1px solid rgba(16,185,129,0.25)">
                        <span class="dot-ping"></span>
                        {{ cr.dataAprovacao | date:'dd/MM/yy' }}
                      </span>
                    } @else {
                      <span class="chip-premium warning" style="border:1px solid rgba(245,158,11,0.25)">
                        <span class="dot-ping"></span>
                        Pendente
                      </span>
                    }
                  </td>
                  <td>
                    <div style="display:flex;gap:6px;justify-content:flex-end" (click)="$event.stopPropagation()">
                      <button class="btn btn-ghost" style="padding:6px 10px" (click)="openDrawer(cr)">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button class="btn btn-ghost" style="padding:6px 10px;color:#EF4444" (click)="confirmDel = cr">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                @if (expandedCrId() === cr.id) {
                  <tr style="background: rgba(139, 92, 246, 0.03);">
                    <td colspan="7" style="padding: 16px 24px; border-bottom: 1px solid rgba(139, 92, 246, 0.15);">
                      <div style="display: flex; flex-direction: column; gap: 12px; border-left: 3px solid var(--purple); padding-left: 16px;">
                        <div>
                          <strong style="color: #fff; font-size: 13px;">Descrição Detalhada do Escopo:</strong>
                          <div style="color: var(--text-secondary); margin-top: 4px; font-size: 13px; line-height: 1.5;">{{ cr.descricaoMudanca }}</div>
                        </div>
                        @if (cr.justificativa) {
                          <div>
                            <strong style="color: #fff; font-size: 13px;">Justificativa de Negócio:</strong>
                            <div style="color: var(--text-muted); margin-top: 4px; font-size: 13px; line-height: 1.5;">{{ cr.justificativa }}</div>
                          </div>
                        }
                        <div style="display: flex; gap: 40px; flex-wrap: wrap; margin-top: 4px;">
                          <div>
                            <strong style="color: #fff; font-size: 13px;">Solicitante:</strong>
                            <span style="color: var(--text-secondary); margin-left: 8px; font-size: 13px;">{{ cr.solicitante || 'Não especificado' }}</span>
                          </div>
                          <div>
                            <strong style="color: #fff; font-size: 13px;">Impacto em Horas:</strong>
                            <span class="chip purple" style="margin-left: 8px;">{{ cr.impactoHoras ? cr.impactoHoras + 'h de esforço' : 'Sem impacto estimado' }}</span>
                          </div>
                          @if (cr.dataAprovacao) {
                            <div>
                              <strong style="color: #fff; font-size: 13px;">Data de Aprovação:</strong>
                              <span style="color: var(--text-secondary); margin-left: 8px; font-size: 13px;">{{ cr.dataAprovacao | date:'dd/MM/yyyy' }}</span>
                            </div>
                          }
                        </div>
                      </div>
                    </td>
                  </tr>
                }
              }
              @empty {
                <tr><td colspan="7"><div class="empty-state"><p>Nenhum change request encontrado</p></div></td></tr>
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
        <div class="modal modal-content" (click)="$event.stopPropagation()" style="border: 1px solid rgba(139, 92, 246, 0.35); width: 700px; max-width: 95vw;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 12px;">
            <h3 style="font-size: 18px; margin: 0; font-family: var(--font_display);">{{ editingId() ? 'Editar CR' : 'Novo Change Request' }}</h3>
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
            <div class="form-group" style="grid-column: 1 / -1;">
              <label class="label">Descrição da Mudança *</label>
              <textarea class="textarea" rows="2" placeholder="Descreva a mudança de escopo..." [(ngModel)]="form.descricaoMudanca"></textarea>
            </div>
            <div class="form-group">
              <label class="label">Valor Adicional (R$) *</label>
              <input class="input" type="number" step="0.01" placeholder="0.00" [(ngModel)]="form.valorAdicional" />
            </div>
            <div class="form-group">
              <label class="label">Status</label>
              <select class="select" [(ngModel)]="form.status">
                @for (s of statusList; track s) { <option [value]="s">{{ s }}</option> }
              </select>
            </div>
            <div class="form-group">
              <label class="label">Impacto (Horas)</label>
              <input class="input" type="number" placeholder="Ex: 40" [(ngModel)]="form.impactoHoras" />
            </div>
            <div class="form-group">
              <label class="label">Solicitante</label>
              <input class="input" placeholder="Quem solicitou a mudança" [(ngModel)]="form.solicitante" />
            </div>
            <div class="form-group">
              <label class="label">Data de Aprovação</label>
              <input class="input" type="date" [(ngModel)]="form.dataAprovacao" />
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
              <label class="label">Justificativa</label>
              <textarea class="textarea" rows="2" placeholder="Por que essa mudança é necessária?" [(ngModel)]="form.justificativa"></textarea>
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
      title="Remover Change Request"
      message="Tem certeza que deseja remover este CR?"
      confirmLabel="Remover"
      (confirm)="deleteCr()"
      (cancel)="confirmDel = null"
    />
  `
})
export class ChangeRequestsComponent implements OnInit {
  private svc     = inject(ChangeRequestService);
  private projSvc = inject(ProjetoService);
  private toast   = inject(ToastService);

  crs        = signal<ChangeRequest[]>([]);
  projetos   = signal<Projeto[]>([]);
  saving     = signal(false);
  drawerOpen = signal(false);
  editingId  = signal<number|null>(null);
  confirmDel: ChangeRequest | null = null;
  filterProjeto = '';
  
  currentPage = signal(1);
  pageSize = 10;
  
  expandedCrId = signal<number | null>(null);

  toggleCrDetail(id: number) {
    if (this.expandedCrId() === id) {
      this.expandedCrId.set(null);
    } else {
      this.expandedCrId.set(id);
    }
  }

  getPremiumChipClass(status: string | undefined): string {
    if (!status) return 'warning';
    const map: Record<string, string> = {
      PENDENTE:   'warning',
      EM_ANALISE: 'purple',
      APROVADO:   'success',
      REJEITADO:  'error'
    };
    return map[status] || 'info';
  }
  
  statusList: StatusChangeRequest[] = ['PENDENTE', 'EM_ANALISE', 'APROVADO', 'REJEITADO'];
  form: ChangeRequestRequest = this.emptyForm();

  ngOnInit() {
    this.projSvc.getAll().subscribe(p => this.projetos.set(p));
    this.svc.getAll().subscribe(c => this.crs.set(c));
  }

  filtered() { return this.crs().filter(c => !this.filterProjeto || c.projetoId === Number(this.filterProjeto)); }
  
  paginated() {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.max(1, Math.ceil(this.filtered().length / this.pageSize));
  }

  nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(v => v + 1); }
  prevPage() { if (this.currentPage() > 1) this.currentPage.update(v => v - 1); }
  totalValor() { return this.filtered().reduce((s, c) => s + (c.valorAdicional || 0), 0); }
  aprovados()  { return this.filtered().filter(c => c.dataAprovacao).length; }
  projetoNome(id: number) { return this.projetos().find(p => p.id === id)?.nome || '—'; }

  openDrawer(cr: ChangeRequest | null) {
    this.editingId.set(cr?.id ?? null);
    this.form = cr ? { 
      descricaoMudanca: cr.descricaoMudanca, valorAdicional: cr.valorAdicional, dataAprovacao: cr.dataAprovacao, projetoId: cr.projetoId,
      status: cr.status, impactoHoras: cr.impactoHoras, solicitante: cr.solicitante, justificativa: cr.justificativa
    } : this.emptyForm();
    this.drawerOpen.set(true);
  }

  save() {
    if (!this.form.projetoId || !this.form.descricaoMudanca.trim()) { this.toast.error('Preencha projeto e descrição.'); return; }
    this.saving.set(true);
    const id = this.editingId();
    const obs = id ? this.svc.update(id, this.form) : this.svc.create(this.form);
    obs.subscribe({
      next: (c) => {
        if (id) this.crs.update(l => l.map(x => x.id === id ? c : x));
        else this.crs.update(l => [...l, c]);
        this.drawerOpen.set(false); this.saving.set(false);
        this.toast.success(id ? 'CR atualizado!' : 'CR criado!');
      },
      error: (err) => { this.saving.set(false); this.toast.error(extractErrorMessage(err)); }
    });
  }

  deleteCr() {
    if (!this.confirmDel) return;
    const id = this.confirmDel.id;
    this.svc.delete(id).subscribe({
      next: () => { this.crs.update(l => l.filter(c => c.id !== id)); this.toast.success('CR removido.'); },
      error: (err) => this.toast.error(extractErrorMessage(err))
    });
    this.confirmDel = null;
  }

  emptyForm(): ChangeRequestRequest { return { descricaoMudanca: '', valorAdicional: 0, projetoId: 0, status: 'PENDENTE' }; }
}
