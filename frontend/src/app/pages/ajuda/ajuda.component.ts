import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ajuda',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header" style="align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 24px; margin-bottom: 32px;">
        <div style="display: flex; gap: 20px; align-items: center;">
          <div style="width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, var(--purple), #7C3AED); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 24px rgba(79,70,229,0.4);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12" y2="17"/></svg>
          </div>
          <div>
            <h1 class="page-title" style="margin:0;font-size:32px;letter-spacing:-1px;">Central de Ajuda</h1>
            <p class="page-subtitle" style="font-size:15px;margin:0">Guias, FAQs e suporte técnico</p>
          </div>
        </div>
      </div>

      <!-- Quick Access Cards -->
      <div class="grid-3" style="margin-bottom: 32px;">
        <div class="card" style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 32px 20px;">
          <div style="margin-bottom: 16px; color: var(--purple);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <h3 style="margin-bottom: 8px;">Como usar o DevFlow</h3>
          <p style="font-size: 13px; color: var(--text-muted);">Guia passo a passo para começar</p>
          <button class="btn btn-ghost" style="margin-top: 16px;">Acessar</button>
        </div>
        <div class="card" style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 32px 20px;">
          <div style="margin-bottom: 16px; color: #10B981;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h3 style="margin-bottom: 8px;">Entendendo o Budget Guard</h3>
          <p style="font-size: 13px; color: var(--text-muted);">Como funciona o bloqueio automático</p>
          <button class="btn btn-ghost" style="margin-top: 16px;">Acessar</button>
        </div>
        <div class="card" style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 32px 20px;">
          <div style="margin-bottom: 16px; color: #0EA5E9;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <h3 style="margin-bottom: 8px;">Falar com o Suporte</h3>
          <p style="font-size: 13px; color: var(--text-muted);">suporte&#64;devflow.solutions</p>
          <button class="btn btn-ghost" style="margin-top: 16px;">Acessar</button>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="card">
        <h3 style="margin-bottom: 24px;">Dúvidas Frequentes (FAQ)</h3>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          @for (f of faq; track f.q) {
            <div style="border-bottom: 1px solid var(--border); padding-bottom: 16px;">
              <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--text-primary);">{{ f.q }}</h4>
              <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">{{ f.a }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class AjudaComponent {
  cards: any = []; // Not used anymore

  faq = [
    { q: 'Como lançar um timesheet?', a: 'Acesse "Lançar Horas" na sidebar → selecione o projeto e sprint → informe as horas → clique em Registrar.' },
    { q: 'O que é o Budget Guard Patroll?', a: 'É o nosso motor de segurança financeira. Ele monitora cada lançamento e bloqueia automaticamente novos custos quando o orçamento do projeto é totalmente consumido.' },
    { q: 'Como gerar o relatório PDF?', a: 'Na tela de Dashboard → selecione o projeto → clique em "Exportar DRE". O PDF inclui margem de lucro, burn rate e histórico.' },
    { q: 'Como cadastrar um custo de nuvem?', a: 'Acesse "Custos Cloud" → clique em "+ Novo" → selecione o projeto, o provedor (AWS/Azure/GCP), valor e mês de competência.' },
    { q: 'Como convidar desenvolvedores para a minha empresa?', a: 'Acesse "Usuários" → clique em "+ Novo Usuário" → informe nome, email e defina a role como DESENVOLVEDOR.' },
  ];
}
