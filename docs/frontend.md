# 🎨 DevFlow Manager — Roadmap Frontend
**Projeto Integrador ADS 2026/01 — DevFlow Solutions**
**Stack:** Angular 21 · TypeScript · SCSS · Standalone Components · Chart.js

> Documento exclusivo de frontend. Para backend, ver `ROADMAP_BACKEND.md`.

---

## 📋 Índice

| # | Seção | Prioridade |
|---|---|---|
| 0 | Bugs Críticos de Integração (lado frontend) | 🔴 IMEDIATO |
| 1 | Identidade Visual DevFlow | 🟠 ALTA |
| 2 | Landing Page — Refatoração Completa | 🟠 ALTA |
| 3 | Página de Registro | 🟠 ALTA |
| 4 | Sidebar Inteligente Role-Based | 🟠 ALTA |
| 5 | Dashboard Executivo — Tela `/app/financeiro` | 🟡 MÉDIA |
| 6 | Página de Perfil | 🟡 MÉDIA |
| 7 | Central de Ajuda | 🟡 MÉDIA |
| 8 | Detalhes do Projeto — Gráfico e Alertas | 🟡 MÉDIA |
| 9 | Responsividade Mobile | 🟠 ALTA |

---

## 🔴 PARTE 0 — Bugs Críticos (Lado Frontend)

Identificados na auditoria `elias-front` ↔ `rogeliofraga-dev`. **Resolver primeiro.**

---

### BUG 01 — `projeto.model.ts`: campo `clienteNome` ausente

**Problema:** O backend retorna `clienteNome` no JSON mas o TypeScript descarta silenciosamente porque o campo não está declarado na interface.

**`src/app/core/models/projeto.model.ts` — adicionar:**
```typescript
export interface Projeto {
  id: number;
  nome: string;
  stackTecnologica?: string;
  budgetTotal: number;
  custoAtualAcumulado: number;
  dataInicio: string;
  dataPrevisaoEntrega?: string;
  status: StatusProjeto;
  clienteId?: number;
  clienteNome?: string;  // ← ADICIONAR
}
```

---

### BUG 02 — `timesheet.component.ts`: N+1 requisições

**Problema:** O componente atual faz uma requisição por desenvolvedor para montar a lista de timesheets. Com muitos devs isso causa lentidão e risco de timeout.

**`src/app/core/services/timesheet.service.ts` — adicionar método:**
```typescript
getAll(): Observable<Timesheet[]> {
  return this.http.get<Timesheet[]>(`${this.apiUrl}/timesheets`);
}
```

**`timesheet.component.ts` — substituir o carregamento atual:**
```typescript
// ANTES (ruim — N requisições paralelas):
Promise.all(devIds.map(id => this.svc.getByDesenvolvedor(id).toPromise()))

// DEPOIS (correto — 1 requisição):
this.timesheetSvc.getAll().subscribe(timesheets => {
  this.timesheets = timesheets;
});
```

---

### BUG 03 — `app-shell.component.ts`: header interno redundante

**Problema:** O `<app-header>` existe dentro da `<app-shell>` em duplicidade com a sidebar, criando dois elementos de navegação sobrepostos.

**`app-shell.component.ts` — remover `<app-header>` e simplificar o template:**
```typescript
template: `
  <div class="app-layout">
    <app-sidebar
      [navItems]="navItems"
      [collapsed]="sidebarCollapsed"
    />
    <main class="app-main" [class.sidebar-collapsed]="sidebarCollapsed">
      <!-- Botão hambúrguer para mobile -->
      <button class="hamburger-btn" (click)="toggleSidebar()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <router-outlet />
    </main>
  </div>
`
```

---

### BUG 04 — `auth.service.ts`: extração de `role` do JWT pode ser undefined

**Problema:** Se o backend não incluir o claim `role` no token (ver BUG 02 do backend), `currentUser().role` é sempre `undefined`, quebrando qualquer lógica de controle de acesso no frontend.

**`auth.service.ts` — adicionar fallback defensivo:**
```typescript
private decodeToken(token: string): CurrentUser | null {
  try {
    const decoded: any = jwtDecode(token);
    return {
      email: decoded.sub,
      role: decoded.role ?? 'DESENVOLVEDOR' // fallback seguro enquanto o backend não é corrigido
    };
  } catch {
    return null;
  }
}
```

---

## 🟠 PARTE 1 — Identidade Visual DevFlow

