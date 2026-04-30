import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustoApiService } from '../../core/services/custo-api.service';
import { ProjetoService } from '../../core/services/projeto.service';
import { ToastService } from '../../core/services/toast.service';
import { CustoApi, CustoApiRequest } from '../../core/models/custo-api.model';
import { Projeto } from '../../core/models/projeto.model';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-custos-api',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Custos de API</h1>
          <p class="page-subtitle">Licenças e ferramentas de IA / APIs</p>
        </div>
        <button class="btn btn-primary" (click)="openDrawer(null)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Registrar Custo
        </button>
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
              <th>Projeto</th>
              <th>Ferramenta / API</th>
              <th style="text-align:right">Valor da Licença</th>
              <th style="text-align:right">Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (a of filtered(); track a.id) {
              <tr>
                <td style="font-weight:600">{{ projetoNome(a.projetoId) }}</td>
                <td>{{ a.nomeFerramenta }}</td>
                <td style="text-align:right;font-weight:700;color:var(--purple)">{{ a.valorLicenca | currency:'BRL':'symbol':'1.2-2' }}</td>
                <td>
                  <div style="display:flex;gap:6px;justify-content:flex-end">
                    <button class="btn btn-ghost" style="padding:6px 10px" (click)="openDrawer(a)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn btn-ghost" style="padding:6px 10px;color:#EF4444" (click)="confirmDel = a">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            }
            @empty {
              <tr><td colspan="4"><div class="empty-state"><p>Nenhum custo de API encontrado</p></div></td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    @if (drawerOpen()) {
      <div class="drawer-overlay" (click)="drawerOpen.set(false)"></div>
      <div class="drawer">
        <div class="drawer-header">
          <h3>{{ editingId() ? 'Editar Custo API' : 'Registrar Custo API' }}</h3>
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
          <div class="form-group"><label class="label">Ferramenta / API *</label><input class="input" placeholder="Ex: OpenAI GPT-4, Claude 3..." [(ngModel)]="form.nomeFerramenta" /></div>
          <div class="form-group"><label class="label">Valor da Licença (R$) *</label><input class="input" type="number" step="0.01" placeholder="0.00" [(ngModel)]="form.valorLicenca" /></div>
          <div style="display:flex;gap:10px;margin-top:8px">
            <button class="btn btn-ghost" style="flex:1" (click)="drawerOpen.set(false)">Cancelar</button>
            <button class="btn btn-primary" style="flex:1" [disabled]="saving()" (click)="save()">{{ saving() ? 'Salvando...' : 'Salvar' }}</button>
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

  ngOnInit() {
    this.projSvc.getAll().subscribe(p => this.projetos.set(p));
    this.svc.getAll().subscribe(a => this.apis.set(a));
  }

  filtered() { return this.apis().filter(a => !this.filterProjeto || a.projetoId === Number(this.filterProjeto)); }
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
      error: () => { this.saving.set(false); this.toast.error('Erro ao salvar.'); }
    });
  }

  deleteApi() {
    if (!this.confirmDel) return;
    const id = this.confirmDel.id;
    this.svc.delete(id).subscribe({ next: () => { this.apis.update(l => l.filter(a => a.id !== id)); this.toast.success('Removido.'); }, error: () => this.toast.error('Erro.') });
    this.confirmDel = null;
  }
}
