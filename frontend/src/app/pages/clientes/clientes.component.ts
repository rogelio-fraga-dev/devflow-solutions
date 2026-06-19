import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../core/services/cliente.service';
import { ToastService } from '../../core/services/toast.service';
import { Cliente, ClienteRequest } from '../../core/models/cliente.model';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { extractErrorMessage } from '../../core/utils/error.util';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  template: `
    <div class="page">
      <div class="page-header" style="align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 24px; margin-bottom: 32px;">
        <div style="display: flex; gap: 20px; align-items: center;">
          <div style="width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, var(--purple), #7C3AED); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 24px rgba(79,70,229,0.4);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <div>
            <h1 class="page-title" style="margin:0;font-size:32px;letter-spacing:-1px;">Clientes</h1>
            <p class="page-subtitle" style="font-size:15px;margin:0">Base de clientes cadastrados</p>
          </div>
        </div>
        <div style="display:flex;gap:12px;">
          <button class="btn btn-primary" style="padding:10px 20px" (click)="openDrawer(null)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Novo Cliente
          </button>
        </div>
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
            @for (c of paginated(); track c.id) {
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:10px">
                    <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#0EA5E9,#6366F1);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:13px;flex-shrink:0;overflow:hidden">
                      @if (c.foto) {
                        <img [src]="c.foto" style="width:100%;height:100%;object-fit:cover" />
                      } @else {
                        {{ initials(c.razaoSocial) }}
                      }
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
        <div class="modal modal-content" (click)="$event.stopPropagation()" style="border: 1px solid rgba(139, 92, 246, 0.35); width: 700px; max-width: 95vw;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 12px;">
            <h3 style="font-size: 18px; margin: 0; font-family: var(--font_display);">{{ editingId() ? 'Editar Cliente' : 'Novo Cliente' }}</h3>
            <button class="btn btn-ghost" style="padding: 6px; border: none; font-size: 16px;" (click)="drawerOpen.set(false)">✕</button>
          </div>
          
          <div style="display:flex; justify-content:center; margin-bottom: 24px;">
            <div 
              (click)="clientFileInput.click()"
              (dragover)="onDragOver($event)"
              (dragleave)="onDragLeave($event)"
              (drop)="onDrop($event)"
              style="width: 90px; height: 90px; border-radius: 20px; border: 2px dashed rgba(255, 255, 255, 0.15); background: rgba(255, 255, 255, 0.02); display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); cursor: pointer; position: relative; overflow: hidden; transition: all 0.3s ease;"
              [style.transform]="isDragging ? 'scale(1.05)' : 'none'"
              [style.borderColor]="isDragging ? 'var(--purple)' : 'rgba(255, 255, 255, 0.15)'"
            >
              @if (form.foto) {
                <img [src]="form.foto" style="width: 100%; height: 100%; object-fit: cover;" />
                <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: #fff; font-size: 9px; text-align: center; padding: 2px 0;">Alterar</div>
              } @else {
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 4px;">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                <span style="font-size: 10px; text-align: center;">Logo / Foto</span>
              }
            </div>
            <input #clientFileInput type="file" accept="image/*" style="display: none" (change)="onFileSelected($event)" />
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom: 24px;">
            <div class="form-group" style="grid-column: 1 / -1;">
              <label class="label">Razão Social *</label>
              <input class="input" placeholder="Nome ou Razão Social" [(ngModel)]="form.razaoSocial" />
            </div>

            
            <div class="form-group">
              <label class="label">CNPJ</label>
              <input class="input" placeholder="00.000.000/0001-00" [(ngModel)]="form.cnpj" />
            </div>
            
            <div class="form-group">
              <label class="label">Pessoa de Contato</label>
              <input class="input" placeholder="Nome do contato" [(ngModel)]="form.pessoaContato" />
            </div>
            
            <div class="form-group">
              <label class="label">Cidade</label>
              <input class="input" placeholder="São Paulo" [(ngModel)]="form.endereco!.cidade" />
            </div>
            <div class="form-group">
              <label class="label">Estado</label>
              <input class="input" placeholder="SP" [(ngModel)]="form.endereco!.estado" />
            </div>
          </div>
          
          <div style="display:flex; gap:12px; justify-content:flex-end;">
            <button class="btn btn-ghost" style="padding: 10px 20px;" (click)="drawerOpen.set(false)">Cancelar</button>
            <button class="btn btn-primary" style="padding: 10px 24px;" [disabled]="saving()" (click)="save()">{{ saving() ? 'Salvando...' : 'Salvar' }}</button>
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

  currentPage = signal(1);
  pageSize = 10;

  ngOnInit() { this.svc.getAll().subscribe(c => this.clientes.set(c)); }

  filtered() { return this.clientes().filter(c => !this.search || c.razaoSocial.toLowerCase().includes(this.search.toLowerCase())); }
  
  paginated() {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.max(1, Math.ceil(this.filtered().length / this.pageSize));
  }

  nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(v => v + 1); }
  prevPage() { if (this.currentPage() > 1) this.currentPage.update(v => v - 1); }

  initials(n: string) { const p = n.split(' '); return p.length>=2?(p[0][0]+p[p.length-1][0]).toUpperCase():n.slice(0,2).toUpperCase(); }

  openDrawer(c: Cliente | null) {
    this.editingId.set(c?.id ?? null);
    this.form = c ? { razaoSocial: c.razaoSocial, cnpj: c.cnpj, pessoaContato: c.pessoaContato, endereco: { ...c.endereco }, foto: c.foto } : this.emptyForm();
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
      error: (err) => { this.saving.set(false); this.toast.error(extractErrorMessage(err)); }
    });
  }

  deleteCli() {
    if (!this.confirmDel) return;
    const id = this.confirmDel.id;
    this.svc.delete(id).subscribe({ next: () => { this.clientes.update(l => l.filter(c => c.id !== id)); this.toast.success('Removido.'); }, error: (err) => this.toast.error(extractErrorMessage(err)) });
    this.confirmDel = null;
  }

  isDragging = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        this.readClientPhoto(file);
      } else {
        this.toast.error('Por favor, envie apenas arquivos de imagem.');
      }
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.readClientPhoto(event.target.files[0]);
    }
  }

  readClientPhoto(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.form.foto = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  emptyForm(): ClienteRequest { return { razaoSocial: '', cnpj: '', pessoaContato: '', endereco: { logradouro:'', cidade:'', estado:'', cep:'' }, foto: '' }; }
}

