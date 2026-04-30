import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeRequestService } from '../../core/services/change-request.service';
import { ProjetoService } from '../../core/services/projeto.service';
import { ToastService } from '../../core/services/toast.service';
import { ChangeRequest, ChangeRequestRequest } from '../../core/models/change-request.model';
import { Projeto } from '../../core/models/projeto.model';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-change-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Change Requests</h1>
          <p class="page-subtitle">Mudanças de escopo e custos adicionais</p>
        </div>
        <button class="btn btn-primary" (click)="openDrawer(null)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Novo CR
        </button>
      </div>

      <!-- Stats -->
      <div class="grid-3" style="margin-bottom:20px">
        <div class="stat-card">
          <div class="stat-label">Total de CRs</div>
          <div class="stat-value">{{ crs().length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Valor Total Adicional</div>
          <div class="stat-value" style="color:var(--purple)">{{ totalValor() | currency:'BRL':'symbol':'1.0-0' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Aprovados</div>
          <div class="stat-value" style="color:#059669">{{ aprovados() }}</div>
        </div>
      </div>

      <!-- Filter -->
      <div class="card" style="margin-bottom:20px">
        <select class="select" style="max-width:240px" [(ngModel)]="filterProjeto">
          <option value="">Todos os projetos</option>
          @for (p of projetos(); track p.id) { <option [value]="p.id">{{ p.nome }}</option> }
        </select>
      </div>

      <!-- Table -->
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Projeto</th>
              <th>Descrição</th>
              <th>Valor Adicional</th>
              <th>Data Aprovação</th>
              <th style="text-align:right">Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (cr of filtered(); track cr.id) {
              <tr>
                <td style="font-weight:600">{{ projetoNome(cr.projetoId) }}</td>
                <td style="color:var(--text-secondary);max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ cr.descricaoMudanca }}</td>
                <td>
                  <span style="font-weight:700;color:var(--purple)">+ {{ cr.valorAdicional | currency:'BRL':'symbol':'1.2-2' }}</span>
                </td>
                <td>
                  @if (cr.dataAprovacao) {
                    <span class="chip success">{{ cr.dataAprovacao | date:'dd/MM/yy' }}</span>
                  } @else {
                    <span class="chip warning">Pendente</span>
                  }
                </td>
                <td>
                  <div style="display:flex;gap:6px;justify-content:flex-end">
                    <button class="btn btn-ghost" style="padding:6px 10px" (click)="openDrawer(cr)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn btn-ghost" style="padding:6px 10px;color:#EF4444" (click)="confirmDel = cr">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            }
            @empty {
              <tr><td colspan="5"><div class="empty-state"><p>Nenhum change request encontrado</p></div></td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    @if (drawerOpen()) {
      <div class="drawer-overlay" (click)="drawerOpen.set(false)"></div>
      <div class="drawer">
        <div class="drawer-header">
          <h3>{{ editingId() ? 'Editar CR' : 'Novo Change Request' }}</h3>
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
            <label class="label">Descrição da Mudança *</label>
            <textarea class="textarea" rows="3" placeholder="Descreva a mudança de escopo..." [(ngModel)]="form.descricaoMudanca"></textarea>
          </div>
          <div class="form-group">
            <label class="label">Valor Adicional (R$) *</label>
            <input class="input" type="number" step="0.01" placeholder="0.00" [(ngModel)]="form.valorAdicional" />
          </div>
          <div class="form-group">
            <label class="label">Data de Aprovação</label>
            <input class="input" type="date" [(ngModel)]="form.dataAprovacao" />
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
  form: ChangeRequestRequest = this.emptyForm();

  ngOnInit() {
    this.projSvc.getAll().subscribe(p => this.projetos.set(p));
    this.svc.getAll().subscribe(c => this.crs.set(c));
  }

  filtered() { return this.crs().filter(c => !this.filterProjeto || c.projetoId === Number(this.filterProjeto)); }
  totalValor() { return this.filtered().reduce((s, c) => s + (c.valorAdicional || 0), 0); }
  aprovados()  { return this.filtered().filter(c => c.dataAprovacao).length; }
  projetoNome(id: number) { return this.projetos().find(p => p.id === id)?.nome || '—'; }

  openDrawer(cr: ChangeRequest | null) {
    this.editingId.set(cr?.id ?? null);
    this.form = cr ? { descricaoMudanca: cr.descricaoMudanca, valorAdicional: cr.valorAdicional, dataAprovacao: cr.dataAprovacao, projetoId: cr.projetoId } : this.emptyForm();
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
      error: () => { this.saving.set(false); this.toast.error('Erro ao salvar.'); }
    });
  }

  deleteCr() {
    if (!this.confirmDel) return;
    const id = this.confirmDel.id;
    this.svc.delete(id).subscribe({
      next: () => { this.crs.update(l => l.filter(c => c.id !== id)); this.toast.success('CR removido.'); },
      error: () => this.toast.error('Erro ao remover.')
    });
    this.confirmDel = null;
  }

  emptyForm(): ChangeRequestRequest { return { descricaoMudanca: '', valorAdicional: 0, projetoId: 0 }; }
}
