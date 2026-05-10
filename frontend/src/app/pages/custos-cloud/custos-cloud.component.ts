import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustoCloudService } from '../../core/services/custo-cloud.service';
import { ProjetoService } from '../../core/services/projeto.service';
import { ToastService } from '../../core/services/toast.service';
import { CustoCloud, CustoCloudRequest, ProvedorCloud } from '../../core/models/custo-cloud.model';
import { Projeto } from '../../core/models/projeto.model';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { extractErrorMessage } from '../../core/utils/error.util';

@Component({
  selector: 'app-custos-cloud',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Custos Cloud</h1>
          <p class="page-subtitle">Infraestrutura em nuvem por projeto e mês</p>
        </div>
        <button class="btn btn-primary" (click)="openDrawer(null)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Registrar Custo
        </button>
      </div>

      <!-- Stats -->
      <div class="grid-2" style="margin-bottom:20px">
        <div class="stat-card">
          <div class="stat-label">Total (filtro)</div>
          <div class="stat-value" style="color:#0EA5E9">{{ totalCloud() | currency:'BRL':'symbol':'1.2-2' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Por Provedor</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px">
            @for (p of provedores; track p) {
              @if (countByProv(p) > 0) {
                <span style="font-size:12px;font-weight:700;padding:2px 8px;border-radius:20px;background:{{ provColor(p) }}20;color:{{ provColor(p) }}">{{ p }}</span>
              }
            }
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card" style="margin-bottom:20px">
        <div style="display:flex;gap:12px">
          <select class="select" [(ngModel)]="filterProjeto">
            <option value="">Todos os projetos</option>
            @for (p of projetos(); track p.id) { <option [value]="p.id">{{ p.nome }}</option> }
          </select>
          <select class="select" [(ngModel)]="filterProvedor">
            <option value="">Todos os provedores</option>
            @for (p of provedores; track p) { <option [value]="p">{{ p }}</option> }
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Projeto</th>
              <th>Provedor</th>
              <th>Mês de Referência</th>
              <th style="text-align:right">Valor da Fatura</th>
              <th style="text-align:right">Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (c of filtered(); track c.id) {
              <tr>
                <td style="font-weight:600">{{ projetoNome(c.projetoId) }}</td>
                <td>
                  <span style="padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;background:{{ provColor(c.provedor) }}20;color:{{ provColor(c.provedor) }}">{{ c.provedor }}</span>
                </td>
                <td style="color:var(--text-muted)">{{ c.mesReferencia }}</td>
                <td style="text-align:right;font-weight:700;color:#0EA5E9">{{ c.valorFatura | currency:'BRL':'symbol':'1.2-2' }}</td>
                <td>
                  <div style="display:flex;gap:6px;justify-content:flex-end">
                    <button class="btn btn-ghost" style="padding:6px 10px" (click)="openDrawer(c)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn btn-ghost" style="padding:6px 10px;color:#EF4444" (click)="confirmDel = c">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            }
            @empty {
              <tr><td colspan="5"><div class="empty-state"><p>Nenhum custo cloud encontrado</p></div></td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    @if (drawerOpen()) {
      <div class="drawer-overlay" (click)="drawerOpen.set(false)"></div>
      <div class="drawer">
        <div class="drawer-header">
          <h3>{{ editingId() ? 'Editar Custo Cloud' : 'Registrar Custo Cloud' }}</h3>
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
            <label class="label">Provedor</label>
            <select class="select" [(ngModel)]="form.provedor">
              @for (p of provedores; track p) { <option [value]="p">{{ p }}</option> }
            </select>
          </div>
          <div class="form-group"><label class="label">Mês de Referência *</label><input class="input" type="month" [(ngModel)]="form.mesReferencia" /></div>
          <div class="form-group"><label class="label">Valor da Fatura (R$) *</label><input class="input" type="number" step="0.01" placeholder="0.00" [(ngModel)]="form.valorFatura" /></div>
          <div style="display:flex;gap:10px;margin-top:8px">
            <button class="btn btn-ghost" style="flex:1" (click)="drawerOpen.set(false)">Cancelar</button>
            <button class="btn btn-primary" style="flex:1" [disabled]="saving()" (click)="save()">{{ saving() ? 'Salvando...' : 'Salvar' }}</button>
          </div>
        </div>
      </div>
    }

    <app-confirm-modal [open]="!!confirmDel" title="Remover Custo Cloud" message="Remover este registro?" confirmLabel="Remover" (confirm)="deleteCloud()" (cancel)="confirmDel = null" />
  `
})
export class CustosCloudComponent implements OnInit {
  private svc     = inject(CustoCloudService);
  private projSvc = inject(ProjetoService);
  private toast   = inject(ToastService);

  clouds     = signal<CustoCloud[]>([]);
  projetos   = signal<Projeto[]>([]);
  saving     = signal(false);
  drawerOpen = signal(false);
  editingId  = signal<number|null>(null);
  confirmDel: CustoCloud | null = null;
  filterProjeto = '';
  filterProvedor = '';
  provedores: ProvedorCloud[] = ['AWS','AZURE','GCP','ORACLE','DIGITALOCEAN'];
  form: CustoCloudRequest = { provedor: 'AWS', valorFatura: 0, mesReferencia: '', projetoId: 0 };

  ngOnInit() {
    this.projSvc.getAll().subscribe(p => this.projetos.set(p));
    this.svc.getAll().subscribe(c => this.clouds.set(c));
  }

  filtered() {
    return this.clouds().filter(c =>
      (!this.filterProjeto || c.projetoId === Number(this.filterProjeto)) &&
      (!this.filterProvedor || c.provedor === this.filterProvedor)
    );
  }

  totalCloud() { return this.filtered().reduce((s, c) => s + (c.valorFatura || 0), 0); }
  countByProv(p: string) { return this.clouds().filter(c => c.provedor === p).length; }
  projetoNome(id: number) { return this.projetos().find(p => p.id === id)?.nome || '—'; }
  provColor(p: string) { const m: Record<string,string> = { AWS:'#FF9900',AZURE:'#0078D4',GCP:'#4285F4',ORACLE:'#C74634',DIGITALOCEAN:'#0080FF' }; return m[p]||'#64748B'; }

  openDrawer(c: CustoCloud | null) {
    this.editingId.set(c?.id ?? null);
    this.form = c ? { provedor: c.provedor, valorFatura: c.valorFatura, mesReferencia: c.mesReferencia, projetoId: c.projetoId } : { provedor: 'AWS', valorFatura: 0, mesReferencia: '', projetoId: 0 };
    this.drawerOpen.set(true);
  }

  save() {
    if (!this.form.projetoId || !this.form.mesReferencia) { this.toast.error('Preencha projeto e mês.'); return; }
    this.saving.set(true);
    const id = this.editingId();
    const obs = id ? this.svc.update(id, this.form) : this.svc.create(this.form);
    obs.subscribe({
      next: (c) => {
        if (id) this.clouds.update(l => l.map(x => x.id === id ? c : x));
        else this.clouds.update(l => [...l, c]);
        this.drawerOpen.set(false); this.saving.set(false);
        this.toast.success(id ? 'Atualizado!' : 'Registrado!');
      },
      error: (err) => { this.saving.set(false); this.toast.error(extractErrorMessage(err)); }
    });
  }

  deleteCloud() {
    if (!this.confirmDel) return;
    const id = this.confirmDel.id;
    this.svc.delete(id).subscribe({ next: () => { this.clouds.update(l => l.filter(c => c.id !== id)); this.toast.success('Removido.'); }, error: (err) => this.toast.error(extractErrorMessage(err)) });
    this.confirmDel = null;
  }
}
