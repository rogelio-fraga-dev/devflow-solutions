import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustoApiService } from '../../core/services/custo-api.service';
import { ProjetoService } from '../../core/services/projeto.service';
import { ToastService } from '../../core/services/toast.service';
import { CustoApi, CustoApiRequest } from '../../core/models/custo-api.model';
import { Projeto } from '../../core/models/projeto.model';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { extractErrorMessage } from '../../core/utils/error.util';

@Component({
  selector: 'app-custos-api',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  template: `
    <div class="page">
      <div class="page-header" style="align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 24px; margin-bottom: 32px;">
        <div style="display: flex; gap: 20px; align-items: center;">
          <div style="width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, var(--purple), #7C3AED); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 24px rgba(79,70,229,0.4);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
          </div>
          <div>
            <h1 class="page-title" style="margin:0;font-size:32px;letter-spacing:-1px;">Custos de API</h1>
            <p class="page-subtitle" style="font-size:15px;margin:0">Licenças e ferramentas de IA / APIs</p>
          </div>
        </div>
        <div style="display:flex;gap:12px;">
          <button class="btn btn-primary" style="padding:10px 20px" (click)="openDrawer(null)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Registrar Custo
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid-3" style="margin-bottom:20px">
        <div class="stat-card">
          <div class="stat-label">Total de Licenças</div>
          <div class="stat-value" style="color:var(--purple)">{{ totalLicencas() | currency:'BRL':'symbol':'1.2-2' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Registros (filtro)</div>
          <div class="stat-value">{{ filtered().length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Ferramentas únicas</div>
          <div class="stat-value">{{ ferramentasUnicas() }}</div>
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
              <th style="width: 40px; text-align: center;"></th>
              <th>Projeto</th>
              <th>Ferramenta / API</th>
              <th style="text-align:right">Valor da Licença</th>
              <th style="text-align:right">Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (a of paginated(); track a.id) {
              <tr style="cursor: pointer;" (click)="toggleApiDetail(a.id)">
                <td style="width: 40px; text-align: center; vertical-align: middle;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                       [style.transform]="expandedApiId() === a.id ? 'rotate(180deg)' : 'none'" style="transition: transform 0.2s; color: var(--purple-dark);">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </td>
                <td style="font-weight:600">{{ projetoNome(a.projetoId) }}</td>
                <td>{{ a.nomeFerramenta }}</td>
                <td style="text-align:right;font-weight:700;color:var(--purple)">{{ a.valorLicenca | currency:'BRL':'symbol':'1.2-2' }}</td>
                <td>
                  <div style="display:flex;gap:6px;justify-content:flex-end" (click)="$event.stopPropagation()">
                    <button class="btn btn-ghost" style="padding:6px 10px" (click)="openDrawer(a)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn btn-ghost" style="padding:6px 10px;color:#EF4444" (click)="confirmDel = a">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              @if (expandedApiId() === a.id) {
                <tr style="background: rgba(139, 92, 246, 0.03);">
                  <td colspan="5" style="padding: 16px 24px; border-bottom: 1px solid rgba(139, 92, 246, 0.15);">
                    <div style="display: flex; flex-direction: column; gap: 10px; border-left: 3px solid var(--purple); padding-left: 16px;">
                      <div>
                        <strong style="color: #fff; font-size: 13px;">Detalhes da Ferramenta / Licença API:</strong>
                        <span style="color: var(--text-secondary); margin-left: 8px; font-size: 13px;">Custo recorrente de licenças de software ou faturamento de chamadas de API (como OpenAI, Claude, Midjourney).</span>
                      </div>
                      <div style="display: flex; gap: 40px; flex-wrap: wrap; margin-top: 4px;">
                        <div>
                          <strong style="color: #fff; font-size: 13px;">Nome do Recurso:</strong>
                          <span style="color: var(--text-secondary); margin-left: 8px; font-size: 13px;">{{ a.nomeFerramenta }}</span>
                        </div>
                        <div>
                          <strong style="color: #fff; font-size: 13px;">Projeto Vinculado:</strong>
                          <span style="color: var(--text-secondary); margin-left: 8px; font-size: 13px;">{{ projetoNome(a.projetoId) }}</span>
                        </div>
                        <div>
                          <strong style="color: #fff; font-size: 13px;">Valor da Licença:</strong>
                          <span style="color: var(--purple-dark); margin-left: 8px; font-weight:700; font-size: 13px;">{{ a.valorLicenca | currency:'BRL':'symbol':'1.2-2' }}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              }
            }
            @empty {
              <tr><td colspan="5"><div class="empty-state"><p>Nenhum custo de API encontrado</p></div></td></tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-bottom: 32px; margin-top: 16px;">
        <button class="btn btn-ghost" style="padding: 6px 12px; font-size: 15px;" 
                [disabled]="currentPage() === 1" (click)="prevPage()">Anterior</button>
        <span style="font-size: 15px; color: var(--text-muted)">Página {{ currentPage() }} de {{ totalPages() }}</span>
        <button class="btn btn-ghost" style="padding: 6px 12px; font-size: 15px;" 
                [disabled]="currentPage() === totalPages()" (click)="nextPage()">Próximo</button>
      </div>
    </div>

    <!-- Centered Premium Modal -->
    @if (drawerOpen()) {
      <div class="modal-overlay" (click)="drawerOpen.set(false)">
        <div class="modal modal-content" (click)="$event.stopPropagation()" style="border: 1px solid rgba(139, 92, 246, 0.35); width: 700px; max-width: 95vw;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 12px;">
            <h3 style="font-size: 18px; margin: 0; font-family: var(--font_display);">{{ editingId() ? 'Editar Custo API' : 'Registrar Custo API' }}</h3>
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
              <label class="label">Ferramenta / API *</label>
              <input class="input" placeholder="Ex: OpenAI GPT-4, Claude 3..." [(ngModel)]="form.nomeFerramenta" />
            </div>
            
            <div class="form-group">
              <label class="label">Valor da Licença (R$) *</label>
              <input class="input" type="number" step="0.01" placeholder="0.00" [(ngModel)]="form.valorLicenca" />
            </div>
          </div>
          
          <div style="display:flex; gap:12px; justify-content:flex-end;">
            <button class="btn btn-ghost" style="padding: 10px 20px;" (click)="drawerOpen.set(false)">Cancelar</button>
            <button class="btn btn-primary" style="padding: 10px 24px;" [disabled]="saving()" (click)="save()">{{ saving() ? 'Salvando...' : 'Salvar' }}</button>
          </div>
        </div>
      </div>
    }

    <app-confirm-modal [open]="!!confirmDel" title="Remover Custo API" message="Remover este registro?" confirmLabel="Remover" (confirm)="deleteApi()" (cancel)="confirmDel = null" />
  `
})
export class CustosApiComponent implements OnInit {
  private svc     = inject(CustoApiService);
  private projSvc = inject(ProjetoService);
  private toast   = inject(ToastService);

