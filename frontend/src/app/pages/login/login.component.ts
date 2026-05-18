import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-page" style="display: flex; height: 100vh; overflow: hidden; background-color: var(--color_main_bg);">
      <!-- Left: form -->
      <div class="login-left" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; background: #000; position: relative;">
        <button class="back-btn" routerLink="/" style="position: absolute; top: 24px; left: 24px; display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary); background: transparent; border: none; cursor: pointer; font-family: inherit;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Voltar ao início
        </button>

        <div class="login-form-container card" style="width: 100%; max-width: 400px; padding: 40px; border-color: rgba(79,70,229,0.3); box-shadow: 0 0 60px -20px rgba(79,70,229,0.3), inset 0 1px 0 rgba(255,255,255,0.06);">
          <div style="margin-bottom:32px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
              <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,var(--color_accent_deep_purple),var(--color_accent_purple));display:flex;align-items:center;justify-content:center;color:#000;font-weight:800;font-size:14px">D</div>
              <span style="font-weight:800;font-size:15px; color:#fff;">DevFlow</span>
            </div>
          </div>

          <h1 class="login-greeting" style="font-family: var(--font_display); font-size: 32px; font-weight: 700; color: #fff; margin-bottom: 8px;">Acesse a Plataforma</h1>
          <p class="login-subtitle" style="font-family: var(--font_text); font-size: 14px; color: var(--text-secondary); margin-bottom: 32px;">Gerenciamento financeiro B2B seguro e integrado.</p>

          @if (error()) {
            <div style="background:rgba(239, 68, 68, 0.1);border:1px solid rgba(239, 68, 68, 0.3);border-radius:8px;padding:12px 16px;font-size:13px;color:#EF4444;margin-bottom:24px">
              {{ error() }}
            </div>
          }

          <div class="login-field" style="position: relative; margin-bottom: 16px;">
            <span class="field-icon" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; display: flex;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <input type="email" placeholder="email@suaempresa.com" [(ngModel)]="email" (keyup.enter)="submit()" style="width: 100%; padding: 14px 16px 14px 44px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: var(--radius-sm); color: #fff; font-size: 15px; outline: none; transition: all 0.3s ease;"/>
          </div>

          <div class="login-field" style="position: relative; margin-bottom: 24px;">
            <span class="field-icon" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; display: flex;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input [type]="showPass() ? 'text' : 'password'" placeholder="Sua senha corporativa" [(ngModel)]="password" (keyup.enter)="submit()" style="width: 100%; padding: 14px 16px 14px 44px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: var(--radius-sm); color: #fff; font-size: 15px; outline: none; transition: all 0.3s ease;"/>
            <button class="eye-btn" type="button" (click)="showPass.set(!showPass())" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: var(--text-muted); cursor: pointer; display: flex; padding: 4px;">
              @if (showPass()) {
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              } @else {
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              }
            </button>
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;font-size:13px">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;color:var(--text-secondary)">
              <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--color_accent_purple); cursor: pointer;" /> Lembrar credenciais
            </label>
            <a href="#" style="color:var(--color_accent_purple);text-decoration:none; font-weight: 600;">Esqueceu a senha?</a>
          </div>

          <button class="btn btn-primary" style="width: 100%; justify-content: center; padding: 15px; font-size: 15px; background: linear-gradient(135deg, #4F46E5, #7C3AED); box-shadow: 0 4px 24px rgba(79,70,229,0.4); letter-spacing: 0.01em;" [disabled]="loading()" (click)="submit()">
            {{ loading() ? 'Autenticando...' : 'Entrar no Sistema' }}
          </button>
        </div>
      </div>

      <!-- Right: decorative space theme -->
      <div class="login-right">
        <div style="position: relative; z-index: 2; text-align: center;">
          <h2 style="font-family: var(--font_display); font-size: 36px; margin-bottom: 16px; line-height: 1.1;">Controle Absoluto.</h2>
          <p style="font-family: var(--font_text); font-size: 16px; color: rgba(255,255,255,0.8); line-height: 1.6; margin-bottom: 40px;">Seu budget em tempo real. Sem surpresas no fim do mês.</p>
          
          <div class="right-stats" style="grid-template-columns: repeat(2, 1fr);">
            @for (s of stats; track s.label) {
              <div class="stat">
                <div class="stat-val" style="font-size: 24px; font-family: var(--font_display); margin-bottom: 4px;">{{ s.value }}</div>
                <div class="stat-lbl">{{ s.label }}</div>
              </div>
            }
          </div>

          <div class="right-badges">
            @for (b of badges; track b) {
              <div class="right-badge"><span>{{ b }}</span></div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email    = '';
  password = '';
  showPass = signal(false);
  loading  = signal(false);
  error    = signal('');

  stats  = [
    { value: '4+',    label: 'Projetos' },
    { value: '6+',    label: 'Sprints' },
    { value: 'R$1,2M', label: 'Gerenciado' },
    { value: '100%', label: 'Controle' }
  ];

  badges = ['🔒 Acesso seguro corporativo', '✅ Dados criptografados'];

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    if (!this.email || !this.password) {
      this.error.set('Por favor, informe suas credenciais de acesso corporativo.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.auth.login({ email: this.email, senha: this.password }).subscribe({
      next: () => this.router.navigate(['/app/projetos']),
      error: () => {
        this.error.set('Credenciais inválidas. Verifique os dados e tente novamente.');
        this.loading.set(false);
      }
    });
  }
}
