import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { DesenvolvedorService } from '../../core/services/desenvolvedor.service';
import { ToastService } from '../../core/services/toast.service';
import { extractErrorMessage } from '../../core/utils/error.util';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page" style="position: relative; min-height: 90vh; overflow: hidden; padding-bottom: 48px;">
      <!-- Ambient light flows inside profile page -->
      <div style="position: absolute; width: 350px; height: 350px; border-radius: 50%; background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%); top: -50px; right: -50px; pointer-events: none; z-index: 0;"></div>
      <div style="position: absolute; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%); bottom: -100px; left: -100px; pointer-events: none; z-index: 0;"></div>

      <div style="position: relative; z-index: 1;">
        <!-- Header com Identidade visual de alta costura tecnológica -->
        <div class="page-header" style="align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 24px; margin-bottom: 32px;">
          <div style="display: flex; gap: 20px; align-items: center;">
            <div style="width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, var(--purple), #7C3AED); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 28px rgba(139,92,246,0.4); border: 1px solid rgba(255,255,255,0.1);">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <h1 class="page-title" style="margin:0;font-size:32px;letter-spacing:-1px; background: linear-gradient(180deg, #FFFFFF, rgba(255,255,255,0.85)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Meu Perfil</h1>
              <p class="page-subtitle" style="font-size:15px;margin:0; color: var(--text-muted)">Gerencie seu cockpit operacional, informações e segurança</p>
            </div>
          </div>
        </div>

        <div class="grid-2" style="margin-bottom: 32px;">
          <!-- Informações do Usuário (Glassmorphism Premium) -->
          <div class="card card-premium glow-indigo" style="margin: 0; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event)"
            [style.transform]="isDragging ? 'scale(1.02)' : 'none'"
            [style.borderColor]="isDragging ? 'var(--purple)' : 'rgba(255,255,255,0.08)'"
            [style.transition]="'all 0.3s ease'"
          >
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px;">
                <h3 style="margin: 0; font-size: 18px; letter-spacing: -0.5px; font-family: var(--font_display);">Credenciais e Acesso</h3>
                <span class="chip-premium purple">
                  <span class="dot-ping"></span>
                  {{ auth.currentUser()?.role }}
                </span>
              </div>
              
              <div style="display: flex; gap: 20px; margin-bottom: 32px; align-items: center;">
                <!-- Avatar Circular Premium com Aura Neon -->
                <div 
                  (click)="fileInput.click()"
                  style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--purple), #7C3AED); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 28px; font-weight: 800; box-shadow: 0 0 20px rgba(139, 92, 246, 0.45); border: 2.5px solid rgba(255, 255, 255, 0.15); transition: all 0.3s ease; cursor: pointer; position: relative; overflow: hidden; transform: translateZ(0); isolation: isolate;"
                >
                  @if (auth.userPhoto()) {
                    <img [src]="auth.userPhoto()" style="width: 100%; height: 100%; object-fit: cover;" />
                  } @else {
                    {{ initials() }}
                  }
                  
                  <!-- Hover overlay for uploading -->
                  <div class="avatar-overlay" style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.75); padding: 3px 0 4px 0; font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; border-radius: 0 0 40px 40px;">Trocar</div>
                </div>
                <input #fileInput type="file" accept="image/*" style="display: none" (change)="onFileSelected($event)" />
                <div style="flex: 1;">
                  @if (isEditingProfile) {
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                      <input class="input input-premium" [(ngModel)]="editNome" placeholder="Nome" style="font-size: 16px; padding: 6px 12px; border-radius: 6px;" />
                      <input class="input input-premium" [(ngModel)]="editEmail" placeholder="Email" style="font-size: 15px; padding: 6px 12px; border-radius: 6px;" />
                      <div style="display: flex; gap: 8px; margin-top: 4px;">
                        <button class="btn btn-primary" style="padding: 4px 12px; font-size: 12px;" (click)="saveProfile()">Salvar</button>
                        <button class="btn btn-ghost" style="padding: 4px 12px; font-size: 12px;" (click)="isEditingProfile = false">Cancelar</button>
                      </div>
                    </div>
                  } @else {
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <h2 style="margin: 0; font-size: 22px; font-family: var(--font_display);">{{ auth.currentUser()?.nome || (auth.currentUser()?.email?.split('@')?.[0] | titlecase) }}</h2>
                      <button class="btn btn-ghost" style="padding: 4px; border: none; color: var(--text-muted);" (click)="startEditProfile()" title="Editar Perfil">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      </button>
                    </div>
                    <p style="margin: 0; color: var(--text-muted); font-size: 15px;">{{ auth.currentUser()?.email }}</p>
                    <div style="margin-top: 8px;">
                      <span class="chip-premium">CONTA ATIVA</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Lista de Informações com Translucidez e Delimitações Claras -->
              <div style="display: flex; flex-direction: column; gap: 14px; border-top: 1px solid var(--border); padding-top: 20px;">
                <div style="display: flex; justify-content: space-between; font-size: 15px;">
                  <span style="color: var(--text-secondary);">Organização Corporativa</span>
                  <span style="font-weight: 600; color: #fff;">{{ auth.currentUser()?.empresa || 'DevFlow Solutions' }}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 15px;">
                  <span style="color: var(--text-secondary);">Nível de Permissão</span>
                  <span style="font-weight: 600; color: var(--color_accent_purple);">{{ auth.currentUser()?.role === 'ADMIN' ? 'Acesso Total' : (auth.currentUser()?.role === 'GESTOR' ? 'Gestor Portfólio' : 'Desenvolvedor') }}</span>
                </div>
                @if (auth.currentUser()?.role === 'DESENVOLVEDOR') {
                  <div style="display: flex; justify-content: space-between; font-size: 15px;">
                    <span style="color: var(--text-secondary);">Senioridade Cadastrada</span>
                    <span style="font-weight: 600; color: #fff;">{{ devStats?.senioridade || 'Pleno' }}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 15px;">
                    <span style="color: var(--text-secondary);">Faturamento Custo/Hora</span>
                    <span style="font-weight: 600; color: #10B981;">Definido pelo gestor</span>
                  </div>
                }
              </div>
            </div>
            
            <div style="margin-top: 24px; padding: 12px; background: rgba(255,255,255,0.01); border-radius: 8px; border: 1px solid var(--border); font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--purple-dark);"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span>Seus dados são protegidos por criptografia de ponta no banco DevFlow.</span>
            </div>
          </div>

          <!-- Alterar Senha (Glassmorphism Premium) -->
          <div class="card card-premium glow-indigo" style="margin: 0; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="margin-bottom: 24px; font-size: 18px; letter-spacing: -0.5px; font-family: var(--font_display);">Segurança da Conta</h3>
              
              <div class="form-group">
                <label class="label" style="font-size: 11px;">Senha Atual</label>
                <input class="input input-premium w-full" type="password" placeholder="••••••••" [(ngModel)]="senhaAtual" />
              </div>
              <div class="form-group" style="margin-top: 14px;">
                <label class="label" style="font-size: 11px;">Nova Senha</label>
                <input class="input input-premium w-full" type="password" placeholder="Mínimo 6 caracteres" [(ngModel)]="novaSenha" />
              </div>
              <div class="form-group" style="margin-top: 14px;">
                <label class="label" style="font-size: 11px;">Confirmar Nova Senha</label>
                <input class="input input-premium w-full" type="password" placeholder="Repita a nova senha" [(ngModel)]="confirmarSenha" />
              </div>
            </div>
            
            <button class="btn btn-primary w-full" style="margin-top: 24px; padding: 12px; font-weight: 700; border-radius: 8px; font-size: 15px;" (click)="alterarSenha()">
              Atualizar Credenciais
            </button>
          </div>
        </div>

        <!-- Estatísticas Rápidas (Glow Up Especial para Devs) -->
        @if (auth.currentUser()?.role === 'DESENVOLVEDOR') {
          <div style="margin-top: 36px;">
            <h3 style="margin-bottom: 20px; font-size: 18px; letter-spacing: -0.5px; font-family: var(--font_display); display: flex; align-items: center; gap: 8px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--purple-dark);"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Cockpit do Desenvolvedor — Visão Consolidada
            </h3>
            <div class="grid-3">
              <div class="card card-premium glow-indigo" style="margin: 0; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700;">Total de Horas Trabalhadas</span>
                  <div style="font-size: 32px; font-weight: 800; color: #fff; margin-top: 6px; font-family: var(--font_display);">{{ (devStats?.totalHorasLancadas || 0) + (devStats?.totalHorasExtras || 0) }}h</div>
                </div>
                <div style="background: rgba(99, 102, 241, 0.1); padding: 12px; border-radius: 12px; color: #6366F1;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
              </div>
              
              <div class="card card-premium glow-indigo" style="margin: 0; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700;">Sprints Participados</span>
                  <div style="font-size: 32px; font-weight: 800; color: #fff; margin-top: 6px; font-family: var(--font_display);">{{ devStats?.totalSprintsParticipados || 0 }}</div>
                </div>
                <div style="background: rgba(139, 92, 246, 0.1); padding: 12px; border-radius: 12px; color: #8B5CF6;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                </div>
              </div>
              
              <div class="card card-premium glow-indigo" style="margin: 0; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700;">Custo Acumulado Gerado</span>
                  <div style="font-size: 32px; font-weight: 800; color: #10B981; margin-top: 6px; font-family: var(--font_display);">{{ (devStats?.custoTotalGerado || 0) | currency:'BRL':'symbol':'1.0-0' }}</div>
                </div>
                <div style="background: rgba(16, 185, 129, 0.1); padding: 12px; border-radius: 12px; color: #10B981;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class PerfilComponent implements OnInit {
  auth = inject(AuthService);
  usuarioService = inject(UsuarioService);
  devService = inject(DesenvolvedorService);
  toast = inject(ToastService);

  senhaAtual = '';
  novaSenha = '';
  confirmarSenha = '';
  loading = false;
  devStats: any = null;
  isDragging = false;
  isEditingProfile = false;
  editNome = '';
  editEmail = '';

  startEditProfile() {
    this.isEditingProfile = true;
    this.editNome = this.auth.currentUser()?.nome || '';
    this.editEmail = this.auth.currentUser()?.email || '';
  }

  saveProfile() {
    if (!this.editNome || !this.editEmail) {
      this.toast.error('Nome e E-mail são obrigatórios.');
      return;
    }
    this.loading = true;
    this.usuarioService.updateProfile({ nome: this.editNome, email: this.editEmail }).subscribe({
      next: (user) => {
        this.loading = false;
        this.isEditingProfile = false;
        const current = this.auth.currentUser();
        if (current) {
          const updated = { ...current, nome: user.nome, email: user.email };
          this.auth.currentUser.set(updated);
        }
        this.toast.success('Perfil atualizado com sucesso!');
      },
      error: (err) => {
        this.loading = false;
        this.toast.error(extractErrorMessage(err) || 'Erro ao atualizar perfil.');
      }
    });
  }

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
        this.uploadPhoto(file);
      } else {
        this.toast.error('Por favor, envie apenas arquivos de imagem.');
      }
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.uploadPhoto(event.target.files[0]);
    }
  }

  uploadPhoto(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.usuarioService.updateMyFoto(base64).subscribe({
        next: () => {
          this.auth.userPhoto.set(base64);
          this.toast.success('Foto de perfil atualizada com sucesso!');
        },
        error: (err) => {
          this.toast.error(extractErrorMessage(err) || 'Erro ao carregar a foto.');
        }
      });
    };
    reader.readAsDataURL(file);
  }


  ngOnInit() {
    if (this.auth.currentUser()?.role === 'DESENVOLVEDOR') {
      this.devService.getMinhaProdutividade().subscribe({
        next: (stats) => this.devStats = stats,
        error: (err) => console.error('Erro ao buscar stats do dev', err)
      });
    }
  }

  initials(): string {
    const nome = this.auth.currentUser()?.nome;
    if (nome) return nome.substring(0, 2).toUpperCase();
    const email = this.auth.currentUser()?.email;
    if (!email) return 'U';
    return email.slice(0, 2).toUpperCase();
  }

  alterarSenha() {
    if (!this.senhaAtual || !this.novaSenha || !this.confirmarSenha) {
      this.toast.error('Preencha todos os campos do formulário de segurança.');
      return;
    }
    if (this.novaSenha !== this.confirmarSenha) {
      this.toast.error('A confirmação da nova senha não confere.');
      return;
    }

    this.loading = true;
    this.usuarioService.alterarSenha({
      senhaAtual: this.senhaAtual,
      novaSenha: this.novaSenha
    }).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success('Senha atualizada com sucesso!');
        this.senhaAtual = '';
        this.novaSenha = '';
        this.confirmarSenha = '';
      },
      error: (err) => {
        this.loading = false;
        this.toast.error(extractErrorMessage(err) || 'Erro ao alterar a senha');
      }
    });
  }
}