### 1.1 Criar uma Identidade Visual para a Empresa DevFlow

A DevFlow Solutions precisa de uma identidade coesa e memorável. DNA: B2B, fintech de TI, startups de software.



## 🟠 PARTE 2 — Landing Page — Refatoração Completa

### Estrutura do Header de Navegação

Remover o item **"Recursos"** (redundante com "Funcionalidades"). Estrutura final:

```
[Logo DevFlow]   Funcionalidades | Sobre | Planos | Suporte   [Acesso Plataforma] [Iniciar Grátis →]
```

- **"Acesso Plataforma"** → ghost button → rota `/login`
- **"Iniciar Grátis"** → botão em gradiente roxo → rota `/registro`

---

### Seções da Landing

**SEÇÃO 1 — Hero:**
```typescript
// Headline impactante (baseado na dor real do cliente):
h1 = "Seu projeto tem uma data de quebrar o orçamento. Você sabe qual é?";

// Subheadline:
sub = `DevFlow rastreia horas, cloud e APIs em tempo real.
       O Budget Guard te avisa antes do prejuízo acontecer.`;

// CTAs:
// [Criar conta gratuita →]  [Ver demonstração]  (abre modal de preview do dashboard)
```

**SEÇÃO 2 — Preview Cards (mockup do dashboard animado):**
```typescript
stats = [
  { label: 'Projetos Ativos',    value: '12',    color: '--status-info' },
  { label: 'Em Alerta 🟡',       value: '3',     color: '--status-warning' },
  { label: 'Burn Rate Médio',    value: '67%',   color: '--brand-primary' },
  { label: 'Custo do Mês',       value: 'R$148k', color: '--status-safe' },
];
```

**SEÇÃO 3 — Funcionalidades (3 colunas, grid de 6 cards):**
```typescript
features = [
  {
    icon: '🛡️',
    title: 'Budget Guard Patroll',
    desc: 'Robô sentinela que bloqueia automaticamente novos lançamentos quando o orçamento estoura. Nenhum prejuízo passa despercebido.'
  },
  {
    icon: '📊',
    title: 'DRE em Tempo Real',
    desc: 'Margem de lucro, burn rate e custo acumulado recalculados a cada timesheet aprovado. Decisões baseadas em dados reais.'
  },
  {
    icon: '☁️',
    title: 'Custos Cloud Integrados',
    desc: 'Registre faturas de AWS, Azure ou GCP direto no projeto. Saiba o custo real de cada feature entregue, incluindo infraestrutura.'
  },
  {
    icon: '⚡',
    title: 'Sprints Financeiros',
    desc: 'Cada sprint tem seu peso financeiro calculado. Veja qual fase do desenvolvimento consumiu mais orçamento do cliente.'
  },
  {
    icon: '📋',
    title: 'Change Requests com Estorno',
    desc: 'Mudanças de escopo ajustam o budget automaticamente, com estorno seguro se rejeitadas. Histórico financeiro auditável.'
  },
  {
    icon: '📄',
    title: 'Relatório PDF Executivo',
    desc: 'Exporte o DRE completo em PDF para apresentar ao cliente ou à diretoria. Dados financeiros com sua marca.'
  }
];
```

**SEÇÃO 4 — Sobre a DevFlow:**
```typescript
// "Nascemos de uma dor real: pequenas software houses descobrindo prejuízo
//  só depois da entrega final. A gente resolve isso antes."

// Cards dos 4 fundadores:
equipe = [
  { nome: 'Rogélio Fraga',    role: 'Arquitetura & Backend' },
  { nome: 'João Gabriel',     role: 'Backend & Banco de Dados' },
  { nome: 'Alexandre Vieira', role: 'Frontend & UX' },
  { nome: 'Elias Coelho',     role: 'Frontend & Integração' },
];
```

**SEÇÃO 5 — Planos:**

> "Contratar Planos" vai para a tela de registro e escolha de plano. Por enquanto apenas o Free Beta está disponível.

