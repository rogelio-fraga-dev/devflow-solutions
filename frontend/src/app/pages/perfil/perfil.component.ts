import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Meu Perfil</h1>
          <p class="page-subtitle">Gerencie suas informações e credenciais</p>
        </div>
      </div>

      <div class="grid-2">
        <!-- Informações do Usuário -->
        <div class="card">
          <h3 style="margin-bottom: 24px;">Informações Pessoais</h3>
          
          <div style="display: flex; gap: 16px; margin-bottom: 24px; align-items: center;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--purple), #7C3AED); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 24px; font-weight: 700;">
              {{ initials() }}
            </div>
            <div>
              <div style="font-size: 18px; font-weight: 700;">{{ auth.currentUser()?.email?.split('@')?.[0] | titlecase }}</div>
              <div style="color: var(--text-muted); font-size: 13px;">{{ auth.currentUser()?.email }}</div>
              <div style="margin-top: 4px;">
                <span class="chip purple">{{ auth.currentUser()?.role }}</span>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px; border-top: 1px solid var(--border); padding-top: 16px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted)">Empresa Vinculada</span>
              <span style="font-weight: 600;">DevFlow Solutions</span>
            </div>
            @if (auth.currentUser()?.role === 'DESENVOLVEDOR') {
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted)">Senioridade</span>
                <span style="font-weight: 600;">Pleno</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted)">Custo-hora Atual</span>
                <span style="font-weight: 600;">R$ 85,00</span>
              </div>
            }
          </div>
        </div>

        <!-- Alterar Senha -->
        <div class="card">
          <h3 style="margin-bottom: 24px;">Alterar Senha</h3>
          
          <div class="form-group">
            <label class="label">Senha Atual</label>
            <input class="input" type="password" [(ngModel)]="senhaAtual" />
          </div>
          <div class="form-group">
            <label class="label">Nova Senha</label>
            <input class="input" type="password" [(ngModel)]="novaSenha" />
          </div>
          <div class="form-group">
            <label class="label">Confirmar Nova Senha</label>
            <input class="input" type="password" [(ngModel)]="confirmarSenha" />
          </div>
          
          <button class="btn btn-primary" style="margin-top: 8px;" (click)="alterarSenha()">
            Salvar Nova Senha
          </button>
        </div>
      </div>

      <!-- Estatísticas Rápidas -->
      @if (auth.currentUser()?.role === 'DESENVOLVEDOR') {
        <h3 style="margin: 32px 0 16px;">Minhas Estatísticas</h3>
        <div class="grid-3">
          <div class="stat-card">
            <div class="stat-label">Total de Horas Lançadas</div>
            <div class="stat-value">342h</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Projetos Participados</div>
            <div class="stat-value">4</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Custo Gerado</div>
            <div class="stat-value" style="color: var(--purple)">R$ 29.070</div>
          </div>
        </div>
      }
    </div>
  `
})
export class PerfilComponent {
  auth = inject(AuthService);
  toast = inject(ToastService);

  senhaAtual = '';
  novaSenha = '';
  confirmarSenha = '';

  initials(): string {
    const email = this.auth.currentUser()?.email;
    if (!email) return 'U';
    return email.slice(0, 2).toUpperCase();
  }

  alterarSenha() {
    if (!this.senhaAtual || !this.novaSenha || !this.confirmarSenha) {
      this.toast.error('Preencha todos os campos.');
      return;
    }
    if (this.novaSenha !== this.confirmarSenha) {
      this.toast.error('As senhas não coincidem.');
      return;
    }
    this.toast.success('Senha atualizada com sucesso!');
    this.senhaAtual = '';
    this.novaSenha = '';
    this.confirmarSenha = '';
  }
}
