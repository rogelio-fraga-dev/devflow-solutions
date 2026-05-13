import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  template: `
    <div class="landing-page">
      <div class="glow-1"></div>
      <div class="glow-2"></div>

      <!-- Nav -->
      <nav class="landing-nav">
        <div class="nav-logo">
          <div class="logo-mark">D</div>
          DevFlow Solutions
        </div>
        <a href="#features">Funcionalidades</a>
        <a href="#sobre">Sobre</a>
        <a href="#planos">Planos</a>
        <a href="#suporte">Suporte</a>
        <button class="btn btn-ghost" style="margin-left:8px;border-color:rgba(255,255,255,.15);color:rgba(255,255,255,.7)"
          (click)="goLogin()">Acesso Plataforma</button>
        <button class="btn btn-primary" (click)="goRegister()">Iniciar Grátis →</button>
      </nav>

      <!-- Hero -->
      <section class="landing-hero">
        <div class="badge">
          <span class="dot"></span>
          Plataforma de Gestão de Projetos B2B
        </div>
        <h1>Seu projeto tem uma data de quebrar o orçamento. Você sabe qual é?</h1>
        <p>DevFlow rastreia horas, cloud e APIs em tempo real.<br>O Budget Guard te avisa antes do prejuízo acontecer.</p>
        <button class="hero-cta" (click)="goRegister()">
          Criar conta gratuita →
        </button>
        <button class="btn btn-ghost" style="margin-left: 12px; color: white; border-color: rgba(255,255,255,0.3)" (click)="goLogin()">Ver demonstração</button>
      </section>

      <!-- Preview cards -->
      <section style="padding:0 48px 60px;max-width:900px;margin:0 auto;position:relative;z-index:1">
        <div class="kpi-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px">
          @for (s of stats; track s.label) {
            <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:16px">
              <div style="font-size:11px;color:rgba(255,255,255,.5);margin-bottom:4px">{{s.label}}</div>
              <div style="font-size:22px;font-weight:800;color:#fff">{{s.value}}</div>
            </div>
          }
        </div>
      </section>

      <!-- Funcionalidades -->
      <section id="features" style="padding:40px 48px 80px;max-width:900px;margin:0 auto;position:relative;z-index:1">
        <h2 style="text-align:center;font-size:28px;font-weight:800;margin-bottom:32px;color:#fff">Funcionalidades</h2>
        <div class="features-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
          @for (f of features; track f.title) {
            <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:24px">
              <div style="font-size:28px;margin-bottom:12px">{{f.icon}}</div>
              <h3 style="color:#fff;font-size:15px;margin-bottom:8px">{{f.title}}</h3>
              <p style="color:rgba(255,255,255,.5);font-size:13px;line-height:1.6">{{f.desc}}</p>
            </div>
          }
        </div>
      </section>

      <!-- Sobre -->
      <section id="sobre" style="padding:40px 48px 80px;max-width:900px;margin:0 auto;position:relative;z-index:1;text-align:center;">
        <h2 style="font-size:28px;font-weight:800;margin-bottom:16px;color:#fff">Nascemos de uma dor real</h2>
        <p style="color:rgba(255,255,255,.5);font-size:15px;margin-bottom:32px;">Pequenas software houses descobrindo prejuízo só depois da entrega final. A gente resolve isso antes.</p>
        <div class="features-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">
          @for (m of equipe; track m.nome) {
            <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:20px">
              <h3 style="color:#fff;font-size:14px;margin-bottom:4px">{{m.nome}}</h3>
              <p style="color:rgba(255,255,255,.5);font-size:12px;">{{m.role}}</p>
            </div>
          }
        </div>
      </section>

      <!-- Planos -->
      <section id="planos" style="padding:40px 48px 80px;max-width:900px;margin:0 auto;position:relative;z-index:1">
        <h2 style="text-align:center;font-size:28px;font-weight:800;margin-bottom:32px;color:#fff">Planos</h2>
        <div class="plans-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
          @for (p of planos; track p.nome) {
            <div [style.border]="p.destaque ? '2px solid #6366F1' : '1px solid rgba(255,255,255,.08)'" style="background:rgba(255,255,255,.04);border-radius:14px;padding:24px;display:flex;flex-direction:column;">
              <span style="font-size:12px;color:#a5b4fc;margin-bottom:8px;">{{p.badge}}</span>
              <h3 style="color:#fff;font-size:18px;margin-bottom:4px">{{p.nome}}</h3>
              <div style="font-size:24px;font-weight:700;margin-bottom:16px">{{p.preco}}</div>
              <ul style="list-style:none;padding:0;margin-bottom:24px;flex:1;">
                @for(r of p.recursos; track r) {
                  <li style="font-size:13px;color:rgba(255,255,255,.7);margin-bottom:8px;display:flex;align-items:center;gap:6px;">
                    <span style="color:#6366F1">✓</span> {{r}}
                  </li>
                }
              </ul>
              <button class="btn" [ngClass]="p.destaque ? 'btn-primary' : 'btn-ghost'" style="width:100%;justify-content:center" (click)="p.acao === '/registro' ? goRegister() : null">{{p.cta}}</button>
            </div>
          }
        </div>
      </section>

      <!-- Suporte -->
      <section id="suporte" style="padding:40px 48px 100px;max-width:800px;margin:0 auto;position:relative;z-index:1">
        <h2 style="text-align:center;font-size:28px;font-weight:800;margin-bottom:32px;color:#fff">Dúvidas Frequentes</h2>
        <div style="display:flex;flex-direction:column;gap:12px;">
          @for (f of faq; track f.q) {
            <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:16px;">
              <h4 style="font-size:15px;color:#fff;margin-bottom:8px;">{{f.q}}</h4>
              <p style="font-size:13px;color:rgba(255,255,255,.6);line-height:1.5;">{{f.a}}</p>
            </div>
          }
        </div>
        <div style="text-align:center;margin-top:40px;color:rgba(255,255,255,.5);font-size:14px;">
          <p>Email: suporte&#64;devflow.solutions</p>
          <p>Horário: Seg–Sex · 9h às 18h</p>
        </div>
      </section>
    </div>
  `
})
export class LandingComponent {
  constructor(private router: Router) {}

