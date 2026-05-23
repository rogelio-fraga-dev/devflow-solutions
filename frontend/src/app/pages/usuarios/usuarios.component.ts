import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { ToastService } from '../../core/services/toast.service';
import { Usuario, UsuarioRequest, Role } from '../../core/models/usuario.model';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { extractErrorMessage } from '../../core/utils/error.util';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  template: `
    <div class="page">
      <div class="page-header" style="align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 24px; margin-bottom: 32px;">
        <div style="display: flex; gap: 20px; align-items: center;">
          <div style="width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, var(--purple), #7C3AED); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 24px rgba(79,70,229,0.4);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <h1 class="page-title" style="margin:0;font-size:32px;letter-spacing:-1px;">Usuários</h1>
            <p class="page-subtitle" style="font-size:15px;margin:0">Gerenciamento de acesso ao sistema</p>
          </div>
        </div>
        <div style="display:flex;gap:12px;">
          <button class="btn btn-primary" style="padding:10px 20px" (click)="openDrawer(null)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Novo Usuário
          </button>
        </div>
      </div>

      <div class="card" style="margin-bottom:20px">
        <div style="display:flex;gap:12px;align-items:center">
          <div style="position:relative;flex:1">
            <svg style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input class="input" style="padding-left:36px" placeholder="Buscar usuário..." [(ngModel)]="search" />
          </div>
          <span style="font-size:13px;color:var(--text-muted)">{{ filtered().length }} usuário(s)</span>
        </div>
      </div>

      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Status</th>
              <th style="text-align:right">Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (u of paginated(); track u.id) {
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:10px">
                    <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--purple),#7C3AED);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:13px;flex-shrink:0">
                      {{ initials(u.nome) }}
                    </div>
                    <span style="font-weight:600">{{ u.nome }}</span>
                  </div>
                </td>
                <td style="color:var(--text-muted)">{{ u.email }}</td>
                <td>
                  <span style="padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;background:{{ roleColor(u.role) }}20;color:{{ roleColor(u.role) }}">
                    {{ u.role }}
                  </span>
                </td>
                <td><span class="chip {{ u.ativo ? 'success' : 'error' }}">{{ u.ativo ? 'Ativo' : 'Inativo' }}</span></td>
                <td>
                  <div style="display:flex;gap:6px;justify-content:flex-end">
                    <button class="btn btn-ghost" style="padding:6px 10px" (click)="openDrawer(u)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn btn-ghost" style="padding:6px 10px;color:#EF4444" (click)="confirmDel = u">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            }
            @empty {
              <tr><td colspan="5"><div class="empty-state"><p>Nenhum usuário encontrado</p></div></td></tr>
            }
          </tbody>
        </table>
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

    <!-- Centered Premium Modal -->
    @if (drawerOpen()) {
      <div class="modal-overlay" (click)="drawerOpen.set(false)">
        <div class="modal modal-content" (click)="$event.stopPropagation()" style="border: 1px solid rgba(139, 92, 246, 0.35); width: 460px; max-width: 95vw;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 12px;">
            <h3 style="font-size: 18px; margin: 0; font-family: var(--font_display);">{{ editingId() ? 'Editar Usuário' : 'Novo Usuário' }}</h3>
            <button class="btn btn-ghost" style="padding: 6px; border: none; font-size: 16px;" (click)="drawerOpen.set(false)">✕</button>
          </div>
          
          <div style="display:flex; flex-direction:column; gap:16px; margin-bottom: 24px;">
            <div class="form-group">
              <label class="label">Nome *</label>
              <input class="input" placeholder="Nome completo" [(ngModel)]="form.nome" />
            </div>
            
            <div class="form-group">
              <label class="label">E-mail *</label>
              <input class="input" type="email" placeholder="email@empresa.com" [(ngModel)]="form.email" />
            </div>
            
            @if (!editingId()) {
              <div class="form-group">
                <label class="label">Senha *</label>
                <input class="input" type="password" placeholder="Mínimo 6 caracteres" [(ngModel)]="form.senha" />
              </div>
            }
            
            <div class="form-group">
              <label class="label">Perfil</label>
              <select class="select" [(ngModel)]="form.role">
                @for (r of roles; track r) { <option [value]="r">{{ r }}</option> }
              </select>
            </div>
            
            <div style="display:flex;align-items:center;gap:8px;">
              <input type="checkbox" id="u-ativo" [(ngModel)]="form.ativo" />
              <label for="u-ativo" style="font-size:13px;cursor:pointer">Usuário ativo</label>
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
      title="Remover Usuário"
      [message]="'Remover &quot;' + (confirmDel?.nome || '') + '&quot;?'"
      confirmLabel="Remover"
      (confirm)="deleteUser()"
      (cancel)="confirmDel = null"
    />
  `
})
export class UsuariosComponent implements OnInit {
  private svc   = inject(UsuarioService);
  private toast = inject(ToastService);