```typescript
planos = [
  {
    nome: 'Free Beta',
    preco: 'R$ 0/mês',
    badge: '🎯 Disponível agora',
    recursos: [
      '1 empresa',
      'Até 5 projetos simultâneos',
      'Até 3 desenvolvedores',
      'DRE básico por projeto',
      'Budget Guard ativo',
      'Exportação PDF'
    ],
    destaque: false,
    cta: 'Criar conta gratuita',
    acao: '/registro'
  },
  {
    nome: 'Starter',
    preco: 'R$ 97/mês',
    badge: '⏳ Em breve',
    recursos: [
      'Projetos ilimitados',
      'Até 10 desenvolvedores',
      'Change Requests com estorno',
      'Dashboard executivo cross-project',
      'Forecast de esgotamento',
      'Suporte por email'
    ],
    destaque: true,
    cta: 'Contratar (em breve)',
    acao: '#planos'
  },
  {
    nome: 'Scale',
    preco: 'R$ 247/mês',
    badge: '⏳ Em breve',
    recursos: [
      'Tudo do Starter',
      'Desenvolvedores ilimitados',
      'Multi-projeto por cliente',
      'Aprovação de timesheets',
      'API pública',
      'Suporte prioritário'
    ],
    destaque: false,
    cta: 'Contratar (em breve)',
    acao: '#planos'
  }
];
```

**SEÇÃO 6 — Suporte:**
```typescript
// FAQ accordion com 4 perguntas:
faq = [
  { q: 'Como funciona o Budget Guard?',
    a: 'O Budget Guard monitora cada lançamento de timesheet ou custo cloud. Ao atingir 80% do orçamento, o projeto entra em ALERTA. Ao atingir 100%, novos lançamentos são bloqueados automaticamente no banco de dados.' },
  { q: 'Como lançar um timesheet?',
    a: 'Vá em "Lançar Horas" na sidebar, selecione o projeto e a sprint, informe as horas trabalhadas e clique em registrar. O custo é calculado automaticamente pelo seu valor-hora cadastrado.' },
  { q: 'Como gerar o relatório PDF?',
    a: 'Na tela de Financeiro, selecione o projeto e clique em "Exportar DRE". O PDF é gerado com margem de lucro, burn rate e histórico de custos.' },
  { q: 'Como cadastrar um custo de AWS no projeto?',
    a: 'Acesse "Custos Cloud" na sidebar, selecione o projeto, informe o provedor (AWS, Azure, GCP), o valor da fatura e o mês de competência.' },
];

// Contato:
// Email: suporte@devflow.solutions
// Horário: Seg–Sex · 9h às 18h
```

---

## 🟠 PARTE 3 — Página de Registro

**Nova rota em `app.routes.ts`:**
```typescript
{
  path: 'registro',
  loadComponent: () => import('./pages/registro/registro.component')
    .then(m => m.RegistroComponent)
}
```

**Fluxo em 2 steps:**

```
Landing → "Iniciar Grátis" → /registro
```

**Step 1 — Dados da Empresa:**
```html
<!-- Campos: -->
Razão Social / Nome Fantasia *
CNPJ * (máscara: 00.000.000/0000-00)
Cidade e Estado (opcional)
```

**Step 2 — Dados do Administrador:**
```html
<!-- Ao se registrar, você será o ADMIN da empresa. -->
<!-- Depois convide seus desenvolvedores em Configurações → Usuários. -->

Nome completo *
Email *
Senha * (exibir indicador de força: Fraca / Média / Forte)
Confirmar senha *
[✓] Checkbox: "Concordo com os Termos de Uso"
```

**Após submissão:**
```typescript
// POST /api/v1/auth/registrar
// Em caso de sucesso:
// → salvar token no localStorage (padrão do auth.service)
// → redirecionar para /app/projetos
// → exibir toast:
this.toast.success('Empresa criada! Você é o administrador. Convide seus devs em Usuários.');
```

**`registro.component.ts` — estrutura básica:**
```typescript
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `...` // 2 steps com transição CSS suave
})
export class RegistroComponent {
  step = signal(1);
  isLoading = signal(false);

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

  avancar() {
    if (this.empresaForm.valid) this.step.set(2);
  }

  registrar() {
    if (this.adminForm.valid) {
      this.isLoading.set(true);
      const payload = { ...this.empresaForm.value, ...this.adminForm.value };
      this.authService.registrar(payload).subscribe({
        next: (res) => {
          // salvar token e redirecionar
        },
        error: (err) => {
          this.isLoading.set(false);
          this.toast.error(err.message);
        }
      });
    }
  }
}
```

---

## 🟠 PARTE 4 — Sidebar Inteligente Role-Based

Retirar o header de dentro da plataforma. A sidebar é o único elemento de navegação interno.

