import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DesenvolvedorService } from '../../core/services/desenvolvedor.service';
import { ProjetoService } from '../../core/services/projeto.service';
import { ToastService } from '../../core/services/toast.service';
import { Desenvolvedor, DesenvolvedorRequest, Senioridade } from '../../core/models/desenvolvedor.model';
import { Projeto } from '../../core/models/projeto.model';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { extractErrorMessage } from '../../core/utils/error.util';

@Component({
  selector: 'app-desenvolvedores',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  template: `
    <div class="page">
      <div class="page-header" style="align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 24px; margin-bottom: 32px;">
        <div style="display: flex; gap: 20px; align-items: center;">
          <div style="width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, var(--purple), #7C3AED); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 24px rgba(79,70,229,0.4);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </div>
          <div>
            <h1 class="page-title" style="margin:0;font-size:32px;letter-spacing:-1px;">Desenvolvedores</h1>
            <p class="page-subtitle" style="font-size:15px;margin:0">Equipe técnica e alocações</p>
          </div>
        </div>
        <div style="display:flex;gap:12px;">
          <button class="btn btn-primary" style="padding:10px 20px" (click)="openDrawer(null)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Novo Desenvolvedor
          </button>
        </div>
      </div>

      <!-- Counters by seniority -->
      <div class="grid-4" style="margin-bottom:20px">
        @for (s of senList; track s) {
          <div class="stat-card">
            <div class="stat-label">{{ s }}</div>
            <div class="stat-value" [style.color]="senColor(s)">{{ countBySen(s) }}</div>
          </div>
        }
      </div>

      <!-- Search -->
      <div class="card" style="margin-bottom:20px">
        <div style="position:relative">
          <svg style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="input" style="padding-left:36px" placeholder="Buscar desenvolvedor..." [(ngModel)]="search" />
        </div>
      </div>

      <!-- Cards -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
        @for (d of paginated(); track d.id) {
          <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px">
              <div style="display:flex;align-items:center;gap:10px">
                <div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--purple),#7C3AED);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px;flex-shrink:0">
                  {{ initials(d.nome) }}
                </div>
                <div>
                  <div style="font-weight:700;font-size:14px">{{ d.nome }}</div>
                </div>
              </div>
              <span style="padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700;background:{{ senColor(d.senioridade) }}20;color:{{ senColor(d.senioridade) }}">{{ d.senioridade }}</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;color:var(--text-muted);margin-bottom:14px">

              <div style="display:flex;justify-content:space-between">
                <span>Taxa/hora</span>
                <span style="color:var(--text-primary);font-weight:700">{{ d.valorHoraCusto | currency:'BRL':'symbol':'1.2-2' }}</span>
              </div>
              <div style="display:flex;justify-content:space-between">
                <span>Hora extra</span>
                <span style="color:var(--text-primary);font-weight:700">{{ d.valorHoraExtra | currency:'BRL':'symbol':'1.2-2' }}</span>
              </div>
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn btn-ghost" style="flex:1;font-size:12px" (click)="openDrawer(d)">Editar</button>
              <button class="btn btn-ghost" style="padding:8px 10px;color:#EF4444" (click)="confirmDel = d">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
              </button>
            </div>
          </div>
        }
        @empty {
          <div class="card" style="grid-column:1/-1"><div class="empty-state"><p>Nenhum desenvolvedor encontrado</p></div></div>
        }
      </div>

      <!-- Pagination Controls -->
      <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-bottom: 32px;">
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
            <h3 style="font-size: 18px; margin: 0; font-family: var(--font_display);">{{ editingId() ? 'Editar Desenvolvedor' : 'Novo Desenvolvedor' }}</h3>
            <button class="btn btn-ghost" style="padding: 6px; border: none; font-size: 16px;" (click)="drawerOpen.set(false)">✕</button>
          </div>
          
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom: 24px;">
            <div class="form-group" style="grid-column: 1 / -1;">
              <label class="label">Nome *</label>
              <input class="input" placeholder="Nome completo" [(ngModel)]="form.nome" />
            </div>
            
            <div class="form-group" style="grid-column: 1 / -1;">
              <label class="label">Senioridade</label>
              <select class="select" [(ngModel)]="form.senioridade">
                @for (s of senList; track s) { <option [value]="s">{{ s }}</option> }
              </select>
            </div>
            
            <div class="form-group">
              <label class="label">Taxa/hora (R$)</label>
              <input class="input" type="number" step="0.01" placeholder="0.00" [(ngModel)]="form.valorHoraCusto" />
            </div>
            <div class="form-group">
              <label class="label">Hora extra (R$)</label>
              <input class="input" type="number" step="0.01" placeholder="0.00" [(ngModel)]="form.valorHoraExtra" />
            </div>
          </div>
          
          <div style="display:flex; gap:12px; justify-content:flex-end;">
            <button class="btn btn-ghost" style="padding: 10px 20px;" (click)="drawerOpen.set(false)">Cancelar</button>
            <button class="btn btn-primary" style="padding: 10px 24px;" [disabled]="saving()" (click)="save()">{{ saving() ? 'Salvando...' : 'Salvar' }}</button>
          </div>
        </div>
      </div>
    }

    <app-confirm-modal [open]="!!confirmDel" title="Remover Desenvolvedor" [message]="'Remover &quot;' + (confirmDel?.nome||'') + '&quot;?'" confirmLabel="Remover" (confirm)="deleteDev()" (cancel)="confirmDel = null" />
  `
})
export class DesenvolvedoresComponent implements OnInit {
  private svc     = inject(DesenvolvedorService);
  private projSvc = inject(ProjetoService);
  private toast   = inject(ToastService);
  devs       = signal<Desenvolvedor[]>([]);
  saving     = signal(false);
  drawerOpen = signal(false);
  editingId  = signal<number|null>(null);
  confirmDel: Desenvolvedor | null = null;
  search = '';
  senList: Senioridade[] = ['JUNIOR','PLENO','SENIOR','GESTOR_TECH_LEAD'];
  form: DesenvolvedorRequest = this.emptyForm();

