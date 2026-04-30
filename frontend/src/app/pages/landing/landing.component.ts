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
        <a href="#">Recursos</a>
        <a href="#">Funcionalidades</a>
        <a href="#">Planos</a>
        <a href="#">Suporte</a>
        <button class="btn btn-ghost" style="margin-left:8px;border-color:rgba(255,255,255,.15);color:rgba(255,255,255,.7)"
          (click)="goLogin()">Entrar</button>
        <button class="btn btn-primary" (click)="goLogin()">Contratar</button>
      </nav>

      <!-- Hero -->
      <section class="landing-hero">
        <div class="badge">
          <span class="dot"></span>
          Plataforma de Gestão de Projetos
        </div>
        <h1>Otimize sua gestão<br>de projetos tech</h1>
        <p>Controle sprints, timesheets, custos de cloud e APIs com precisão.<br>Tudo em um só lugar, em tempo real.</p>
        <button class="hero-cta" (click)="goLogin()">
          Começar agora →
        </button>
      </section>

      <!-- Preview cards -->
      <section style="padding:0 48px 60px;max-width:900px;margin:0 auto;position:relative;z-index:1">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px">
          @for (s of stats; track s.label) {
            <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:16px">
              <div style="font-size:11px;color:rgba(255,255,255,.5);margin-bottom:4px">{{s.label}}</div>
              <div style="font-size:22px;font-weight:800;color:#fff">{{s.value}}</div>
            </div>
          }
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">
          @for (p of projects; track p.name) {
            <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:16px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                <span style="font-weight:600;font-size:13px">{{p.name}}</span>
                <span style="font-size:11px;padding:2px 8px;border-radius:20px;background:rgba(99,102,241,.2);color:#a5b4fc">{{p.status}}</span>
              </div>
              <div style="background:rgba(255,255,255,.1);border-radius:99px;height:4px;overflow:hidden">
                <div style="height:100%;border-radius:99px;background:linear-gradient(90deg,#6366F1,#7C3AED)" [style.width]="p.pct + '%'"></div>
              </div>
              <div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:6px">{{p.pct}}% concluído</div>
            </div>
          }
        </div>
      </section>

      <!-- Features -->
      <section style="padding:0 48px 80px;max-width:900px;margin:0 auto;position:relative;z-index:1">
        <h2 style="text-align:center;font-size:28px;font-weight:800;margin-bottom:32px;color:#fff">Por que escolher o DevFlow?</h2>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
          @for (f of features; track f.title) {
            <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:24px">
              <div style="font-size:28px;margin-bottom:12px">{{f.icon}}</div>
              <h3 style="color:#fff;font-size:15px;margin-bottom:8px">{{f.title}}</h3>
              <p style="color:rgba(255,255,255,.5);font-size:13px;line-height:1.6">{{f.desc}}</p>
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

  stats = [
    { label: 'Projetos ativos',  value: '4+' },
    { label: 'Sprints gerenciadas', value: '12+' },
    { label: 'Horas registradas', value: '840h' },
    { label: 'Economia gerada', value: 'R$1,2M' },
  ];

  projects = [
    { name: 'Portal E-commerce', status: 'Em Andamento', pct: 68 },
    { name: 'App Mobile',        status: 'Planejado',    pct: 15 },
    { name: 'API Financeira',    status: 'Em Andamento', pct: 82 },
    { name: 'Dashboard BI',      status: 'Alerta',       pct: 91 },
  ];

  features = [
    { icon: '📋', title: 'Gestão de Sprints', desc: 'Acompanhe todas as fases do ciclo de desenvolvimento com visibilidade total.' },
    { icon: '📊', title: 'Timesheet Inteligente', desc: 'Registre horas trabalhadas e extras com relatórios automáticos por projeto.' },
    { icon: '💸', title: 'Controle Financeiro', desc: 'Monitore custos de cloud, APIs e controle o orçamento em tempo real.' },
  ];
}