**`app-shell.component.ts` — navItems diferenciados por role:**

```typescript
ngOnInit() {
  const role = this.auth.currentUser()?.role;
  this.navItems = role === 'DESENVOLVEDOR' ? this.navDev : this.navAdmin;
}

// NAV COMPLETA — CTO / ADMIN / GESTOR
private navAdmin: NavItem[] = [
  { label: 'Projetos',         path: '/app/projetos',        icon: 'folder'    },
  { label: 'Sprints',          path: '/app/sprints',         icon: 'zap'       },
  { label: 'Timesheets',       path: '/app/timesheet',       icon: 'clock'     },
  { label: 'Change Requests',  path: '/app/change-requests', icon: 'refresh'   },
  { label: 'Dashboard',        path: '/app/financeiro',      icon: 'dollar'    },
  { label: 'Clientes',         path: '/app/clientes',        icon: 'briefcase' },
  { label: 'Desenvolvedores',  path: '/app/desenvolvedores', icon: 'code'      },
  { label: 'Usuários',         path: '/app/usuarios',        icon: 'users'     },
  { label: 'Custos Cloud',     path: '/app/custos-cloud',    icon: 'cloud'     },
  { label: 'Custos de APIs',   path: '/app/custos-api',      icon: 'cpu'       },
  { label: 'Ajuda',            path: '/app/ajuda',           icon: 'help'      },
];

// NAV RESTRITA — DESENVOLVEDOR
private navDev: NavItem[] = [
  { label: 'Meus Projetos',   path: '/app/projetos',         icon: 'folder'    },
  { label: 'Lançar Horas',   path: '/app/timesheet',         icon: 'clock'     },
  { label: 'Meus Sprints',   path: '/app/sprints',           icon: 'zap'       },
  { label: 'Ajuda',          path: '/app/ajuda',             icon: 'help'      },
];
```

**`sidebar.component.ts` — visual Glassmorphism:**
```scss
.sidebar {
  background: rgba(15, 15, 20, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
}
```

---

## 🟡 PARTE 5 — Dashboard Executivo — Tela `/app/financeiro`

Substituir o conteúdo atual da tela financeira pelo novo Dashboard Executivo consolidado, consumindo `GET /api/v1/analise/dashboard-executivo`.

**Layout proposto em `financeiro.component.ts`:**

```typescript
// LINHA 1 — KPI Cards (6 cards na horizontal):
// [Total Projetos] [Em Andamento] [Em Alerta 🟡] [Estourados 🔴] [Budget Global] [Burn Rate %]

// LINHA 2 — Tabela de Projetos com barra de progresso visual:
// Colunas: Projeto | Cliente | Budget | Custo Atual | Burn Rate | Status | Ações
// Barra de progresso na coluna Burn Rate:
// Verde < 60% | Amarelo 60-80% | Vermelho > 80%
// Ações: [Ver DRE] [Exportar PDF]

// LINHA 3 — Ranking de Desenvolvedores (tabela compacta):
// Dev | Senioridade | Horas Lançadas | Custo Gerado
// Consumindo GET /api/v1/desenvolvedores/produtividade

// MODAL de DRE individual:
// Ao clicar em "Ver DRE" abre um modal com:
// Budget Total | Custo Atual | Margem | Burn Rate % | Previsão de Esgotamento
// Botão "Exportar PDF" → GET /api/v1/relatorio/pdf/{projetoId}
```

**Status badges com cores semânticas:**
```typescript
getStatusBadge(status: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    RASCUNHO:     { label: 'Rascunho',     color: 'var(--status-neutral)'  },
    PLANEJADO:    { label: 'Planejado',    color: 'var(--status-info)'     },
    EM_ANDAMENTO: { label: 'Em Andamento', color: 'var(--brand-primary)'   },
    ALERTA:       { label: '⚠️ Alerta',    color: 'var(--status-warning)'  },
    ESTOURADO:    { label: '🔴 Estourado', color: 'var(--status-danger)'   },
    PAUSADO:      { label: 'Pausado',      color: 'var(--status-neutral)'  },
    CONCLUIDO:    { label: '✅ Concluído', color: 'var(--status-safe)'     },
    CANCELADO:    { label: 'Cancelado',    color: 'var(--status-danger)'   },
  };
  return map[status] ?? { label: status, color: 'var(--status-neutral)' };
}
```

---

## 🟡 PARTE 6 — Página de Perfil