  currentPage = signal(1);
  pageSize = 10;

  ngOnInit() {
    this.svc.getAll().subscribe(d => this.devs.set(d));
  }

  filtered() { return this.devs().filter(d => !this.search || d.nome.toLowerCase().includes(this.search.toLowerCase())); }
  
  paginated() {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.max(1, Math.ceil(this.filtered().length / this.pageSize));
  }

  nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(v => v + 1); }
  prevPage() { if (this.currentPage() > 1) this.currentPage.update(v => v - 1); }

  countBySen(s: Senioridade) { return this.devs().filter(d => d.senioridade === s).length; }
  senColor(s: string) { const m: Record<string,string> = { JUNIOR:'#10B981',PLENO:'#F59E0B',SENIOR:'#EF4444',GESTOR_TECH_LEAD:'#7C3AED' }; return m[s]||'#64748B'; }
  initials(n: string) { const p = n.split(' '); return p.length>=2?(p[0][0]+p[p.length-1][0]).toUpperCase():n.slice(0,2).toUpperCase(); }

  openDrawer(d: Desenvolvedor | null) {
    this.editingId.set(d?.id ?? null);
    this.form = d ? { nome: d.nome, senioridade: d.senioridade, valorHoraCusto: d.valorHoraCusto, valorHoraExtra: d.valorHoraExtra } : this.emptyForm();
    this.drawerOpen.set(true);
  }

  save() {
    if (!this.form.nome.trim()) { this.toast.error('Nome é obrigatório.'); return; }
    this.saving.set(true);
    const id = this.editingId();
    const obs = id ? this.svc.update(id, this.form) : this.svc.create(this.form);
    obs.subscribe({
      next: (d) => {
        if (id) this.devs.update(l => l.map(x => x.id === id ? d : x));
        else this.devs.update(l => [...l, d]);
        this.drawerOpen.set(false); this.saving.set(false);
        this.toast.success(id ? 'Atualizado!' : 'Cadastrado!');
      },
      error: (err) => { this.saving.set(false); this.toast.error(extractErrorMessage(err)); }
    });
  }

  deleteDev() {
    if (!this.confirmDel) return;
    const id = this.confirmDel.id;
    this.svc.delete(id).subscribe({ next: () => { this.devs.update(l => l.filter(d => d.id !== id)); this.toast.success('Removido.'); }, error: (err) => this.toast.error(extractErrorMessage(err)) });
    this.confirmDel = null;
  }

  emptyForm(): DesenvolvedorRequest { return { nome: '', senioridade: 'PLENO', valorHoraCusto: 0, valorHoraExtra: 0 }; }
}
