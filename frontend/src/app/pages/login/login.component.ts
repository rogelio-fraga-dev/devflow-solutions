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
    <div class="login-page">
      <!-- Left: form -->
      <div class="login-left">
        <button class="back-btn" routerLink="/">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Voltar ao início
        </button>

        <div class="login-form-container">
          <div style="margin-bottom:24px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
              <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#6366F1,#7C3AED);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:14px">D</div>
              <span style="font-weight:800;font-size:15px">DevFlow</span>
            </div>
          </div>

          <h1 class="login-greeting">Olá! 👋</h1>
          <p class="login-subtitle">Entre na sua conta para continuar</p>

          @if (error()) {
            <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:10px 14px;font-size:13px;color:#EF4444;margin-bottom:16px">
              {{ error() }}
            </div>
          }

          <div class="login-field">
            <span class="field-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <input type="email" placeholder="email@empresa.com" [(ngModel)]="email" (keyup.enter)="submit()" />
          </div>

          <div class="login-field">
            <span class="field-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input [type]="showPass() ? 'text' : 'password'" placeholder="Sua senha" [(ngModel)]="password" (keyup.enter)="submit()" />
            <button class="eye-btn" type="button" (click)="showPass.set(!showPass())">
              @if (showPass()) {
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              } @else {
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              }
            </button>
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;font-size:13px">
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;color:var(--text-secondary)">
              <input type="checkbox" /> Lembrar de mim
            </label>
            <a href="#" style="color:var(--purple);text-decoration:none">Esqueceu a senha?</a>
          </div>

          <button class="login-submit" [disabled]="loading()" (click)="submit()">
            {{ loading() ? 'Entrando...' : 'Entrar' }}
          </button>
        </div>
      </div>

      <!-- Right: decorative -->
      <div class="login-right">
        <div class="right-logo-mark">D</div>
        <h2>Bem-vindo de volta!</h2>
        <p>Gerencie projetos, sprints e custos com precisão e eficiência.</p>
        <div class="right-stats">
          @for (s of stats; track s.label) {
            <div class="stat">
              <div class="stat-val">{{ s.value }}</div>
              <div class="stat-lbl">{{ s.label }}</div>
            </div>
          }
        </div>
        <div style="margin-top:24px;display:flex;flex-direction:column;gap:8px;width:100%;position:relative">
          @for (b of badges; track b) {
            <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:rgba(255,255,255,.7)">
              <span>{{ b }}</span>
            </div>
          }
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
  ];

  badges = ['🔒 Acesso seguro com JWT', '✅ Dados criptografados', '⚡ Disponibilidade 99,9%'];

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    if (!this.email || !this.password) {
      this.error.set('Preencha e-mail e senha.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.auth.login({ email: this.email, senha: this.password }).subscribe({
      next: () => this.router.navigate(['/app/projetos']),
      error: () => {
        this.error.set('E-mail ou senha incorretos.');
        this.loading.set(false);
      }
    });
  }
}