**Nova rota:** `/app/perfil`

```typescript
// Dados exibidos:
// - Nome completo e email do usuário logado
// - Role (ex: ADMIN, DESENVOLVEDOR)
// - Senioridade (se for dev vinculado)
// - Custo-hora atual (se for dev)
// - Empresa vinculada
// - Formulário de alteração de senha (campos: senha atual, nova senha, confirmar)
// - Estatísticas rápidas: Total de horas lançadas | Projetos participados | Custo gerado
```

**Nova entrada na sidebar do desenvolvedor:**
```typescript
{ label: 'Meu Perfil', path: '/app/perfil', icon: 'user' }
```

---

## 🟡 PARTE 7 — Central de Ajuda

**Nova rota:** `/app/ajuda`

Seguindo o design de card com ícone de interrogação já presente na sidebar.

```typescript
// 3 cards de acesso rápido no topo:
cards = [
  { icon: '📖', title: 'Como usar o DevFlow',    desc: 'Guia passo a passo para começar' },
  { icon: '💰', title: 'Entendendo o Budget Guard', desc: 'Como funciona o bloqueio automático' },
  { icon: '📞', title: 'Falar com o Suporte',    desc: 'suporte@devflow.solutions' },
];

// Seção FAQ (accordion):
faq = [
  { q: 'Como lançar um timesheet?',
    a: 'Acesse "Lançar Horas" na sidebar → selecione o projeto e sprint → informe as horas → clique em Registrar.' },
  { q: 'O que é o Budget Guard Patroll?',
    a: 'É o nosso motor de segurança financeira. Ele monitora cada lançamento e bloqueia automaticamente novos custos quando o orçamento do projeto é totalmente consumido.' },
  { q: 'Como gerar o relatório PDF?',
    a: 'Na tela de Dashboard → selecione o projeto → clique em "Exportar DRE". O PDF inclui margem de lucro, burn rate e histórico.' },
  { q: 'Como cadastrar um custo de nuvem?',
    a: 'Acesse "Custos Cloud" → clique em "+ Novo" → selecione o projeto, o provedor (AWS/Azure/GCP), valor e mês de competência.' },
  { q: 'Como convidar desenvolvedores para a minha empresa?',
    a: 'Acesse "Usuários" → clique em "+ Novo Usuário" → informe nome, email e defina a role como DESENVOLVEDOR.' },
];
```

---

## 🟡 PARTE 8 — Detalhes do Projeto: Gráfico e Alertas Visuais

### 8.1 Gráfico de Burn Rate na Tela de Detalhe

**`projeto-detalhe.component.ts` — adicionar gráfico Chart.js:**
```typescript
import * as Chart from 'chart.js';

// Dados: budget total (linha horizontal) vs custo acumulado por sprint (linha crescente)
buildChart() {
  const labels = this.sprints.map(s => s.nomeFase);
  const budgetLine = this.sprints.map(() => this.projeto.budgetTotal);
  const custoLine = this.calcularCustoAcumuladoPorSprint();

  new Chart.Chart(this.canvasRef.nativeElement, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Budget Total',
          data: budgetLine,
          borderColor: 'var(--status-safe)',
          borderDash: [6, 3],
          fill: false,
          tension: 0
        },
        {
          label: 'Custo Acumulado',
          data: custoLine,
          borderColor: 'var(--brand-primary)',
          backgroundColor: 'rgba(99, 102, 241, 0.12)',
          fill: true,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: true } }
    }
  });
}
```

---

### 8.2 Banners de Alerta Persistentes por Status

```typescript
// Template em projeto-detalhe.component.ts:
template: `
  @if (projeto?.status === 'ALERTA') {
    <div class="alert-banner warning">
      <span>⚠️</span>
      <div>
        <strong>Atenção: orçamento em risco.</strong>
        Este projeto atingiu {{ dre?.burnRatePercentual | number:'1.1-1' }}% do budget aprovado.
        <a routerLink="/app/change-requests">Solicitar aditivo de escopo →</a>
      </div>
    </div>
  }

  @if (projeto?.status === 'ESTOURADO') {
    <div class="alert-banner danger">
      <span>🔴</span>
      <div>
        <strong>Budget esgotado — Budget Guard ativo.</strong>
        Novos lançamentos de timesheet e custos estão bloqueados.
        <a routerLink="/app/change-requests">Solicitar Change Request →</a>
      </div>
    </div>
  }

  @if (dre?.dataPrevisaoEsgotamento) {
    <div class="alert-banner info">
      <span>🔮</span>
      <div>
        Previsão de esgotamento: <strong>{{ dre.dataPrevisaoEsgotamento | date:'dd/MM/yyyy' }}</strong>
        ({{ dre.diasRestantesEstimados | number:'1.0-0' }} dias com o ritmo atual)
      </div>
    </div>
  }