  usuarios   = signal<Usuario[]>([]);
  saving     = signal(false);
  drawerOpen = signal(false);
  editingId  = signal<number|null>(null);
  confirmDel: Usuario | null = null;
  search = '';
  roles: Role[] = ['ADMIN','GESTOR','DESENVOLVEDOR','CLIENTE'];
  form: UsuarioRequest = this.emptyForm();

  currentPage = signal(1);
  pageSize = 10;

  ngOnInit() { this.svc.getAll().subscribe(u => this.usuarios.set(u)); }

  filtered() { return this.usuarios().filter(u => !this.search || u.nome.toLowerCase().includes(this.search.toLowerCase()) || u.email.toLowerCase().includes(this.search.toLowerCase())); }
  
  paginated() {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.max(1, Math.ceil(this.filtered().length / this.pageSize));
  }

  nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(v => v + 1); }
  prevPage() { if (this.currentPage() > 1) this.currentPage.update(v => v - 1); }

  initials(nome: string) { const p = nome.split(' '); return p.length >= 2 ? (p[0][0]+p[p.length-1][0]).toUpperCase() : nome.slice(0,2).toUpperCase(); }

  roleColor(r: Role) { return { ADMIN: 'var(--purple)', GESTOR: '#0EA5E9', DESENVOLVEDOR: '#10B981', CLIENTE: '#F59E0B' }[r] || '#64748B'; }

  openDrawer(u: Usuario | null) {
    this.editingId.set(u?.id ?? null);
    this.form = u ? { nome: u.nome, email: u.email, role: u.role, ativo: u.ativo } : this.emptyForm();
    this.drawerOpen.set(true);
  }

  save() {
    if (!this.form.nome.trim() || !this.form.email.trim()) { this.toast.error('Nome e e-mail são obrigatórios.'); return; }
    this.saving.set(true);
    const id = this.editingId();
    const obs = id ? this.svc.update(id, this.form) : this.svc.create(this.form);
    obs.subscribe({
      next: (u) => {
        if (id) this.usuarios.update(l => l.map(x => x.id === id ? u : x));
        else this.usuarios.update(l => [...l, u]);
        this.drawerOpen.set(false); this.saving.set(false);
        this.toast.success(id ? 'Usuário atualizado!' : 'Usuário criado!');
      },
      error: (err) => { this.saving.set(false); this.toast.error(extractErrorMessage(err)); }
    });
  }

  deleteUser() {
    if (!this.confirmDel) return;
    const id = this.confirmDel.id;
    this.svc.delete(id).subscribe({
      next: () => { this.usuarios.update(l => l.filter(u => u.id !== id)); this.toast.success('Usuário removido.'); },
      error: (err) => this.toast.error(extractErrorMessage(err))
    });
    this.confirmDel = null;
  }

  emptyForm(): UsuarioRequest { return { nome: '', email: '', senha: '', role: 'GESTOR', ativo: true }; }
}
