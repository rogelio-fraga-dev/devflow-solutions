import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../core/services/cliente.service';
import { ToastService } from '../../core/services/toast.service';
import { Cliente, ClienteRequest } from '../../core/models/cliente.model';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Clientes</h1>
          <p class="page-subtitle">Base de clientes cadastrados</p>
        </div>
        <button class="btn btn-primary" (click)="openDrawer(null)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Novo Cliente
        </button>
      </div>

      <div class="card" style="margin-bottom:20px">
        <div style="display:flex;gap:12px;align-items:center">
          <div style="position:relative;flex:1">
            <svg style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input class="input" style="padding-left:36px" placeholder="Buscar cliente ou razão social..." [(ngModel)]="search" />
          </div>
          <span style="font-size:13px;color:var(--text-muted)">{{ filtered().length }} cliente(s)</span>
        </div>
      </div>

      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Razão Social</th>
              <th>CNPJ</th>
              <th>Contato</th>
              <th>Cidade</th>
              <th style="text-align:right">Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (c of filtered(); track c.id) {
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:10px">
                    <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#0EA5E9,#6366F1);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:13px;flex-shrink:0">
                      {{ initials(c.razaoSocial) }}
                    </div>
                    <span style="font-weight:600">{{ c.razaoSocial }}</span>
                  </div>
                </td>
                <td style="color:var(--text-muted)">{{ c.cnpj || '—' }}</td>
                <td style="color:var(--text-muted)">{{ c.pessoaContato || '—' }}</td>
                <td style="color:var(--text-muted)">{{ c.endereco?.cidade || '—' }}</td>
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
              <tr><td colspan="5"><div class="empty-state"><p>Nenhum cliente encontrado</p></div></td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    @if (drawerOpen()) {
      <div class="drawer-overlay" (click)="drawerOpen.set(false)"></div>
      <div class="drawer">
        <div class="drawer-header">
          <h3>{{ editingId() ? 'Editar Cliente' : 'Novo Cliente' }}</h3>
          <button class="btn btn-ghost" style="padding:6px" (click)="drawerOpen.set(false)">✕</button>
        </div>
        <div class="drawer-body">
          <div class="form-group"><label class="label">Razão Social *</label><input class="input" placeholder="Nome ou Razão Social" [(ngModel)]="form.razaoSocial" /></div>
          <div class="form-group"><label class="label">CNPJ</label><input class="input" placeholder="00.000.000/0001-00" [(ngModel)]="form.cnpj" /></div>
          <div class="form-group"><label class="label">Pessoa de Contato</label><input class="input" placeholder="Nome do contato" [(ngModel)]="form.pessoaContato" /></div>
          <div class="form-row">
            <div class="form-group"><label class="label">Cidade</label><input class="input" placeholder="São Paulo" [(ngModel)]="form.endereco!.cidade" /></div>
            <div class="form-group"><label class="label">Estado</label><input class="input" placeholder="SP" [(ngModel)]="form.endereco!.estado" /></div>
          </div>
          <div style="display:flex;gap:10px;margin-top:8px">
            <button class="btn btn-ghost" style="flex:1" (click)="drawerOpen.set(false)">Cancelar</button>
            <button class="btn btn-primary" style="flex:1" [disabled]="saving()" (click)="save()">{{ saving() ? 'Salvando...' : 'Salvar' }}</button>
          </div>
        </div>
      </div>
    }

    <app-confirm-modal [open]="!!confirmDel" title="Remover Cliente" [message]="'Remover &quot;' + (confirmDel?.razaoSocial||'') + '&quot;?'" confirmLabel="Remover" (confirm)="deleteCli()" (cancel)="confirmDel = null" />
  `
})
export class ClientesComponent implements OnInit {
  private svc   = inject(ClienteService);
  private toast = inject(ToastService);

  clientes   = signal<Cliente[]>([]);
  saving     = signal(false);
  drawerOpen = signal(false);
  editingId  = signal<number|null>(null);
  confirmDel: Cliente | null = null;
  search = '';
  form: ClienteRequest = this.emptyForm();

  ngOnInit() { this.svc.getAll().subscribe(c => this.clientes.set(c)); }

  filtered() { return this.clientes().filter(c => !this.search || c.razaoSocial.toLowerCase().includes(this.search.toLowerCase())); }
  initials(n: string) { const p = n.split(' '); return p.length>=2?(p[0][0]+p[p.length-1][0]).toUpperCase():n.slice(0,2).toUpperCase(); }

  openDrawer(c: Cliente | null) {
    this.editingId.set(c?.id ?? null);
    this.form = c ? { razaoSocial: c.razaoSocial, cnpj: c.cnpj, pessoaContato: c.pessoaContato, endereco: { ...c.endereco } } : this.emptyForm();
    this.drawerOpen.set(true);
  }

  save() {
    if (!this.form.razaoSocial.trim()) { this.toast.error('Razão social é obrigatória.'); return; }
    this.saving.set(true);
    const id = this.editingId();
    const obs = id ? this.svc.update(id, this.form) : this.svc.create(this.form);
    obs.subscribe({
      next: (c) => {
        if (id) this.clientes.update(l => l.map(x => x.id === id ? c : x));
        else this.clientes.update(l => [...l, c]);
        this.drawerOpen.set(false); this.saving.set(false);
        this.toast.success(id ? 'Cliente atualizado!' : 'Cliente cadastrado!');
      },
      error: () => { this.saving.set(false); this.toast.error('Erro ao salvar.'); }
    });
  }

  deleteCli() {
    if (!this.confirmDel) return;
    const id = this.confirmDel.id;
    this.svc.delete(id).subscribe({ next: () => { this.clientes.update(l => l.filter(c => c.id !== id)); this.toast.success('Removido.'); }, error: () => this.toast.error('Erro.') });
    this.confirmDel = null;
  }

  emptyForm(): ClienteRequest { return { razaoSocial: '', cnpj: '', pessoaContato: '', endereco: { logradouro:'', cidade:'', estado:'', cep:'' } }; }
}
