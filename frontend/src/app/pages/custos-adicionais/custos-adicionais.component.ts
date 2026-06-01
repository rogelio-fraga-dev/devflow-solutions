import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustoAdicionalService } from '../../core/services/custo-adicional.service';
import { ProjetoService } from '../../core/services/projeto.service';
import { ToastService } from '../../core/services/toast.service';
import { CustoAdicional, CustoAdicionalRequest } from '../../core/models/custo-adicional.model';
import { Projeto } from '../../core/models/projeto.model';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { extractErrorMessage } from '../../core/utils/error.util';

@Component({
  selector: 'app-custos-adicionais',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  template: `
    <div class="page">
      <div class="page-header" style="align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 24px; margin-bottom: 32px;">
        <div style="display: flex; gap: 20px; align-items: center;">
          <div style="width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, #10B981, #059669); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 24px rgba(16,185,129,0.4);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <h1 class="page-title" style="margin:0;font-size:32px;letter-spacing:-1px;">Custos Adicionais</h1>
            <p class="page-subtitle" style="font-size:15px;margin:0">Outros custos adicionais pontuais aplicados aos projetos</p>
          </div>
        </div>
        <div style="display:flex;gap:12px;">
          <button class="btn btn-primary" style="padding:10px 20px" (click)="openModal(null)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Registrar Custo
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid-3" style="margin-bottom:20px">
        <div class="stat-card">
          <div class="stat-label">Total de Custos Adicionais</div>
          <div class="stat-value" style="color:#10B981">{{ totalAdicionais() | currency:'BRL':'symbol':'1.2-2' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Registros Lançados</div>
          <div class="stat-value">{{ filtered().length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Descrições Únicas</div>
          <div class="stat-value">{{ descricoesUnicas() }}</div>
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
              <th>Descrição do Custo</th>
              <th style="text-align:right">Valor Adicional</th>
              <th style="text-align:right">Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (a of filtered(); track a.id) {
              <tr style="cursor: pointer;" (click)="toggleDetail(a.id)">
                <td style="width: 40px; text-align: center; vertical-align: middle;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                       [style.transform]="expandedId() === a.id ? 'rotate(180deg)' : 'none'" style="transition: transform 0.2s; color: #10B981;">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </td>
                <td style="font-weight:600">{{ projetoNome(a.projetoId) }}</td>
                <td>{{ a.descricao }}</td>
                <td style="text-align:right;font-weight:700;color:#10B981">{{ a.valorAdicional | currency:'BRL':'symbol':'1.2-2' }}</td>
                <td>
                  <div style="display:flex;gap:6px;justify-content:flex-end" (click)="$event.stopPropagation()">
                    <button class="btn btn-ghost" style="padding:6px 10px" (click)="openModal(a)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn btn-ghost" style="padding:6px 10px;color:#EF4444" (click)="confirmDel = a">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              @if (expandedId() === a.id) {
                <tr style="background: rgba(16, 185, 129, 0.03);">
                  <td colspan="5" style="padding: 16px 24px; border-bottom: 1px solid rgba(16, 185, 129, 0.15);">
                    <div style="display: flex; flex-direction: column; gap: 10px; border-left: 3px solid #10B981; padding-left: 16px;">
                      <div>
                        <strong style="color: #fff; font-size: 13px;">Detalhes do Custo Adicional Lançado:</strong>
                        <span style="color: var(--text-secondary); margin-left: 8px; font-size: 13px;">Representa outros gastos gerais aplicados como despesas no fluxo financeiro do projeto (serviços terceiros, taxas administrativas, contingências, etc.).</span>
                      </div>
                      <div style="display: flex; gap: 40px; flex-wrap: wrap; margin-top: 4px;">
                        <div>
                          <strong style="color: #fff; font-size: 13px;">Descrição do Custo:</strong>
                          <span style="color: var(--text-secondary); margin-left: 8px; font-size: 13px;">{{ a.descricao }}</span>
                        </div>
                        <div>
                          <strong style="color: #fff; font-size: 13px;">Projeto Vinculado:</strong>
                          <span style="color: var(--text-secondary); margin-left: 8px; font-size: 13px;">{{ projetoNome(a.projetoId) }}</span>
                        </div>
                        <div>
                          <strong style="color: #fff; font-size: 13px;">Valor Lançado:</strong>
                          <span style="color: #10B981; margin-left: 8px; font-weight:700; font-size: 13px;">{{ a.valorAdicional | currency:'BRL':'symbol':'1.2-2' }}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              }
            }
            @empty {
              <tr><td colspan="5"><div class="empty-state"><p>Nenhum custo adicional encontrado</p></div></td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Centered Premium Modal -->
    @if (modalOpen()) {
      <div class="modal-overlay" (click)="fecharModal()">
        <div class="modal modal-content" (click)="$event.stopPropagation()" style="border: 1px solid rgba(16, 185, 129, 0.35); width: 700px; max-width: 95vw;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 12px;">
            <h3 style="font-size: 18px; margin: 0; font-family: var(--font_display);">{{ editingId() ? 'Editar Custo Adicional' : 'Registrar Custo Adicional' }}</h3>
            <button class="btn btn-ghost" style="padding: 6px; border: none; font-size: 16px;" (click)="fecharModal()">✕</button>
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
              <label class="label">Descrição do Custo *</label>
              <input class="input" placeholder="Ex: Licenciamento de Hardware, Terceirização..." [(ngModel)]="form.descricao" />
            </div>
            
            <div class="form-group">
              <label class="label">Valor Adicional (R$) *</label>
              <input class="input" type="number" step="0.01" placeholder="0.00" [(ngModel)]="form.valorAdicional" />
            </div>
          </div>
          
          <div style="display:flex; gap:12px; justify-content:flex-end;">
            <button class="btn btn-ghost" style="padding: 10px 20px;" (click)="fecharModal()">Cancelar</button>
            <button class="btn btn-primary" style="padding: 10px 24px;" [disabled]="saving()" (click)="save()">{{ saving() ? 'Salvando...' : 'Salvar' }}</button>
          </div>
        </div>
      </div>
    }

    <app-confirm-modal [open]="!!confirmDel" title="Remover Custo Adicional" message="Deseja remover este registro? O caixa acumulado do projeto será recalculado." confirmLabel="Remover" (confirm)="deleteAdicional()" (cancel)="confirmDel = null" />
  `
})
export class CustosAdicionaisComponent implements OnInit {
  private svc     = inject(CustoAdicionalService);
  private projSvc = inject(ProjetoService);
  private toast   = inject(ToastService);

