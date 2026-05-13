import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { extractErrorMessage } from '../../core/utils/error.util';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-left" style="background: var(--bg-page); padding: 40px; display: flex; align-items: center; justify-content: center;">
        <div class="card" style="width: 100%; max-width: 480px; padding: 40px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div class="logo-mark" style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, var(--purple), #7C3AED); display: inline-flex; align-items: center; justify-content: center; color: #fff; font-size: 24px; font-weight: 800; margin-bottom: 16px;">D</div>
            <h1 style="font-size: 24px; margin-bottom: 8px;">Criar sua conta</h1>
            <p style="color: var(--text-muted); font-size: 14px;">Comece a gerenciar seus projetos B2B agora.</p>
          </div>

          <!-- Step Indicators -->
          <div style="display: flex; gap: 8px; margin-bottom: 32px;">
            <div style="flex: 1; height: 4px; border-radius: 4px; background: var(--purple);"></div>
            <div style="flex: 1; height: 4px; border-radius: 4px;" [style.background]="step() === 2 ? 'var(--purple)' : 'var(--border)'"></div>
          </div>

          @if (step() === 1) {
            <form [formGroup]="empresaForm" (ngSubmit)="avancar()">
              <h3 style="margin-bottom: 24px;">Dados da Empresa</h3>
              
              <div class="form-group">
                <label class="label">Razão Social / Nome Fantasia *</label>
                <input class="input" type="text" formControlName="nomeFantasia" placeholder="Sua Empresa Tech" />
              </div>

              <div class="form-group">
                <label class="label">CNPJ *</label>
                <input class="input" type="text" formControlName="cnpj" placeholder="00.000.000/0000-00" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="label">Cidade (Opcional)</label>
                  <input class="input" type="text" formControlName="cidade" placeholder="São Paulo" />
                </div>
                <div class="form-group">
                  <label class="label">Estado (Opcional)</label>
                  <input class="input" type="text" formControlName="estado" placeholder="SP" />
                </div>
              </div>

              <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 16px;" [disabled]="empresaForm.invalid">
                Continuar
              </button>
            </form>
          }

          @if (step() === 2) {
            <form [formGroup]="adminForm" (ngSubmit)="registrar()">
              <h3 style="margin-bottom: 8px;">Dados do Administrador</h3>
              <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 24px;">Ao se registrar, você será o ADMIN da empresa.</p>
              
              <div class="form-group">
                <label class="label">Nome completo *</label>
                <input class="input" type="text" formControlName="nomeAdmin" placeholder="João Silva" />
              </div>

              <div class="form-group">
                <label class="label">Email *</label>
                <input class="input" type="email" formControlName="emailAdmin" placeholder="joao@empresa.com" />
              </div>

              <div class="form-group">
                <label class="label">Senha *</label>
                <input class="input" type="password" formControlName="senhaAdmin" placeholder="Mínimo 8 caracteres" />
              </div>

              <div class="form-group">
                <label class="label">Confirmar senha *</label>
                <input class="input" type="password" formControlName="confirmarSenha" placeholder="Repita a senha" />
              </div>

              <div class="form-group" style="display: flex; align-items: center; gap: 8px;">
                <input type="checkbox" formControlName="aceitouTermos" id="termos" />
                <label for="termos" style="font-size: 13px; color: var(--text-secondary); cursor: pointer;">Concordo com os Termos de Uso</label>
              </div>

              <div style="display: flex; gap: 12px; margin-top: 24px;">
                <button type="button" class="btn btn-ghost" style="flex: 1; justify-content: center;" (click)="step.set(1)">Voltar</button>
                <button type="submit" class="btn btn-primary" style="flex: 2; justify-content: center;" [disabled]="adminForm.invalid || isLoading()">
                  {{ isLoading() ? 'Criando conta...' : 'Finalizar Registro' }}
                </button>
              </div>
            </form>
          }
          
          <div style="text-align: center; margin-top: 32px; font-size: 14px; color: var(--text-muted);">
            Já tem uma conta? <a routerLink="/login" style="color: var(--purple); text-decoration: none; font-weight: 600;">Faça login</a>
          </div>
        </div>
      </div>
      
      <!-- Right Side Banner (Similar to login) -->
      <div class="login-right" style="flex: 1; background: linear-gradient(135deg, var(--purple), #7C3AED); display: none; padding: 48px; color: #fff;">
        <div style="max-width: 400px; margin: auto;">
          <h2 style="font-size: 32px; font-weight: 800; margin-bottom: 16px;">Proteja a margem de lucro dos seus projetos.</h2>
          <p style="font-size: 16px; opacity: 0.8; line-height: 1.6;">O DevFlow Solutions permite acompanhar em tempo real as despesas de equipe, infraestrutura em nuvem e o burn rate geral.</p>
        </div>
      </div>
      <style>
        @media (min-width: 900px) {
          .login-right { display: flex !important; }
        }
      </style>
    </div>
  `
})
export class RegistroComponent {
  step = signal(1);
  isLoading = signal(false);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  empresaForm = this.fb.group({
    nomeFantasia: ['', Validators.required],
    cnpj:         ['', [Validators.required, Validators.minLength(14)]],
    cidade:       [''],
    estado:       [''],
  });

  adminForm = this.fb.group({
    nomeAdmin:        ['', Validators.required],
    emailAdmin:       ['', [Validators.required, Validators.email]],
    senhaAdmin:       ['', [Validators.required, Validators.minLength(8)]],
    confirmarSenha:   ['', Validators.required],
    aceitouTermos:    [false, Validators.requiredTrue],
  }, { validators: this.senhasIguaisValidator });

  senhasIguaisValidator(control: AbstractControl): ValidationErrors | null {
    const senha = control.get('senhaAdmin')?.value;
    const confirmar = control.get('confirmarSenha')?.value;
    return senha === confirmar ? null : { senhasDiferentes: true };
  }

  avancar() {
    if (this.empresaForm.valid) this.step.set(2);
  }

  registrar() {
    if (this.adminForm.valid && this.empresaForm.valid) {
      this.isLoading.set(true);
      const payload = { ...this.empresaForm.value, ...this.adminForm.value };
      
      // Assume register endpoint is similar to login, taking any payload and returning a token
      this.authService.login(payload as any).subscribe({
        next: (res) => {
          this.toast.success('Empresa criada! Você é o administrador. Convide seus devs em Usuários.');
          this.router.navigate(['/app/projetos']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.toast.error(extractErrorMessage(err));
        }
      });
    }
  }
}
