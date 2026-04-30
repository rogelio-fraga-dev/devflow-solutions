import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjetoService } from '../../../core/services/projeto.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { ToastService } from '../../../core/services/toast.service';
import { Projeto, ProjetoRequest, StatusProjeto } from '../../../core/models/projeto.model';
import { Cliente } from '../../../core/models/cliente.model';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-projetos-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Projetos</h1>
          <p class="page-subtitle">{{ projetos().length }} projeto(s) cadastrado(s)</p>
        </div>
        <button class="btn btn-primary" (click)="openDrawer(null)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Novo Projeto
        </button>
      </div>

      <!-- Filters -->
      <div class="card" style="margin-bottom:20px">
        <div style="display:flex;gap:12px;align-items:center">
          <div style="position:relative;flex:1">
            <svg style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input class="input" style="padding-left:36px" placeholder="Buscar projeto..." [(ngModel)]="search" />
          </div>
          <select class="select" style="width:180px" [(ngModel)]="filterStatus">
            <option value="">Todos os status</option>
            @for (s of statusList; track s) { <option [value]="s">{{ s }}</option> }
          </select>
        </div>
      </div>

      <!-- Grid -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px">
        @for (p of filtered(); track p.id) {
          <div class="card" style="cursor:pointer;transition:box-shadow .15s" (click)="openDetail(p)">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
              <div>
                <h3 style="font-size:15px;margin-bottom:4px">{{ p.nome }}</h3>
                <span style="font-size:12px;color:var(--text-muted)">{{ p.stackTecnologica }}</span>
              </div>
              <span class="chip {{ statusClass(p.status) }}">{{ p.status }}</span>
            </div>

            <!-- Budget -->
            <div style="margin-bottom:12px">
              <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:6px">
                <span>Orçamento utilizado</span>
                <span style="font-weight:700;color:var(--text-primary)">{{ pct(p) }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill {{ pct(p) >= 100 ? 'danger' : pct(p) >= 80 ? 'warn' : '' }}"
                     [style.width]="pct(p) + '%'"></div>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-top:4px">
                <span>{{ p.custoAtualAcumulado | currency:'BRL':'symbol':'1.0-0' }}</span>
                <span>{{ p.budgetTotal | currency:'BRL':'symbol':'1.0-0' }}</span>
              </div>
            </div>

            <!-- Dates -->
            <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:12px">
              <span>Início: {{ p.dataInicio | date:'dd/MM/yy' }}</span>
              <span>Entrega: {{ p.dataPrevisaoEntrega | date:'dd/MM/yy' }}</span>
            </div>

            <!-- Actions -->
            <div style="display:flex;gap:8px" (click)="$event.stopPropagation()">
              <button class="btn btn-ghost" style="flex:1;font-size:12px" (click)="openDrawer(p)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Editar
              </button>
              <button class="btn btn-ghost" style="padding:8px 10px;color:#EF4444" (click)="confirmDel = p">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              </button>
            </div>
          </div>
        }
        @empty {
          <div class="card" style="grid-column:1/-1">
            <div class="empty-state">
              <div class="empty-icon">📁</div>
              <p>Nenhum projeto encontrado</p>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Drawer -->
    @if (drawerOpen()) {
      <div class="drawer-overlay" (click)="drawerOpen.set(false)"></div>
      <div class="drawer">
        <div class="drawer-header">
          <h3>{{ editingId() ? 'Editar Projeto' : 'Novo Projeto' }}</h3>
          <button class="btn btn-ghost" style="padding:6px" (click)="drawerOpen.set(false)">✕</button>
        </div>
        <div class="drawer-body">
          <div class="form-group">
            <label class="label">Nome *</label>
            <input class="input" placeholder="Nome do projeto" [(ngModel)]="form.nome" />
          </div>
          <div class="form-group">
            <label class="label">Stack Tecnológica</label>
            <input class="input" placeholder="Ex: React, Node.js, PostgreSQL" [(ngModel)]="form.stackTecnologica" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="label">Orçamento (R$) *</label>
              <input class="input" type="number" placeholder="0.00" [(ngModel)]="form.budgetTotal" />
            </div>
            <div class="form-group">
              <label class="label">Status</label>
              <select class="select" [(ngModel)]="form.status">
                @for (s of statusList; track s) { <option [value]="s">{{ s }}</option> }
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="label">Data de Início</label>
              <input class="input" type="date" [(ngModel)]="form.dataInicio" />
            </div>
            <div class="form-group">
              <label class="label">Previsão de Entrega</label>
              <input class="input" type="date" [(ngModel)]="form.dataPrevisaoEntrega" />
            </div>
          </div>
          <div class="form-group">
            <label class="label">Cliente</label>
            <select class="select" [(ngModel)]="form.clienteId">
              <option [ngValue]="null">— Sem cliente —</option>
              @for (c of clientes(); track c.id) {
                <option [ngValue]="c.id">{{ c.razaoSocial }}</option>
              }
            </select>
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
      title="Remover Projeto"
      [message]="'Remover &quot;' + (confirmDel?.nome || '') + '&quot;? Esta ação não pode ser desfeita.'"
      confirmLabel="Remover"
      (confirm)="deleteProjeto()"
      (cancel)="confirmDel = null"
    />
  `
})
export class ProjetosListaComponent implements OnInit {
  private svc     = inject(ProjetoService);
  private cliSvc  = inject(ClienteService);
  private toast   = inject(ToastService);
  private router  = inject(Router);

  projetos  = signal<Projeto[]>([]);
  clientes  = signal<Cliente[]>([]);
  loading   = signal(false);
  saving    = signal(false);
  drawerOpen= signal(false);
  editingId = signal<number|null>(null);
  confirmDel: Projeto | null = null;

  search       = '';
  filterStatus = '';

  statusList: StatusProjeto[] = ['RASCUNHO','PLANEJADO','EM_ANDAMENTO','ALERTA','ESTOURADO','PAUSADO','CONCLUIDO','CANCELADO'];

  form: ProjetoRequest = this.emptyForm();

  ngOnInit() {
    this.svc.getAll().subscribe(p => this.projetos.set(p));
    this.cliSvc.getAll().subscribe(c => this.clientes.set(c));
  }

  filtered() {
    return this.projetos().filter(p =>
      (!this.search || p.nome.toLowerCase().includes(this.search.toLowerCase())) &&
      (!this.filterStatus || p.status === this.filterStatus)
    );
  }

  pct(p: Projeto) {
    if (!p.budgetTotal) return 0;
    return Math.min(Math.round((p.custoAtualAcumulado / p.budgetTotal) * 100), 100);
  }

  statusClass(s: StatusProjeto) {
    const map: Record<StatusProjeto, string> = {
      RASCUNHO: 'gray', PLANEJADO: 'info', EM_ANDAMENTO: 'purple',
      ALERTA: 'warning', ESTOURADO: 'error', PAUSADO: 'gray',
      CONCLUIDO: 'success', CANCELADO: 'error'
    };
    return map[s] || 'gray';
  }

  openDetail(p: Projeto) { this.router.navigate(['/app/projetos', p.id]); }

  openDrawer(p: Projeto | null) {
    this.editingId.set(p?.id ?? null);
    this.form = p ? {
      nome: p.nome, stackTecnologica: p.stackTecnologica,
      budgetTotal: p.budgetTotal, status: p.status,
      dataInicio: p.dataInicio, dataPrevisaoEntrega: p.dataPrevisaoEntrega,
      clienteId: p.clienteId
    } : this.emptyForm();
    this.drawerOpen.set(true);
  }

  save() {
    if (!this.form.nome.trim()) { this.toast.error('Nome é obrigatório.'); return; }
    this.saving.set(true);
    const id = this.editingId();
    const obs = id ? this.svc.update(id, this.form) : this.svc.create(this.form);
    obs.subscribe({
      next: (p) => {
        if (id) this.projetos.update(list => list.map(x => x.id === id ? p : x));
        else this.projetos.update(list => [...list, p]);
        this.drawerOpen.set(false);
        this.saving.set(false);
        this.toast.success(id ? 'Projeto atualizado!' : 'Projeto criado!');
      },
      error: () => { this.saving.set(false); this.toast.error('Erro ao salvar projeto.'); }
    });
  }

  deleteProjeto() {
    if (!this.confirmDel) return;
    const id = this.confirmDel.id;
    this.svc.delete(id).subscribe({
      next: () => {
        this.projetos.update(list => list.filter(p => p.id !== id));
        this.toast.success('Projeto removido.');
      },
      error: () => this.toast.error('Erro ao remover projeto.')
    });
    this.confirmDel = null;
  }

  emptyForm(): ProjetoRequest {
    return { nome: '', stackTecnologica: '', budgetTotal: 0, status: 'RASCUNHO', dataInicio: '', dataPrevisaoEntrega: '' };
  }
}