  goLogin() { this.router.navigate(['/login']); }
  goRegister() { this.router.navigate(['/registro']); }

  stats = [
    { label: 'Projetos Ativos',    value: '12',    color: '--status-info' },
    { label: 'Em Alerta 🟡',       value: '3',     color: '--status-warning' },
    { label: 'Burn Rate Médio',    value: '67%',   color: '--brand-primary' },
    { label: 'Custo do Mês',       value: 'R$148k', color: '--status-safe' },
  ];

  features = [
    { icon: '🛡️', title: 'Budget Guard Patroll', desc: 'Robô sentinela que bloqueia automaticamente novos lançamentos quando o orçamento estoura. Nenhum prejuízo passa despercebido.' },
    { icon: '📊', title: 'DRE em Tempo Real', desc: 'Margem de lucro, burn rate e custo acumulado recalculados a cada timesheet aprovado. Decisões baseadas em dados reais.' },
    { icon: '☁️', title: 'Custos Cloud Integrados', desc: 'Registre faturas de AWS, Azure ou GCP direto no projeto. Saiba o custo real de cada feature entregue, incluindo infraestrutura.' },
    { icon: '⚡', title: 'Sprints Financeiros', desc: 'Cada sprint tem seu peso financeiro calculado. Veja qual fase do desenvolvimento consumiu mais orçamento do cliente.' },
    { icon: '📋', title: 'Change Requests com Estorno', desc: 'Mudanças de escopo ajustam o budget automaticamente, com estorno seguro se rejeitadas. Histórico financeiro auditável.' },
    { icon: '📄', title: 'Relatório PDF Executivo', desc: 'Exporte o DRE completo em PDF para apresentar ao cliente ou à diretoria. Dados financeiros com sua marca.' }
  ];

  equipe = [
    { nome: 'Rogélio Fraga',    role: 'Arquitetura & Backend' },
    { nome: 'João Gabriel',     role: 'Backend & Banco de Dados' },
    { nome: 'Alexandre Vieira', role: 'Frontend & UX' },
    { nome: 'Elias Coelho',     role: 'Frontend & Integração' },
  ];

  planos = [
    { nome: 'Free Beta', preco: 'R$ 0/mês', badge: '🎯 Disponível agora', recursos: ['1 empresa', 'Até 5 projetos simultâneos', 'Até 3 desenvolvedores', 'DRE básico por projeto', 'Budget Guard ativo', 'Exportação PDF'], destaque: false, cta: 'Criar conta gratuita', acao: '/registro' },
    { nome: 'Starter', preco: 'R$ 97/mês', badge: '⏳ Em breve', recursos: ['Projetos ilimitados', 'Até 10 desenvolvedores', 'Change Requests com estorno', 'Dashboard executivo cross-project', 'Forecast de esgotamento', 'Suporte por email'], destaque: true, cta: 'Contratar (em breve)', acao: '#planos' },
    { nome: 'Scale', preco: 'R$ 247/mês', badge: '⏳ Em breve', recursos: ['Tudo do Starter', 'Desenvolvedores ilimitados', 'Multi-projeto por cliente', 'Aprovação de timesheets', 'API pública', 'Suporte prioritário'], destaque: false, cta: 'Contratar (em breve)', acao: '#planos' }
  ];

  faq = [
    { q: 'Como funciona o Budget Guard?', a: 'O Budget Guard monitora cada lançamento de timesheet ou custo cloud. Ao atingir 80% do orçamento, o projeto entra em ALERTA. Ao atingir 100%, novos lançamentos são bloqueados automaticamente no banco de dados.' },
    { q: 'Como lançar um timesheet?', a: 'Vá em "Lançar Horas" na sidebar, selecione o projeto e a sprint, informe as horas trabalhadas e clique em registrar. O custo é calculado automaticamente pelo seu valor-hora cadastrado.' },
    { q: 'Como gerar o relatório PDF?', a: 'Na tela de Financeiro, selecione o projeto e clique em "Exportar DRE". O PDF é gerado com margem de lucro, burn rate e histórico de custos.' },
    { q: 'Como cadastrar um custo de AWS no projeto?', a: 'Acesse "Custos Cloud" na sidebar, selecione o projeto, informe o provedor (AWS, Azure, GCP), o valor da fatura e o mês de competência.' },
  ];
}