  adicionais = signal<CustoAdicional[]>([]);
  projetos   = signal<Projeto[]>([]);
  saving     = signal(false);
  modalOpen  = signal(false);
  editingId  = signal<number|null>(null);
  confirmDel: CustoAdicional | null = null;
  filterProjeto = '';
  form: CustoAdicionalRequest = { descricao: '', valorAdicional: 0, projetoId: 0 };

  expandedId = signal<number | null>(null);

  toggleDetail(id: number) {
    if (this.expandedId() === id) {
      this.expandedId.set(null);
    } else {
      this.expandedId.set(id);
    }
  }

  ngOnInit() {
    this.projSvc.getAll().subscribe(p => this.projetos.set(p));
    this.svc.getAll().subscribe(a => this.adicionais.set(a));
  }

  filtered() { return this.adicionais().filter(a => !this.filterProjeto || a.projetoId === Number(this.filterProjeto)); }
  totalAdicionais() { return this.filtered().reduce((s, a) => s + (a.valorAdicional || 0), 0); }
  descricoesUnicas() { return new Set(this.filtered().map(a => a.descricao)).size; }
  projetoNome(id: number) { return this.projetos().find(p => p.id === id)?.nome || '—'; }

  openModal(a: CustoAdicional | null) {
    this.editingId.set(a?.id ?? null);
    this.form = a ? { descricao: a.descricao, valorAdicional: a.valorAdicional, projetoId: a.projetoId } : { descricao: '', valorAdicional: 0, projetoId: 0 };
    this.modalOpen.set(true);
  }

  fecharModal() {
    this.modalOpen.set(false);
    this.editingId.set(null);
  }

  save() {
    if (!this.form.projetoId || !this.form.descricao.trim()) { this.toast.error('Preencha o projeto e a descrição.'); return; }
    if (this.form.valorAdicional <= 0) { this.toast.error('O valor deve ser positivo.'); return; }
    
    this.saving.set(true);
    const id = this.editingId();
    const obs = id ? this.svc.update(id, this.form) : this.svc.create(this.form);
    obs.subscribe({
      next: (a) => {
        if (id) this.adicionais.update(l => l.map(x => x.id === id ? a : x));
        else this.adicionais.update(l => [...l, a]);
        this.fecharModal();
        this.saving.set(false);
        this.toast.success(id ? 'Atualizado com sucesso!' : 'Registrado com sucesso!');
      },
      error: (err) => { this.saving.set(false); this.toast.error(extractErrorMessage(err)); }
    });
  }

  deleteAdicional() {
    if (!this.confirmDel) return;
    const id = this.confirmDel.id;
    this.svc.delete(id).subscribe({
      next: () => {
        this.adicionais.update(l => l.filter(a => a.id !== id));
        this.toast.success('Custo adicional removido e caixa estornado com sucesso.');
      },
      error: (err) => this.toast.error(extractErrorMessage(err))
    });
    this.confirmDel = null;
  }
}