  apis       = signal<CustoApi[]>([]);
  projetos   = signal<Projeto[]>([]);
  saving     = signal(false);
  drawerOpen = signal(false);
  editingId  = signal<number|null>(null);
  confirmDel: CustoApi | null = null;
  filterProjeto = '';
  form: CustoApiRequest = { nomeFerramenta: '', valorLicenca: 0, projetoId: 0 };

  expandedApiId = signal<number | null>(null);

  toggleApiDetail(id: number) {
    if (this.expandedApiId() === id) {
      this.expandedApiId.set(null);
    } else {
      this.expandedApiId.set(id);
    }
  }

  ngOnInit() {
    this.projSvc.getAll().subscribe(p => this.projetos.set(p));
    this.svc.getAll().subscribe(a => this.apis.set(a));
  }

  filtered() { return this.apis().filter(a => !this.filterProjeto || a.projetoId === Number(this.filterProjeto)); }

  currentPage = signal(1);
  pageSize = 10;

  paginated() {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.max(1, Math.ceil(this.filtered().length / this.pageSize));
  }

  nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(v => v + 1); }
  prevPage() { if (this.currentPage() > 1) this.currentPage.update(v => v - 1); }

  totalLicencas() { return this.filtered().reduce((s, a) => s + (a.valorLicenca || 0), 0); }
  ferramentasUnicas() { return new Set(this.filtered().map(a => a.nomeFerramenta)).size; }
  projetoNome(id: number) { return this.projetos().find(p => p.id === id)?.nome || '—'; }

  openDrawer(a: CustoApi | null) {
    this.editingId.set(a?.id ?? null);
    this.form = a ? { nomeFerramenta: a.nomeFerramenta, valorLicenca: a.valorLicenca, projetoId: a.projetoId } : { nomeFerramenta: '', valorLicenca: 0, projetoId: 0 };
    this.drawerOpen.set(true);
  }

  save() {
    if (!this.form.projetoId || !this.form.nomeFerramenta.trim()) { this.toast.error('Preencha projeto e ferramenta.'); return; }
    this.saving.set(true);
    const id = this.editingId();
    const obs = id ? this.svc.update(id, this.form) : this.svc.create(this.form);
    obs.subscribe({
      next: (a) => {
        if (id) this.apis.update(l => l.map(x => x.id === id ? a : x));
        else this.apis.update(l => [...l, a]);
        this.drawerOpen.set(false); this.saving.set(false);
        this.toast.success(id ? 'Atualizado!' : 'Registrado!');
      },
      error: (err) => { this.saving.set(false); this.toast.error(extractErrorMessage(err)); }
    });
  }

  deleteApi() {
    if (!this.confirmDel) return;
    const id = this.confirmDel.id;
    this.svc.delete(id).subscribe({ next: () => { this.apis.update(l => l.filter(a => a.id !== id)); this.toast.success('Removido.'); }, error: (err) => this.toast.error(extractErrorMessage(err)) });
    this.confirmDel = null;
  }
}
