# DevFlow — Brief de Redesign Front-end (Handoff para Claude Code)

> Coloque este arquivo na raiz do projeto Angular do DevFlow e inicie o Claude Code lá:
> `claude` → primeiro prompt: "Leia DEVFLOW-DESIGN-BRIEF.md e siga as instruções."

## Contexto do produto

DevFlow é um SaaS B2B de viabilidade financeira e consumo de orçamento de contratos de tecnologia:

- Dashboard Executivo: KPIs financeiros e Burn Rate
- Gestão de Timesheets: horas → custos reais de alocação
- Controle de Custos: faturas de nuvem (AWS/Azure/GCP) e licenciamento de APIs
- Budget Guard: alertas visuais e travas financeiras (80% / 100%)
- Project Closeout: relatórios gerenciais em PDF

## Stack (não alterar)

- Angular 21, Standalone Components, Signals + RxJS, TypeScript
- Estilização: CSS3 nativo com Custom Properties (design system próprio, sem frameworks CSS)
- Escopo: ESTRITAMENTE front-end. Não tocar em backend, npm ou dependências existentes.

## Passo 1 — Análise obrigatória antes de qualquer mudança

1. Localizar e ler os tokens do design system (provável `src/styles.css` ou `src/styles/` — custom properties `--*`).
2. Extrair e documentar a paleta de cores e as fontes ATUAIS do DevFlow. Elas devem ser MANTIDAS em todo o novo design.
3. Mapear componentes existentes (sidebar, cards, tabelas, formulários) e rotas/páginas.

## Passo 2 — Objetivos do redesign

1. **Dashboards premium**: formatação impecável, visualização de dados clara, minimalismo + divulgação progressiva (KPIs principais em destaque, detalhes sob demanda).
2. **Interatividade avançada**:
   - Fundos dinâmicos (vídeo/gradientes animados/3D sutil) que reagem à interação ou ao estado da app
   - Elementos 3D com hover/click (CSS 3D transforms preferível; avaliar custo de libs)
   - Microinterações e animações fluidas em botões, cards, navegação
   - Animações contextuais (scroll, transição de rota) — interface "viva"
3. **Logo DevFlow**: moderna, sofisticada, harmonizada com a paleta existente (SVG inline, animável).
4. **Performance**: animações via transform/opacity, `prefers-reduced-motion`, lazy de assets pesados, responsivo desktop/mobile.

## Referências visuais disponíveis (curso Fundamentos de Vibe Design)

Pasta local: `D:\Desktop e Nuvem\Fundamentos de Vibe Design\`

- `Banco de referências\referencias\` — 12 páginas HTML completas: destaque para `cool-dashboard` (dark, glassmorphism, cards bento grid, border-gradients, backdrop-blur), `dashboard-list`, `glass-effect`, `animation-clean`, `animations-gemini`
- `Banco de referências\design systems\` — 21 design systems exportados (aura.build): `lumina-video`, `glass-pricing`, `flux-motion`, `futureui`, `parallax-geometry` etc.
- `Extract HTML Design System.md` — prompt para gerar `design-system.html` (pattern library viva) a partir de um HTML de referência. Usar este processo para documentar o design system do DevFlow após o redesign.

Padrões observados nas referências premium: dark mode neutro (`neutral-950`), cards com `border-gradient` de 1px + `backdrop-blur`, raios generosos (24px), tipografia com tracking apertado em títulos, badges/uppercase com letter-spacing largo, micro-toggles e ícones duotone.

## Critérios de avaliação

Qualidade do design, nível de interatividade, aderência à identidade visual existente (paleta/fontes do DevFlow) e performance.
