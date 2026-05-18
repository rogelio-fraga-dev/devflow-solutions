import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ajuda',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Central de Ajuda</h1>
          <p class="page-subtitle">Guias, FAQs e suporte técnico</p>
        </div>
      </div>

      <!-- Quick Access Cards -->
      <div class="grid-3" style="margin-bottom: 32px;">
        @for (c of cards; track c.title) {
          <div class="card" style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 32px 20px;">
            <div style="font-size: 32px; margin-bottom: 16px;">{{ c.icon }}</div>
            <h3 style="margin-bottom: 8px;">{{ c.title }}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">{{ c.desc }}</p>
            <button class="btn btn-ghost" style="margin-top: 16px;">Acessar</button>
          </div>
        }
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
  cards = [
    { icon: '📖', title: 'Como usar o DevFlow',    desc: 'Guia passo a passo para começar' },
    { icon: '💰', title: 'Entendendo o Budget Guard', desc: 'Como funciona o bloqueio automático' },
    { icon: '📞', title: 'Falar com o Suporte',    desc: 'suporte@devflow.solutions' },
  ];

  faq = [
    { q: 'Como lançar um timesheet?', a: 'Acesse "Lançar Horas" na sidebar → selecione o projeto e sprint → informe as horas → clique em Registrar.' },
    { q: 'O que é o Budget Guard Patroll?', a: 'É o nosso motor de segurança financeira. Ele monitora cada lançamento e bloqueia automaticamente novos custos quando o orçamento do projeto é totalmente consumido.' },
    { q: 'Como gerar o relatório PDF?', a: 'Na tela de Dashboard → selecione o projeto → clique em "Exportar DRE". O PDF inclui margem de lucro, burn rate e histórico.' },
    { q: 'Como cadastrar um custo de nuvem?', a: 'Acesse "Custos Cloud" → clique em "+ Novo" → selecione o projeto, o provedor (AWS/Azure/GCP), valor e mês de competência.' },
    { q: 'Como convidar desenvolvedores para a minha empresa?', a: 'Acesse "Usuários" → clique em "+ Novo Usuário" → informe nome, email e defina a role como DESENVOLVEDOR.' },
  ];
}