`
```

**`styles.scss` — CSS dos banners:**
```scss
.alert-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.5;

  a { color: inherit; font-weight: 600; text-decoration: underline; margin-left: 6px; }

  &.warning {
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.3);
    color: #FCD34D;
  }
  &.danger {
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #FCA5A5;
  }
  &.info {
    background: rgba(99, 102, 241, 0.12);
    border: 1px solid rgba(99, 102, 241, 0.3);
    color: #A5B4FC;
  }
}
```

---

## 🟠 PARTE 9 — Responsividade Mobile

**`styles.scss` — breakpoints globais:**
```scss
// Tablet (sidebar recolhe)
@media (max-width: 1024px) {
  .app-layout {
    .sidebar {
      position: fixed;
      z-index: 100;
      transform: translateX(-100%);
      transition: transform 0.25s ease;

      &.open { transform: translateX(0); }
    }
    .app-main { margin-left: 0 !important; }
  }
  .hamburger-btn { display: flex; }
}

// Mobile
@media (max-width: 768px) {
  // Landing
  .landing-nav { padding: 0 20px; }
  .landing-nav a { display: none; }
  .landing-hero h1 { font-size: clamp(24px, 6vw, 36px); }
  .landing-hero p  { font-size: 15px; }

  // Planos — 1 coluna
  .plans-grid     { grid-template-columns: 1fr; gap: 12px; }

  // Features — 1 coluna
  .features-grid  { grid-template-columns: 1fr; }

  // KPI cards — 2 colunas
  .kpi-grid       { grid-template-columns: repeat(2, 1fr); }

  // Tabelas — scroll horizontal
  .table-wrapper  { overflow-x: auto; }
  table           { min-width: 600px; }

  // Modais — fullscreen no mobile
  .modal-content  { width: 100vw; height: 100vh; border-radius: 0; }
}

// Mobile pequeno (< 480px)
@media (max-width: 480px) {
  .kpi-grid   { grid-template-columns: 1fr; }
  .hero-cta   { width: 100%; text-align: center; }
}
```

**`app-shell.component.ts` — controle do hambúrguer:**
```typescript
sidebarOpen = signal(false);

toggleSidebar() {
  this.sidebarOpen.update(v => !v);
}

// Fechar sidebar ao navegar (em mobile):
constructor(private router: Router) {
  this.router.events.pipe(
    filter(e => e instanceof NavigationEnd)
  ).subscribe(() => this.sidebarOpen.set(false));
}
```

---

## 📊 Resumo de Prioridades Frontend

```
🔴 ESTA SEMANA (bugs)
├── BUG 01: clienteNome no projeto.model.ts      ← 5 min
├── BUG 02: getAll() no timesheet.service.ts     ← 30 min
├── BUG 03: Remover header duplicado do shell    ← 10 min
└── BUG 04: Fallback de role no auth.service     ← 10 min

🟠 ESTA SEMANA (features)
├── Identidade Visual (paleta + vars CSS)        ← 1h
├── Landing Page completa (todas as seções)      ← 4h
├── Sidebar role-based (admin vs dev)            ← 1h
└── Registro de empresa (2 steps)               ← 3h

🟡 PRÓXIMA SEMANA
├── Dashboard executivo (financeiro.component)   ← 3h
├── Página de Perfil                             ← 2h
├── Central de Ajuda                             ← 1.5h
├── Banners de alerta na tela de projeto         ← 1h
└── Gráfico burn rate no detalhe                 ← 2h

🟠 PRÉ-ENTREGA
├── Responsividade mobile (todos os breakpoints) ← 2h
├── ng build --configuration production          ← 30 min
├── Upload no S3 + invalidar CloudFront          ← 20 min
└── Smoke test no domínio CloudFront             ← 30 min
```

---

**DevFlow Solutions — ADS 2026/01**
*Rogélio Claro Fraga · João Gabriel Barbosa · Alexandre Farias Vieira · Elias Coelho Gomes Fernandes*