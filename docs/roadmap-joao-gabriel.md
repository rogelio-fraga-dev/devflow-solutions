# ⚙️ Roadmap — João Gabriel Barbosa
**Projeto Integrador ADS 2026/01 — DevFlow Solutions**
**Responsabilidades:** Backend (Core, Endpoints, Multi-tenant) e Frontend (Integração, Dashboard, Componentes Internos)

---

## ⚙️ BACKEND — Core & Regras de Negócio

### 0. Bugs Críticos de Integração
- **BUG 01:** Persistência de `nome` e `ativo` no Usuário.
- **BUG 02:** Inclusão do claim `role` no JWT.
- **BUG 03:** Endpoint de listagem geral de Timesheets.

### 2. Novos Endpoints e Serviços
- **2.1 Dashboard Executivo:** Endpoint `/api/v1/analise/dashboard-executivo` consolidado.
- **2.2 Ranking de Produtividade:** Ranking de custos por desenvolvedor.

### 3. Estrutura Multi-tenant (Empresa)
- Implementação da entidade `Empresa`, isolamento de dados por `empresa_id` e fluxo de registro vinculado.

### 4. Evoluções de Domínio (V1.5)
- **4.1 Forecast de Esgotamento:** Lógica de previsão de data de estouro do budget.
- **4.2 Aprovação de Timesheet:** Fluxo de aprovação/rejeição pelo gestor.
- **4.3 Billable vs Non-Billable:** Diferenciação de tipos de horas para o DRE.

---

## 🎨 FRONTEND — Componentes & Integração

### 0. Bugs Críticos (Lado Frontend)
- **BUG 01:** Campo `clienteNome` na model de projeto.
- **BUG 02:** Otimização de N+1 requisições no Timesheet.
- **BUG 03:** Limpeza de header redundante no App Shell.
- **BUG 04:** Fallback de segurança no `AuthService`.

### 4. Sidebar Inteligente Role-Based
- Lógica de exibição de menus baseada em `ADMIN` vs `DESENVOLVEDOR`.

### 5. Dashboard Executivo — Tela Financeira
- Construção da tela `/app/financeiro` com KPI Cards e tabela de Burn Rate.

### 6. Página de Perfil
- Tela de dados pessoais, alteração de senha e estatísticas do usuário.

### 7. Central de Ajuda
- Seção de FAQ e guias rápidos.

### 8. Detalhes do Projeto — Gráficos
- Gráfico de Burn Rate usando Chart.js e banners de alerta dinâmicos.

---

## 📊 Resumo de Entregas (Visão João)
- Estabilidade da API e integridade dos dados entre front/back.
- Implementação de todas as regras financeiras (DRE, Burn Rate, Forecast).
- Interface administrativa e de usuário fluida e integrada.
