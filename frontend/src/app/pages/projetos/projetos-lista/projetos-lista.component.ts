import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjetoService } from '../../../core/services/projeto.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { DesenvolvedorService } from '../../../core/services/desenvolvedor.service';
import { ToastService } from '../../../core/services/toast.service';
import { Projeto, ProjetoRequest, StatusProjeto, PrioridadeProjeto, RiscoProjeto } from '../../../core/models/projeto.model';
import { Cliente } from '../../../core/models/cliente.model';
import { Usuario } from '../../../core/models/usuario.model';
import { Desenvolvedor } from '../../../core/models/desenvolvedor.model';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { extractErrorMessage } from '../../../core/utils/error.util';

@Component({
  selector: 'app-projetos-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  template: `
    <div class="page">
      <div class="page-header" style="align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 24px; margin-bottom: 32px;">
        <div style="display: flex; gap: 20px; align-items: center;">
          <div style="width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, var(--purple), #7C3AED); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 24px rgba(79,70,229,0.4);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div>
            <h1 class="page-title" style="margin:0;font-size:32px;letter-spacing:-1px;">Projetos</h1>
            <p class="page-subtitle" style="font-size:15px;margin:0">{{ projetos().length }} projeto(s) cadastrado(s)</p>
          </div>
        </div>
        <div style="display:flex;gap:12px;">
          <button class="btn btn-primary" style="padding:10px 20px" (click)="openDrawer(null)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Novo Projeto
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="card card-premium" style="margin-bottom:20px">
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
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;margin-bottom:24px">
        @for (p of paginated(); track p.id) {
          <div class="card card-premium glow-indigo" style="cursor:pointer;" (click)="openDetail(p)">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
              <div>
                <h3 style="font-size:15px;margin-bottom:4px">{{ p.nome }}</h3>
                <span style="font-size:12px;color:var(--text-muted)">{{ p.stackTecnologica }}</span>
              </div>
              <span class="chip-premium {{ statusClass(p.status) }}">
                <span class="dot-ping"></span>
                {{ p.status }}
              </span>
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
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-muted); margin-bottom:12px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <p>Nenhum projeto encontrado</p>
            </div>
          </div>
        }
      </div>

      <!-- Pagination Controls -->
      @if (totalPages() > 1) {
        <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-bottom: 32px;">
          <button class="btn btn-ghost" style="padding: 6px 12px; font-size: 13px;" 
                  [disabled]="currentPage() === 1" (click)="prevPage()">Anterior</button>
          <span style="font-size: 13px; color: var(--text-muted)">Página {{ currentPage() }} de {{ totalPages() }}</span>
          <button class="btn btn-ghost" style="padding: 6px 12px; font-size: 13px;" 
                  [disabled]="currentPage() === totalPages()" (click)="nextPage()">Próximo</button>
        </div>
      }
    </div>

    <!-- Drawer -->
    <!-- Centered Premium Modal -->
    @if (drawerOpen()) {
      <div class="modal-overlay" (click)="drawerOpen.set(false)">
        <div class="modal modal-content" (click)="$event.stopPropagation()" style="border: 1px solid rgba(139, 92, 246, 0.35); width: 520px; max-width: 95vw;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 12px;">
            <h3 style="font-size: 18px; margin: 0; font-family: var(--font_display);">{{ editingId() ? 'Editar Projeto' : 'Novo Projeto' }}</h3>
            <button class="btn btn-ghost" style="padding: 6px; border: none; font-size: 16px;" (click)="drawerOpen.set(false)">✕</button>
          </div>
          
          <div style="display:flex; flex-direction:column; gap:16px; margin-bottom: 24px; max-height: 62vh; overflow-y: auto; padding-right: 4px;">
            <div class="form-group">
              <label class="label">Nome *</label>
              <input class="input" placeholder="Nome do projeto" [(ngModel)]="form.nome" />
            </div>
            
            <div class="form-group">
              <label class="label">Stack Tecnológica</label>
              <input class="input" placeholder="Ex: React, Node.js, PostgreSQL" [(ngModel)]="form.stackTecnologica" />
            </div>
            
            <div class="form-group">
              <label class="label">Descrição</label>
              <textarea class="input" style="min-height:80px" placeholder="Visão geral ou business case..." [(ngModel)]="form.descricao"></textarea>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="label">Prioridade</label>
                <select class="select" [(ngModel)]="form.prioridade">
                  <option [ngValue]="undefined">— Nenhuma —</option>
                  @for (p of prioridadeList; track p) { <option [value]="p">{{ p }}</option> }
                </select>
              </div>
              
              <div class="form-group">
                <label class="label">Risco Atual</label>
                <select class="select" [(ngModel)]="form.riscoAtual">
                  <option [ngValue]="undefined">— Nenhum —</option>
                  @for (r of riscoList; track r) { <option [value]="r">{{ r }}</option> }
                </select>
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
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
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
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
            
            <div class="form-group">
              <label class="label">Gestor Responsável *</label>
              <select class="select" [(ngModel)]="form.gestorId">
                <option [ngValue]="undefined">— Selecione —</option>
                @for (g of gestores(); track g.id) {
                  <option [ngValue]="g.id">{{ g.nome }}</option>
                }
              </select>
            </div>
            
            <div class="form-group">
              <label class="label">Desenvolvedores Vinculados</label>
              <select class="select" multiple [(ngModel)]="form.desenvolvedoresIds" style="height: 100px;">
                @for (d of devs(); track d.id) {
                  <option [ngValue]="d.id">{{ d.nome }} ({{ d.senioridade }})</option>
                }
              </select>
              <span style="font-size:11px;color:var(--text-muted)">Segure Ctrl (ou Cmd) para selecionar múltiplos.</span>
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
  private usuSvc  = inject(UsuarioService);
  private devSvc  = inject(DesenvolvedorService);
  private toast   = inject(ToastService);
  private router  = inject(Router);

  projetos  = signal<Projeto[]>([]);
  clientes  = signal<Cliente[]>([]);
  gestores  = signal<Usuario[]>([]);
  devs      = signal<Desenvolvedor[]>([]);
  loading   = signal(false);
  saving    = signal(false);
  drawerOpen= signal(false);
  editingId = signal<number|null>(null);
  confirmDel: Projeto | null = null;

  search       = '';
  filterStatus = '';

  currentPage = signal(1);
  pageSize = 10;

  statusList: StatusProjeto[] = ['RASCUNHO','PLANEJADO','EM_ANDAMENTO','ALERTA','ESTOURADO','PAUSADO','CONCLUIDO','CANCELADO'];
  prioridadeList: PrioridadeProjeto[] = ['BAIXA', 'MEDIA', 'ALTA'];
  riscoList: RiscoProjeto[] = ['BAIXO', 'MEDIO', 'ALTO', 'CRITICO'];

  form: ProjetoRequest = this.emptyForm();

  ngOnInit() {
    this.svc.getAll().subscribe(p => this.projetos.set(p));
    this.cliSvc.getAll().subscribe(c => this.clientes.set(c));
    this.usuSvc.getAll().subscribe(u => this.gestores.set(u.filter(x => x.role === 'GESTOR' || x.role === 'ADMIN')));
    this.devSvc.getAll().subscribe(d => this.devs.set(d));
  }

  filtered() {
    return this.projetos().filter(p =>
      (!this.search || p.nome.toLowerCase().includes(this.search.toLowerCase())) &&
      (!this.filterStatus || p.status === this.filterStatus)
    );
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

  pct(p: Projeto) {
    if (!p.budgetTotal) return 0;
    return Math.min(Math.round((p.custoAtualAcumulado / p.budgetTotal) * 100), 100);
  }

  statusClass(s: StatusProjeto) {
    const map: Record<StatusProjeto, string> = {
      RASCUNHO: 'info', PLANEJADO: 'info', EM_ANDAMENTO: 'purple',
      ALERTA: 'warning', ESTOURADO: 'error', PAUSADO: 'info',
      CONCLUIDO: 'success', CANCELADO: 'error'
    };
    return map[s] || 'info';
  }

  openDetail(p: Projeto) { this.router.navigate(['/app/projetos', p.id]); }

  openDrawer(p: Projeto | null) {
    this.editingId.set(p?.id ?? null);
    this.form = p ? {
      nome: p.nome, stackTecnologica: p.stackTecnologica,
      descricao: p.descricao, prioridade: p.prioridade, riscoAtual: p.riscoAtual,
      budgetTotal: p.budgetTotal, status: p.status,
      dataInicio: p.dataInicio, dataPrevisaoEntrega: p.dataPrevisaoEntrega,
      clienteId: p.clienteId,
      gestorId: p.gestorId,
      desenvolvedoresIds: p.desenvolvedores?.map(d => d.id) || []
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
      error: (err) => { this.saving.set(false); this.toast.error(extractErrorMessage(err)); }
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
      error: (err) => this.toast.error(extractErrorMessage(err))
    });
    this.confirmDel = null;
  }

  emptyForm(): ProjetoRequest {
    return { nome: '', stackTecnologica: '', budgetTotal: 0, status: 'RASCUNHO', dataInicio: '', dataPrevisaoEntrega: '', desenvolvedoresIds: [] };
  }
}
