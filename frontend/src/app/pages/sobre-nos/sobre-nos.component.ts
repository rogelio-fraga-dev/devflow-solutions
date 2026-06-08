import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sobre-nos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Animated Aurora Background (same as landing) -->
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
      @keyframes float-up {
        from { opacity: 0; transform: translateY(40px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fade-in-scale {
        from { opacity: 0; transform: scale(0.92); }
        to   { opacity: 1; transform: scale(1); }
      }

      .sn-bg {
        position: fixed; inset: 0; z-index: 0; overflow: hidden;
        background: #000;
        pointer-events: none;
      }
      .sn-bg::before {
        content: '';
        position: absolute; inset: 0; z-index: 10;
        opacity: 0.035;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        pointer-events: none;
      }
      .sn-bg::after {
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
        bottom: 0; left: 30%;
        animation: aurora-3 18s ease-in-out infinite;
      }
      .aurora-orb-4 {
        width: 300px; height: 300px;
        background: radial-gradient(circle, rgba(210,197,255,0.12) 0%, transparent 70%);
        top: 40%; left: 40%;
        animation: aurora-2 20s ease-in-out infinite reverse;
      }
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
      .aurora-grid {
        position: absolute; inset: 0; z-index: 3; pointer-events: none;
        background-image:
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
        background-size: 80px 80px;
        mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
        -webkit-mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
      }

      /* Page wrapper */
      .sn-page {
        position: relative;
        min-height: 100vh;
        color: #fff;
        z-index: 1;
        overflow-x: hidden;
      }

      /* Nav */
      .sn-nav {
        position: fixed; top: 0; left: 0; right: 0; height: 80px;
        background: rgba(0,0,0,0.4);
        backdrop-filter: blur(20px);
        z-index: 1000;
        display: flex; align-items: center; padding: 0 40px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      .sn-nav-logo {
        display: flex; align-items: center; gap: 10px;
        font-family: var(--font_display); font-weight: 700; font-size: 18px;
        margin-right: auto; color: #fff; cursor: pointer;
        text-decoration: none;
      }
      .sn-logo-mark {
        width: 32px; height: 32px; border-radius: 8px;
        background: linear-gradient(135deg, var(--color_accent_deep_purple), var(--color_accent_purple));
        display: flex; align-items: center; justify-content: center;
        font-weight: 800; font-size: 14px; color: #000;
        flex-shrink: 0;
      }
      .sn-nav a {
        margin-right: 30px; text-decoration: none; color: #fff;
        font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
        transition: color 0.2s;
      }
      .sn-nav a:hover { color: var(--color_accent_purple); }

      /* Content */
      .sn-content {
        padding-top: 80px;
      }

      /* Hero section */
      .sn-hero {
        text-align: center;
        padding: 100px 40px 60px;
        max-width: 900px;
        margin: 0 auto;
        animation: float-up 0.9s cubic-bezier(0.16,1,0.3,1) both;
      }
      .sn-eyebrow {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 6px 18px; border-radius: 9999px;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        backdrop-filter: blur(8px); margin-bottom: 32px;
        font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.9);
        letter-spacing: 0.05em;
        box-shadow: 0 0 20px -8px rgba(139,92,246,0.4);
      }
      .sn-eyebrow-dot {
        width: 6px; height: 6px; border-radius: 50%;
        background: var(--color_accent_purple);
        box-shadow: 0 0 6px rgba(210,197,255,0.6);
      }
      .sn-hero-title {
        font-family: var(--font_display) !important;
        font-size: clamp(48px, 8vw, 80px) !important;
        line-height: 1 !important;
        letter-spacing: -0.02em;
        margin-bottom: 24px !important;
        background: linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.75) 100%) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        text-transform: none !important;
      }
      .sn-hero-title span {
        background: linear-gradient(to right, #c4b5fd, #ffffff 40%, #a5b4fc);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        filter: drop-shadow(0 0 40px rgba(139,92,246,0.5));
      }
      .sn-hero-desc {
        font-family: var(--font_text);
        font-size: 18px; font-weight: 300;
        line-height: 1.7;
        color: rgba(255,255,255,0.75);
        max-width: 700px; margin: 0 auto;
      }

      /* Divider */
      .sn-divider {
        width: 80px; height: 2px; margin: 40px auto;
        background: linear-gradient(to right, transparent, var(--color_accent_purple), transparent);
      }

      /* History section */
      .sn-history {
        max-width: 800px; margin: 0 auto;
        padding: 0 40px 100px;
      }
      .sn-section-label {
        font-size: 14px; color: var(--text-muted);
        text-transform: uppercase; letter-spacing: 0.1em;
        margin-bottom: 40px; display: block; text-align: center;
      }
      .sn-history-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
        margin-bottom: 60px;
      }
      .sn-history-card {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        padding: 28px;
        backdrop-filter: blur(10px);
        transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease;
      }
      .sn-history-card:hover {
        transform: translateY(-6px);
        background: rgba(255,255,255,0.06);
        border-color: rgba(210,197,255,0.2);
      }
      .sn-history-icon {
        font-size: 28px; margin-bottom: 16px;
      }
      .sn-history-card h3 {
        color: #fff; font-size: 18px; margin-bottom: 10px;
        font-family: var(--font_display);
      }
      .sn-history-card p {
        color: rgba(255,255,255,0.6); font-size: 15px;
        line-height: 1.6; margin-bottom: 0;
      }

      /* Team section */
      .sn-team {
        background: rgba(0,0,0,0.3);
        border-top: 1px solid rgba(255,255,255,0.06);
        border-bottom: 1px solid rgba(255,255,255,0.06);
        padding: 100px 40px;
      }
      .sn-team-inner { max-width: 1100px; margin: 0 auto; }
      .sn-team-title {
        text-align: center; margin-bottom: 16px;
        font-family: var(--font_display);
        font-size: clamp(28px, 4vw, 42px);
        color: #fff;
      }
      .sn-team-subtitle {
        text-align: center; color: rgba(255,255,255,0.6);
        font-size: 16px; margin-bottom: 64px;
      }
      .sn-team-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 28px;
      }
      @media (max-width: 900px) {
        .sn-team-grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 500px) {
        .sn-team-grid { grid-template-columns: 1fr; }
        .sn-nav { padding: 0 20px; }
        .sn-hero, .sn-history, .sn-team { padding-left: 20px; padding-right: 20px; }
      }
      .sn-member-card {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 20px;
        padding: 28px 20px;
        text-align: center;
        transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        animation: fade-in-scale 0.6s cubic-bezier(0.16,1,0.3,1) both;
      }
      .sn-member-card:nth-child(1) { animation-delay: 0.1s; }
      .sn-member-card:nth-child(2) { animation-delay: 0.2s; }
      .sn-member-card:nth-child(3) { animation-delay: 0.3s; }
      .sn-member-card:nth-child(4) { animation-delay: 0.4s; }
      .sn-member-card:hover {
        transform: translateY(-10px);
        background: rgba(255,255,255,0.06);
        border-color: rgba(210,197,255,0.25);
        box-shadow: 0 20px 60px rgba(79,70,229,0.15);
      }
      .sn-avatar-wrap {
        width: 110px; height: 110px;
        border-radius: 50%;
        margin: 0 auto 20px;
        position: relative;
        overflow: hidden;
        border: 2px solid rgba(210,197,255,0.25);
        background: linear-gradient(135deg, rgba(79,70,229,0.3), rgba(124,58,237,0.2));
        transition: border-color 0.3s;
      }
      .sn-member-card:hover .sn-avatar-wrap {
        border-color: rgba(210,197,255,0.6);
      }
      .sn-avatar-wrap img {
        width: 100%; height: 100%; object-fit: cover;
        border-radius: 50%;
      }
      .sn-avatar-overlay {
        position: absolute; inset: 0; border-radius: 50%;
        background: linear-gradient(135deg, rgba(79,70,229,0.15), transparent);
        pointer-events: none;
      }
      .sn-avatar-placeholder-icon {
        position: absolute; inset: 0;
        display: flex; align-items: center; justify-content: center;
        font-size: 42px;
        color: rgba(210,197,255,0.5);
      }
      .sn-member-name {
        color: #fff; font-weight: 700; font-size: 16px;
        font-family: var(--font_display);
        margin-bottom: 6px;
      }
      .sn-member-role {
        color: var(--color_accent_purple);
        font-size: 13px; font-weight: 600;
        text-transform: uppercase; letter-spacing: 0.08em;
        margin-bottom: 12px;
      }
      .sn-member-desc {
        color: rgba(255,255,255,0.5);
        font-size: 13.5px; line-height: 1.5;
      }
      .sn-add-photo-badge {
        display: inline-flex; align-items: center; gap: 6px;
        margin-top: 14px;
        padding: 4px 12px;
        border-radius: 9999px;
        background: rgba(210,197,255,0.06);
        border: 1px dashed rgba(210,197,255,0.2);
        color: rgba(210,197,255,0.5);
        font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      /* CTA section */
      .sn-cta {
        text-align: center;
        padding: 100px 40px;
        max-width: 700px;
        margin: 0 auto;
      }
      .sn-cta h2 {
        font-family: var(--font_display);
        font-size: clamp(28px, 4vw, 40px);
        color: #fff; margin-bottom: 16px;
      }
      .sn-cta p {
        color: rgba(255,255,255,0.6); font-size: 16px;
        margin-bottom: 36px; line-height: 1.6;
      }
      .sn-cta-buttons {
        display: flex; gap: 16px;
        justify-content: center; flex-wrap: wrap;
      }
    </style>

    <!-- Background -->
    <div class="sn-bg">
      <div class="aurora-orb aurora-orb-1"></div>
      <div class="aurora-orb aurora-orb-2"></div>
      <div class="aurora-orb aurora-orb-3"></div>
      <div class="aurora-orb aurora-orb-4"></div>
      <div class="aurora-ring"></div>
      <div class="aurora-grid"></div>
    </div>

    <!-- Nav -->
    <nav class="sn-nav">
      <div class="sn-nav-logo" (click)="goHome()">
        <div class="sn-logo-mark">D</div>
        DevFlow Solutions
      </div>
      <a href="/#features">Funcionalidades</a>
      <a href="/#planos">Planos</a>
      <button class="btn btn-ghost" (click)="goHome()">Voltar</button>
      <button class="btn btn-primary" style="margin-left: 16px;" (click)="goRegister()">Iniciar Grátis</button>
    </nav>

    <!-- Page -->
    <div class="sn-page">
      <div class="sn-content">

        <!-- Hero -->
        <section class="sn-hero">
          <div class="sn-eyebrow">
            <div class="sn-eyebrow-dot"></div>
            Conheça a equipe por trás da ideia
          </div>
          <h1 class="sn-hero-title">
            Sobre a<br><span>DevFlow Solutions</span>
          </h1>
          <p class="sn-hero-desc">
            Somos universitários apaixonados por tecnologia e gestão que decidiram resolver
            um problema real: software houses perdendo margem por não controlar seus budgets.
            O DevFlow Solutions nasceu dessa missão — dar às agências de desenvolvimento a
            infraestrutura financeira que elas merecem.
          </p>
          <div class="sn-divider"></div>
        </section>

        <!-- História em cards -->
        <section class="sn-history">
          <span class="sn-section-label">01 / Nossa História</span>
          <div class="sn-history-grid">
            <div class="sn-history-card">
              <div class="sn-history-icon">🎓</div>
              <h3>A Origem Universitária</h3>
              <p>
                O projeto nasceu nas salas de aula da faculdade, em uma disciplina de
                Projeto Integrador. Identificamos que software houses — mesmo as maiores —
                ainda gerenciam budget em planilhas, perdendo dinheiro sem perceber.
              </p>
            </div>
            <div class="sn-history-card">
              <div class="sn-history-icon">💡</div>
              <h3>A Ideia que Mudou Tudo</h3>
              <p>
                A pergunta que nos uniu foi simples: <em>"Por que não existe um sistema que
                una Sprints, Cloud e financeiro em um único dashboard?"</em> A resposta virou
                o DevFlow Solutions.
              </p>
            </div>
            <div class="sn-history-card">
              <div class="sn-history-icon">🛡️</div>
              <h3>Nossa Missão</h3>
              <p>
                Blindar o lucro de quem cria software. Queremos que nenhum desenvolvedor
                trabalhe de graça, nenhuma feature seja entregue sem cobrança, e nenhuma
                fatura de cloud seja uma surpresa no final do mês.
              </p>
            </div>
            <div class="sn-history-card">
              <div class="sn-history-icon">🚀</div>
              <h3>Onde Queremos Chegar</h3>
              <p>
                Ser a plataforma B2B financeira de referência para Software Houses no Brasil.
                Ajudar centenas de agências a transformar dados de Sprints em lucro real e
                previsível — do contrato à entrega.
              </p>
            </div>
          </div>
        </section>

        <!-- Team -->
        <section class="sn-team">
          <div class="sn-team-inner">
            <span class="sn-section-label">02 / Os Criadores</span>
            <h2 class="sn-team-title">Quem fez acontecer</h2>
            <p class="sn-team-subtitle">
              Quatro universitários com uma missão em comum: transformar a gestão financeira
              de software houses no Brasil.
            </p>

            <div class="sn-team-grid">
              @for (membro of membros; track membro.nome) {
                <div class="sn-member-card">
                  <div class="sn-avatar-wrap">
                    <div class="sn-avatar-placeholder-icon">👤</div>
                    <div class="sn-avatar-overlay"></div>
                  </div>
                  <div class="sn-member-name">{{ membro.nome }}</div>
                  <div class="sn-member-role">{{ membro.cargo }}</div>
                  <div class="sn-member-desc">{{ membro.desc }}</div>
                  <div class="sn-add-photo-badge">
                    <span>📷</span> Adicionar foto
                  </div>
                </div>
              }
            </div>
          </div>
        </section>

        <!-- CTA -->
        <section class="sn-cta">
          <h2>Pronto para blindar sua margem?</h2>
          <p>
            Junte-se à próxima geração de Software Houses que gerenciam
            budget com inteligência e profissionalismo.
          </p>
          <div class="sn-cta-buttons">
            <button class="btn btn-primary" (click)="goRegister()">
              Criar conta gratuita
            </button>
            <button class="btn btn-ghost" (click)="goHome()">
              Conhecer a plataforma
            </button>
          </div>
        </section>

      </div>
    </div>
  `
})
export class SobreNosComponent {
  constructor(private router: Router) {}

  goHome()     { this.router.navigate(['/']); }
  goRegister() { this.router.navigate(['/registro']); }

  membros = [
    {
      nome: 'Criador 1',
      cargo: 'Full Stack Developer',
      desc: 'Responsável pela arquitetura do sistema e integrações de backend com Spring Boot.'
    },
    {
      nome: 'Criador 2',
      cargo: 'Frontend Engineer',
      desc: 'Criou toda a experiência visual da plataforma com Angular e o design system exclusivo.'
    },
    {
      nome: 'Criador 3',
      cargo: 'Product & Business',
      desc: 'Definiu a proposta de valor e o modelo de negócio voltado para Software Houses.'
    },
    {
      nome: 'Criador 4',
      cargo: 'Data & Infrastructure',
      desc: 'Construiu os módulos de custos de Cloud e a lógica de Budget Guard em tempo real.'
    }
  ];
}
