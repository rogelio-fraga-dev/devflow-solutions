import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Animated Aurora Background -->
    <style>
      @keyframes aurora-1 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(60px, -40px) scale(1.15); }
        66% { transform: translate(-40px, 30px) scale(0.95); }
      }
      @keyframes aurora-2 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(-70px, 50px) scale(0.9); }
        66% { transform: translate(50px, -30px) scale(1.1); }
      }
      @keyframes aurora-3 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(30px, 60px) scale(1.2); }
      }
      @keyframes aurora-rotate {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes ping-slow { 75%, 100% { transform: scale(2); opacity: 0; } }
      @keyframes float-up {
        from { opacity: 0; transform: translateY(30px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .landing-bg {
        position: absolute; inset: 0; z-index: 0; overflow: hidden;
        background: #000;
      }
      /* Noise overlay */
      .landing-bg::before {
        content: '';
        position: absolute; inset: 0; z-index: 10;
        opacity: 0.035;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        pointer-events: none;
      }
      /* Radial vignette */
      .landing-bg::after {
        content: '';
        position: absolute; inset: 0; z-index: 5;
        background: radial-gradient(ellipse at center, transparent 30%, #000 100%);
        pointer-events: none;
      }
      .aurora-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        mix-blend-mode: screen;
        pointer-events: none;
      }
      .aurora-orb-1 {
        width: 700px; height: 700px;
        background: radial-gradient(circle, rgba(79,70,229,0.55) 0%, transparent 70%);
        top: -200px; left: -150px;
        animation: aurora-1 12s ease-in-out infinite;
      }
      .aurora-orb-2 {
        width: 600px; height: 600px;
        background: radial-gradient(circle, rgba(124,58,237,0.45) 0%, transparent 70%);
        top: 20%; right: -100px;
        animation: aurora-2 15s ease-in-out infinite;
      }
      .aurora-orb-3 {
        width: 500px; height: 500px;
        background: radial-gradient(circle, rgba(49,46,129,0.5) 0%, transparent 70%);
        bottom: -100px; left: 30%;
        animation: aurora-3 18s ease-in-out infinite;
      }
      .aurora-orb-4 {
        width: 300px; height: 300px;
        background: radial-gradient(circle, rgba(210,197,255,0.12) 0%, transparent 70%);
        top: 40%; left: 40%;
        animation: aurora-2 20s ease-in-out infinite reverse;
      }
      /* Conic ring */
      .aurora-ring {
        position: absolute;
        top: 50%; left: 50%;
        width: 900px; height: 900px;
        margin: -450px 0 0 -450px;
        border-radius: 50%;
        background: conic-gradient(from 0deg, transparent 0deg, rgba(79,70,229,0.06) 60deg, transparent 120deg, rgba(124,58,237,0.04) 240deg, transparent 360deg);
        animation: aurora-rotate 30s linear infinite;
        pointer-events: none;
        z-index: 2;
      }
      /* Grid lines */
      .aurora-grid {
        position: absolute; inset: 0; z-index: 3; pointer-events: none;
        background-image:
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
        background-size: 80px 80px;
        mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
        -webkit-mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
      }

      .hero-clone {
        position: relative; min-height: 100vh;
        display: flex; flex-direction: column;
        justify-content: center; align-items: center;
        text-align: center; overflow: hidden;
        color: #fff; z-index: 1;
      }
      .text-gradient-1 {
        background: linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.75) 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      }
      .text-gradient-2 {
        background: linear-gradient(to right, #c4b5fd, #ffffff 40%, #a5b4fc);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        filter: drop-shadow(0 0 40px rgba(139,92,246,0.5));
      }
      .hero-glow {
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 70%; height: 70%;
        background: radial-gradient(circle, rgba(79,70,229,0.25) 0%, transparent 70%);
        border-radius: 50%; pointer-events: none; z-index: -1;
      }
      .btn-glow-primary {
        position: relative; overflow: hidden; border-radius: 9999px; padding: 1px;
        transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        display: inline-block; cursor: pointer; border: none; background: transparent;
      }
      .btn-glow-primary:hover {
        transform: scale(1.02);
        box-shadow: 0 0 50px -10px rgba(139,92,246,0.7);
      }
      .btn-glow-bg {
        position: absolute; inset: 0; opacity: 0; transition: opacity 0.4s;
        background: radial-gradient(200px circle at var(--x,50%) var(--y,50%), rgba(139,92,246,0.9), rgba(79,70,229,0.8), transparent 60%);
      }
      .btn-glow-primary:hover .btn-glow-bg { opacity: 1; }
      .btn-glow-border {
        position: absolute; inset: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.05));
        border-radius: 9999px; transition: opacity 0.3s;
      }
      .btn-glow-primary:hover .btn-glow-border { opacity: 0; }
      .btn-glow-inner {
        position: relative; display: flex; align-items: center;
        justify-content: center; gap: 8px;
        background: rgba(0,0,0,0.85); border: 1px solid rgba(255,255,255,0.08);
        border-radius: 9999px; padding: 15px 36px;
        color: #fff; font-weight: 600; font-size: 15px;
        backdrop-filter: blur(24px); transition: background 0.3s;
      }
      .btn-glow-primary:hover .btn-glow-inner { background: rgba(0,0,0,0.95); }
      .btn-glow-arrow {
        transition: transform 0.3s; color: var(--color_accent_purple); font-weight: bold;
      }
      .btn-glow-primary:hover .btn-glow-arrow { transform: translateX(5px); }
      .btn-glass-secondary {
        position: relative; display: flex; align-items: center;
        justify-content: center; gap: 8px;
        background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
        border-radius: 9999px; padding: 15px 36px;
        color: rgba(255,255,255,0.85); font-weight: 500; font-size: 15px; cursor: pointer;
        backdrop-filter: blur(20px); transition: all 0.3s;
        box-shadow: 0 0 0 0 rgba(255,255,255,0);
        overflow: hidden;
      }
      .btn-glass-secondary:hover {
        background: rgba(255,255,255,0.13); border-color: rgba(255,255,255,0.22);
        color: #fff; box-shadow: 0 0 30px rgba(255,255,255,0.08);
      }
      .btn-glass-sheen {
        position: absolute; inset: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%);
        opacity: 0; transition: opacity 0.3s; pointer-events: none;
      }
      .btn-glass-secondary:hover .btn-glass-sheen { opacity: 1; }

      /* floating badge */
      .hero-badge {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 6px 18px; border-radius: 9999px;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        backdrop-filter: blur(8px); margin-bottom: 32px;
        cursor: pointer; transition: all 0.3s;
        box-shadow: 0 0 20px -8px rgba(139,92,246,0.4);
        animation: float-up 0.8s cubic-bezier(0.16,1,0.3,1) both;
      }
      .hero-badge:hover {
        background: rgba(255,255,255,0.1);
        border-color: rgba(139,92,246,0.5);
        box-shadow: 0 0 30px -8px rgba(139,92,246,0.6);
      }
      .ping-dot {
        display: flex; height: 8px; width: 8px; position: relative;
      }
      .ping-dot span:first-child {
        animation: ping-slow 1.5s cubic-bezier(0,0,0.2,1) infinite;
        position: absolute; inset: 0; border-radius: 50%;
        background: var(--color_accent_purple); opacity: 0.7;
      }
      .ping-dot span:last-child {
        position: relative; border-radius: 50%; height: 8px; width: 8px;
        background: var(--color_accent_deep_purple); display: inline-flex;
      }
    </style>

    <div class="landing-bg">
      <div class="aurora-orb aurora-orb-1"></div>
      <div class="aurora-orb aurora-orb-2"></div>
      <div class="aurora-orb aurora-orb-3"></div>
      <div class="aurora-orb aurora-orb-4"></div>
      <div class="aurora-ring"></div>
      <div class="aurora-grid"></div>
    </div>

    <div class="hero-clone">

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

      <!-- Badge -->
      <div class="hero-badge">
        <span class="ping-dot">
          <span></span>
          <span></span>
        </span>
        <span style="font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.9); letter-spacing: 0.05em;">DevFlow 2.0 — Plataforma Financeira B2B</span>
      </div>

      <!-- Headline -->
      <h1 style="font-family: var(--font_display); font-size: clamp(60px, 10vw, 120px); line-height: 0.95; letter-spacing: -0.02em; margin-bottom: 24px; position: relative; z-index: 2; mask-image: linear-gradient(180deg, transparent, black 30%, black 75%, transparent); -webkit-mask-image: linear-gradient(180deg, transparent, black 30%, black 75%, transparent);">
        <div class="hero-glow"></div>
        <span class="text-gradient-1">DevFlow</span><br>
        <span class="text-gradient-2" style="position: relative; overflow: visible;">Solutions</span>
      </h1>
      
      <!-- Sub-headline -->
      <p style="font-family: var(--font_text); font-size: 18px; font-weight: 300; max-width: 600px; line-height: 1.6; margin-bottom: 40px; position: relative; z-index: 2; color: rgba(255,255,255,0.8); text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
        Plataforma B2B para Gestão de Budget e Projetos. <br>A infraestrutura financeira que sua Software House precisa.
      </p>

      <!-- CTA -->
      <div style="position: relative; z-index: 2; display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
        <button class="btn-glow-primary" onmousemove="const rect = this.getBoundingClientRect(); this.style.setProperty('--x', (event.clientX - rect.left) + 'px'); this.style.setProperty('--y', (event.clientY - rect.top) + 'px');" (click)="goRegister()">
          <span class="btn-glow-bg"></span>
          <span class="btn-glow-border"></span>
          <span class="btn-glow-inner">
            Proteger minha margem
            <span class="btn-glow-arrow">→</span>
          </span>
        </button>

        <button class="btn-glass-secondary" (click)="goLogin()">
          <span class="btn-glass-sheen"></span>
          <span>Ver demonstração</span>
        </button>
      </div>
    </div>

    <!-- Layout Container for sections -->
    <div style="background-color: var(--color_main_bg); padding-bottom: 100px;">
      
      <!-- Introdução da Dor -->
      <section style="padding:100px 40px 0; text-align: center; max-width: 900px; margin: 0 auto;">
        <h2 style="font-family: var(--font_display); font-size: clamp(32px, 5vw, 48px); line-height: 1.2; margin-bottom: 24px; color: #fff;">
          Pare de financiar os projetos dos seus clientes. <br><span style="color: var(--color_accent_purple);">Blinde o lucro da sua Software House.</span>
        </h2>
        <p style="font-family: var(--font_text); font-size: 18px; line-height: 1.6; color: rgba(255,255,255,0.7);">
          O DevFlow une dados de Sprints, Cloud e Escopo para garantir que nenhum time de desenvolvimento trabalhe de graça.
        </p>
      </section>

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

      <!-- Custo da Inação -->
      <section id="dor" style="padding:100px 40px; background: rgba(0,0,0,0.3); border-bottom: 1px solid rgba(255,255,255,0.05);">
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
          <h2 style="color:#fff; font-size:36px; margin-bottom:24px; font-family: var(--font_display);">Quanto custa não controlar o escopo?</h2>
          <p style="color:rgba(255,255,255,.7); font-size:18px; line-height:1.6; margin-bottom:40px; font-family: var(--font_text);">Agências e Software Houses perdem em média <b>20% da sua margem de lucro</b> todos os meses com features não cobradas, infraestrutura mal calculada e horas extras não mapeadas. Você está pagando para trabalhar?</p>
          <div style="display: flex; justify-content: center; gap: 32px; flex-wrap: wrap;">
            <div class="card" style="flex: 1; min-width: 200px; text-align: center; border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.05);">
              <div style="font-size:32px; font-weight:800; color:#EF4444; margin-bottom:8px;">-20%</div>
              <div style="font-size:14px; color:rgba(255,255,255,.6);">Margem perdida em média</div>
            </div>
            <div class="card" style="flex: 1; min-width: 200px; text-align: center; border-color: rgba(245, 158, 11, 0.3); background: rgba(245, 158, 11, 0.05);">
              <div style="font-size:32px; font-weight:800; color:#F59E0B; margin-bottom:8px;">100+</div>
              <div style="font-size:14px; color:rgba(255,255,255,.6);">Horas grátis por projeto</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Depoimentos -->
      <section id="depoimentos" style="padding:100px 40px; border-bottom: 1px solid rgba(255,255,255,0.1); max-width: 1200px; margin: 0 auto;">
        <span style="font-size: 14px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 60px; display: block; text-align: center;">02 / Histórias de Sucesso</span>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
          <!-- Depoimento 1 -->
          <div class="card" style="position: relative;">
            <div style="font-size:48px; color:var(--color_accent_purple); opacity:0.2; position:absolute; top:10px; left:20px;">"</div>
            <p style="color:#fff; font-size:16px; line-height:1.6; font-style:italic; margin-bottom:24px; position:relative; z-index:2; padding-top:20px;">Paramos de perder dinheiro com infraestrutura mal calculada. O DevFlow nos deu a clareza que precisávamos para cobrar exatamente o que entregamos, aumentando nossa margem em 30% no primeiro semestre.</p>
            <div style="display:flex; align-items:center; gap:16px;">
              <div style="width:48px; height:48px; border-radius:50%; background:var(--color_accent_deep_purple); display:flex; align-items:center; justify-content:center; font-weight:bold; color:#fff;">CTO</div>
              <div>
                <div style="color:#fff; font-weight:bold; font-size:14px;">João Silva</div>
                <div style="color:var(--text-muted); font-size:12px;">Tech Solutions Agency</div>
              </div>
            </div>
          </div>
          <!-- Depoimento 2 -->
          <div class="card" style="position: relative;">
            <div style="font-size:48px; color:var(--color_accent_purple); opacity:0.2; position:absolute; top:10px; left:20px;">"</div>
            <p style="color:#fff; font-size:16px; line-height:1.6; font-style:italic; margin-bottom:24px; position:relative; z-index:2; padding-top:20px;">A união entre Sprints e controle financeiro mudou o jogo para nós. Agora, nenhum time trabalha de graça em change requests infinitos. O cliente vê o dashboard e entende o valor.</p>
            <div style="display:flex; align-items:center; gap:16px;">
              <div style="width:48px; height:48px; border-radius:50%; background:var(--color_accent_purple); display:flex; align-items:center; justify-content:center; font-weight:bold; color:#000;">CEO</div>
              <div>
                <div style="color:#fff; font-weight:bold; font-size:14px;">Maria Costa</div>
                <div style="color:var(--text-muted); font-size:12px;">DevHouse Corp</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Planos -->
      <section id="planos" style="padding:100px 40px; border-bottom: 1px solid rgba(255,255,255,0.1); max-width: 1200px; margin: 0 auto;">
        <span style="font-size: 14px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 60px; display: block;">03 / Pricing</span>
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
    { icon: '🛡️', title: 'Fim dos Projetos no Vermelho', desc: 'O Budget Guard bloqueia automaticamente novos lançamentos de horas e gastos quando o orçamento estoura. Um verdadeiro bloqueio anti-prejuízo.' },
    { icon: '📊', title: 'Fim do Voo às Cegas', desc: 'Acompanhe o DRE do projeto em tempo real. Tome decisões baseadas no presente, não em relatórios atrasados do fim do mês.' },
    { icon: '☁️', title: 'Descubra Custos Ocultos', desc: 'Integre faturas de Cloud (AWS, Azure) diretamente aos projetos e evite surpresas na fatura que devoram sua margem.' },
    { icon: '⚡', title: 'Scrum e Dinheiro na Mesma Língua', desc: 'Sprints Financeiros calculam o peso financeiro de cada entrega. Saiba exatamente quanto custa cada fase do desenvolvimento.' },
    { icon: '📋', title: 'Fim do Escopo Gratuito', desc: 'Change Requests que ajustam o budget automaticamente. Tenha segurança na cobrança e pare de dar features de graça.' },
    { icon: '📄', title: 'Transparência que Fideliza', desc: 'Exporte relatórios executivos claros. Construa a confiança do cliente mostrando gestão profissional e resultados blindados.' }
  ];

  planos = [
    { nome: 'Free Beta', preco: 'R$ 0/mês', badge: 'Disponível agora', recursos: ['1 empresa', 'Até 5 projetos simultâneos', 'Até 3 desenvolvedores', 'DRE básico por projeto', 'Budget Guard ativo', 'Exportação PDF'], destaque: false, cta: 'Criar conta gratuita', acao: '/registro' },
    { nome: 'Starter', preco: 'R$ 97/mês', badge: 'Em breve', recursos: ['Projetos ilimitados', 'Até 10 desenvolvedores', 'Change Requests com estorno', 'Dashboard executivo cross-project', 'Forecast de esgotamento', 'Suporte por email'], destaque: true, cta: 'Contratar (em breve)', acao: '#planos' },
    { nome: 'Scale', preco: 'R$ 247/mês', badge: 'Em breve', recursos: ['Tudo do Starter', 'Desenvolvedores ilimitados', 'Multi-projeto por cliente', 'Aprovação de timesheets', 'API pública', 'Suporte prioritário'], destaque: false, cta: 'Contratar (em breve)', acao: '#planos' }
  ];
}
