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
      <div class="page-header" style="align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 24px; margin-bottom: 32px;">
        <div style="display: flex; gap: 20px; align-items: center;">
          <div style="width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, var(--purple), #7C3AED); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 24px rgba(79,70,229,0.4);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
          </div>
          <div>
            <h1 class="page-title" style="margin:0;font-size:32px;letter-spacing:-1px;">Custos Cloud</h1>
            <p class="page-subtitle" style="font-size:15px;margin:0">Infraestrutura em nuvem por projeto e mês</p>
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
              <th style="width: 40px; text-align: center;"></th>
              <th>Projeto</th>
              <th>Provedor</th>
              <th>Mês de Referência</th>
              <th style="text-align:right">Valor da Fatura</th>
              <th style="text-align:right">Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (c of paginated(); track c.id) {
              <tr style="cursor: pointer;" (click)="toggleCloudDetail(c.id)">
                <td style="width: 40px; text-align: center; vertical-align: middle;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                       [style.transform]="expandedCloudId() === c.id ? 'rotate(180deg)' : 'none'" style="transition: transform 0.2s; color: var(--purple-dark);">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </td>
                <td style="font-weight:600">{{ projetoNome(c.projetoId) }}</td>
                <td>
                  <span style="padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;background:{{ provColor(c.provedor) }}20;color:{{ provColor(c.provedor) }}">{{ c.provedor }}</span>
                </td>
                <td style="color:var(--text-muted)">{{ c.mesReferencia }}</td>
                <td style="text-align:right;font-weight:700;color:#0EA5E9">{{ c.valorFatura | currency:'BRL':'symbol':'1.2-2' }}</td>
                <td>
                  <div style="display:flex;gap:6px;justify-content:flex-end" (click)="$event.stopPropagation()">
                    <button class="btn btn-ghost" style="padding:6px 10px" (click)="openDrawer(c)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn btn-ghost" style="padding:6px 10px;color:#EF4444" (click)="confirmDel = c">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              @if (expandedCloudId() === c.id) {
                <tr style="background: rgba(139, 92, 246, 0.03);">
                  <td colspan="6" style="padding: 16px 24px; border-bottom: 1px solid rgba(139, 92, 246, 0.15);">
                    <div style="display: flex; flex-direction: column; gap: 10px; border-left: 3px solid var(--purple); padding-left: 16px;">
                      <div>
                        <strong style="color: #fff; font-size: 13px;">Detalhes do Custo de Nuvem:</strong>
                        <span style="color: var(--text-secondary); margin-left: 8px; font-size: 13px;">Fatura referente ao serviço de infraestrutura e hospedagem em nuvem.</span>
                      </div>
                      <div style="display: flex; gap: 40px; flex-wrap: wrap; margin-top: 4px;">
                        <div>
                          <strong style="color: #fff; font-size: 13px;">Provedor de Nuvem:</strong>
                          <span class="chip" style="margin-left: 8px; font-weight:700; background:{{ provColor(c.provedor) }}20; color:{{ provColor(c.provedor) }}">{{ c.provedor }}</span>
                        </div>
                        <div>
                          <strong style="color: #fff; font-size: 13px;">Mês Competência:</strong>
                          <span style="color: var(--text-secondary); margin-left: 8px; font-size: 13px;">{{ c.mesReferencia }}</span>
                        </div>
                        <div>
                          <strong style="color: #fff; font-size: 13px;">Valor da Fatura:</strong>
                          <span style="color: #0EA5E9; margin-left: 8px; font-weight:700; font-size: 13px;">{{ c.valorFatura | currency:'BRL':'symbol':'1.2-2' }}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              }
            }
            @empty {
              <tr><td colspan="6"><div class="empty-state"><p>Nenhum custo cloud encontrado</p></div></td></tr>
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
            <h3 style="font-size: 18px; margin: 0; font-family: var(--font_display);">{{ editingId() ? 'Editar Custo Cloud' : 'Registrar Custo Cloud' }}</h3>
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
              <label class="label">Provedor *</label>
              <select class="select" [(ngModel)]="form.provedor">
                @for (p of provedores; track p) { <option [value]="p">{{ p }}</option> }
              </select>
            </div>
            
            <div class="form-group">
              <label class="label">Mês de Referência *</label>
              <input class="input" type="month" [(ngModel)]="form.mesReferencia" />
            </div>
            
            <div class="form-group">
              <label class="label">Valor da Fatura (R$) *</label>
              <input class="input" type="number" step="0.01" placeholder="0.00" [(ngModel)]="form.valorFatura" />
            </div>
          </div>
          
          <div style="display:flex; gap:12px; justify-content:flex-end;">
            <button class="btn btn-ghost" style="padding: 10px 20px;" (click)="drawerOpen.set(false)">Cancelar</button>
            <button class="btn btn-primary" style="padding: 10px 24px;" [disabled]="saving()" (click)="save()">{{ saving() ? 'Salvando...' : 'Salvar' }}</button>
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

  expandedCloudId = signal<number | null>(null);

  toggleCloudDetail(id: number) {
    if (this.expandedCloudId() === id) {
      this.expandedCloudId.set(null);
    } else {
      this.expandedCloudId.set(id);
    }
  }

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
