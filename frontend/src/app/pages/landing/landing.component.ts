import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero-clone" style="position: relative; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: linear-gradient(0deg, #F5F4F3 29.83%, #D2C5FF 56.75%, #345C59 76.84%, #000000 100%); overflow: hidden; color: #fff;">
      <img src="assets/cloud_203_e5c027668b4b.webp" class="hero-img" alt="Cloud Element" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; max-width: 1000px; opacity: 0.6; z-index: 1; mix-blend-mode: screen;">
      
      <!-- Nav -->
      <nav class="ds-nav" style="position: fixed; top: 0; left: 0; right: 0; height: 80px; background: rgba(0,0,0,0.4); backdrop-filter: blur(20px); z-index: 1000; display: flex; align-items: center; padding: 0 40px; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <div class="nav-logo" style="display: flex; align-items: center; gap: 10px; font-family: var(--font_display); font-weight: 700; font-size: 18px; margin-right: auto; color: #fff;">
          <div class="logo-mark" style="width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, var(--color_accent_deep_purple), var(--color_accent_purple)); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; color: #000;">D</div>
          DevFlow Solutions
        </div>
        <a href="#features" style="margin-right: 30px; text-decoration: none; color: #fff; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Funcionalidades</a>
        <a href="#planos" style="margin-right: 30px; text-decoration: none; color: #fff; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Planos</a>
        <button class="btn btn-ghost" (click)="goLogin()">Acesso Plataforma</button>
        <button class="btn btn-primary" style="margin-left: 16px;" (click)="goRegister()">Iniciar Grátis</button>
      </nav>

      <div class="hero-text-large" style="font-family: 'madefor-display-bold', sans-serif; font-size: clamp(60px, 10vw, 120px); line-height: 0.9; text-transform: uppercase; margin-bottom: 24px; position: relative; z-index: 2; background: linear-gradient(180deg, #FFFFFF, #B3B3B3); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
        DevFlow<br>Solutions
      </div>
      
      <div class="hero-text-small" style="font-family: 'madefor-text', sans-serif; font-size: 18px; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 48px; position: relative; z-index: 2; color: #fff;">
        Plataforma B2B para Gestão de Budget e Projetos
      </div>

      <div style="position: relative; z-index: 2; display: flex; gap: 16px; justify-content: center;">
        <button class="btn btn-primary" (click)="goRegister()">START CREATING</button>
        <button class="btn btn-ghost" (click)="goLogin()">EXPLORE SYSTEM</button>
      </div>
    </div>

    <!-- Layout Container for sections -->
    <div style="background-color: var(--color_main_bg); padding-bottom: 100px;">
      <!-- Funcionalidades -->
      <section id="features" style="padding:100px 40px; border-bottom: 1px solid rgba(255,255,255,0.1); max-width: 1200px; margin: 0 auto;">
        <span style="font-size: 14px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 60px; display: block;">01 / Features</span>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 60px;">
          @for (f of features; track f.title) {
            <div class="card" style="display: flex; flex-direction: column;">
              <div style="font-size:32px;margin-bottom:16px">{{f.icon}}</div>
              <h3 style="color:#fff;font-size:24px;margin-bottom:12px; font-family: var(--font_display);">{{f.title}}</h3>
              <p style="color:rgba(255,255,255,.6);font-size:16px;line-height:1.6; font-family: var(--font_text);">{{f.desc}}</p>
            </div>
          }
        </div>
      </section>

      <!-- Planos -->
      <section id="planos" style="padding:100px 40px; border-bottom: 1px solid rgba(255,255,255,0.1); max-width: 1200px; margin: 0 auto;">
        <span style="font-size: 14px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 60px; display: block;">02 / Pricing</span>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
          @for (p of planos; track p.nome) {
            <div class="card" [style.border]="p.destaque ? '1px solid var(--color_accent_purple)' : '1px solid rgba(255,255,255,.08)'" style="display:flex;flex-direction:column;">
              <span style="font-size:12px;color:var(--color_accent_purple);margin-bottom:12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">{{p.badge}}</span>
              <h3 style="color:#fff;font-size:24px;margin-bottom:8px; font-family: var(--font_display);">{{p.nome}}</h3>
              <div style="font-size:32px;font-weight:700;margin-bottom:24px; font-family: var(--font_display);">{{p.preco}}</div>
              <ul style="list-style:none;padding:0;margin-bottom:32px;flex:1;">
                @for(r of p.recursos; track r) {
                  <li style="font-size:15px;color:rgba(255,255,255,.7);margin-bottom:12px;display:flex;align-items:center;gap:10px;">
                    <span style="color:var(--color_accent_purple); font-weight: bold;">✓</span> {{r}}
                  </li>
                }
              </ul>
              <button class="btn" [ngClass]="p.destaque ? 'btn-primary' : 'btn-ghost'" style="width:100%;" (click)="p.acao === '/registro' ? goRegister() : null">{{p.cta}}</button>
            </div>
          }
        </div>
      </section>
    </div>
  `
})
export class LandingComponent {
  constructor(private router: Router) {}

  goLogin() { this.router.navigate(['/login']); }
  goRegister() { this.router.navigate(['/registro']); }

  features = [
    { icon: '🛡️', title: 'Budget Guard Patroll', desc: 'Robô sentinela que bloqueia automaticamente novos lançamentos quando o orçamento estoura. Nenhum prejuízo passa despercebido.' },
    { icon: '📊', title: 'DRE em Tempo Real', desc: 'Margem de lucro, burn rate e custo acumulado recalculados a cada timesheet aprovado. Decisões baseadas em dados reais.' },
    { icon: '☁️', title: 'Custos Cloud Integrados', desc: 'Registre faturas de AWS, Azure ou GCP direto no projeto. Saiba o custo real de cada feature entregue, incluindo infraestrutura.' },
    { icon: '⚡', title: 'Sprints Financeiros', desc: 'Cada sprint tem seu peso financeiro calculado. Veja qual fase do desenvolvimento consumiu mais orçamento do cliente.' },
    { icon: '📋', title: 'Change Requests', desc: 'Mudanças de escopo ajustam o budget automaticamente, com estorno seguro se rejeitadas. Histórico financeiro auditável.' },
    { icon: '📄', title: 'Relatório Executivo', desc: 'Exporte o DRE completo em PDF para apresentar ao cliente ou à diretoria. Dados financeiros com sua marca.' }
  ];

  planos = [
    { nome: 'Free Beta', preco: 'R$ 0/mês', badge: 'Disponível agora', recursos: ['1 empresa', 'Até 5 projetos simultâneos', 'Até 3 desenvolvedores', 'DRE básico por projeto', 'Budget Guard ativo', 'Exportação PDF'], destaque: false, cta: 'Criar conta gratuita', acao: '/registro' },
    { nome: 'Starter', preco: 'R$ 97/mês', badge: 'Em breve', recursos: ['Projetos ilimitados', 'Até 10 desenvolvedores', 'Change Requests com estorno', 'Dashboard executivo cross-project', 'Forecast de esgotamento', 'Suporte por email'], destaque: true, cta: 'Contratar (em breve)', acao: '#planos' },
    { nome: 'Scale', preco: 'R$ 247/mês', badge: 'Em breve', recursos: ['Tudo do Starter', 'Desenvolvedores ilimitados', 'Multi-projeto por cliente', 'Aprovação de timesheets', 'API pública', 'Suporte prioritário'], destaque: false, cta: 'Contratar (em breve)', acao: '#planos' }
  ];
}
