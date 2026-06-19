<p align="center">
  <img src="https://img.shields.io/badge/Angular_21-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular"/>
  <img src="https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=java&logoColor=white" alt="Java"/>
  <img src="https://img.shields.io/badge/Spring_Boot_4-F2F4F9?style=for-the-badge&logo=spring-boot" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/TypeScript_5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/PostgreSQL_16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JWT"/>
</p>

# 🚀 DevFlow Solutions

> **Subdomínio de Produção:** [`devflow.adsimepac.com.br`](http://devflow.adsimepac.com.br)

> **Plataforma de Gestão de Projetos e Dashboards C-Level** focada em motor financeiro, alocação de timesheets e acompanhamento corporativo em tempo real. Uma solução completa que une uma API robusta em Spring Boot 4 a uma interface moderna e reativa em Angular 21.

---

## 📋 Informações do Projeto Integrador

| Item                     | Detalhe                                                     |
| ------------------------ | ----------------------------------------------------------- |
| **Nome do Projeto**      | DevFlow Solutions                                           |
| **Subdomínio**           | `devflow.adsimepac.com.br`                                  |
| **Banco de Dados**       | **PostgreSQL 16** — nome do banco: `devflow_db`             |
| **Arquitetura**          | **Monolito com Frontend Separado** (API REST + SPA)         |
| **Java**                 | **Java 21 LTS** (Eclipse Temurin)                           |
| **Framework Backend**    | Spring Boot 4.0.3                                           |
| **Frontend Separado?**   | ✅ Sim — **Angular 21** (TypeScript 5.9)                    |
| **Porta do Backend**     | `8080`                                                      |
| **Porta do Frontend**    | `80` (Nginx/produção) · `4200` (dev local)                  |
| **Porta do PostgreSQL**  | `5432` (host) → `5432` (container)                          |
| **Dockerfile**           | ✅ Sim — `backend/Dockerfile` + `frontend/Dockerfile`       |
| **Docker Compose**       | ✅ Sim — `docker-compose.yml` (3 serviços)                  |

---

## 📞 Contato

Em caso de dúvida ou erro no deploy, entre em contato:

| Nome             | Telefone/WhatsApp        | Papel              |
| ---------------- | ------------------------ | ------------------- |
| **Rogélio Claro** | **(34) 98414-1504**     | Responsável Técnico |

---

## 👨‍💻 Equipe de Desenvolvimento

### ⚙️ Engenharia Backend e Infraestrutura
- **Rogélio Claro Fraga**
- **João Gabriel Barbosa Araujo Campos**

### 🎨 Engenharia Frontend e UX/UI Design
- **Elias Fernandes**
- **Alexandre Farias**

---

## 🏗️ Arquitetura

A aplicação segue a arquitetura **Monolito com Frontend Separado**:

```
┌──────────────────────────────────────────────────────────────┐
│                    devflow.adsimepac.com.br                   │
├────────────────────────┬─────────────────────────────────────┤
│    Frontend (SPA)      │          Backend (API REST)         │
│    Angular 21          │          Spring Boot 4              │
│    Nginx (:80)         │  ──→     Tomcat (:8080)             │
│    TypeScript 5.9      │          Java 21                    │
├────────────────────────┴─────────────────────────────────────┤
│                  PostgreSQL 16 (:5432)                       │
│                     Banco: devflow_db                        │
└──────────────────────────────────────────────────────────────┘
```

- **Frontend** → SPA Angular servida por **Nginx**, que também faz **proxy reverso** para a API.
- **Backend** → API REST stateless com autenticação **JWT**. Endpoints sob `/api/v1/`.
- **Banco** → PostgreSQL 16 com Hibernate 6 e `ddl-auto=update`.

---

## 🛠️ Stack Tecnológica

### Frontend
| Tecnologia       | Versão         |
| ---------------- | -------------- |
| Angular          | 21.2.x         |
| TypeScript       | 5.9.2          |
| RxJS             | 7.8.x          |
| PrimeNG          | 21.1.1         |
| Chart.js         | 4.5.1          |
| SCSS / CSS3      | —              |

### Backend
| Tecnologia         | Versão         |
| ------------------ | -------------- |
| Java               | 21 LTS         |
| Spring Boot        | 4.0.3          |
| Spring Security    | JWT (Auth0 4.4)|
| Hibernate / JPA    | 6.x            |
| Lombok             | —              |
| iTextPDF           | 5.5.13.3       |
| PostgreSQL Driver  | 42.x (runtime) |

### Infraestrutura
| Tecnologia       | Versão / Detalhe      |
| ---------------- | --------------------- |
| Docker           | Docker Compose v2     |
| PostgreSQL       | 16                    |
| Nginx            | Alpine                |
| Node.js (build)  | 20.x                  |

---

## 🐳 Docker — Deploy Completo

### Pré-requisitos
- **Docker Desktop** instalado e rodando.

### Subir toda a aplicação

```bash
# Clone o repositório
git clone https://github.com/rogelio-fraga-dev/devflow-solutions.git
cd devflow-solutions

# Sobe tudo (PostgreSQL + Backend + Frontend)
docker compose up -d --build
```

Isso irá:
1. Subir o **PostgreSQL 16** (porta `5432` no host)
2. Buildar e subir o **Backend Spring Boot** (porta `8080`)
3. Buildar e subir o **Frontend Angular via Nginx** (porta `80`)

### Acessar a aplicação
- **Frontend:** [http://localhost](http://localhost) (ou `http://devflow.adsimepac.com.br` em produção)
- **API REST:** [http://localhost:8080/api/v1/](http://localhost:8080/api/v1/)

### Parar tudo

```bash
docker compose down
```

### Arquivos Docker

| Arquivo                      | Descrição                                          |
| ---------------------------- | -------------------------------------------------- |
| `docker-compose.yml`         | Orquestra os 3 serviços (PostgreSQL, Backend, Frontend) |
| `backend/Dockerfile`         | Build multi-stage: JDK 21 (build) → JRE 21 (run)  |
| `frontend/Dockerfile`        | Build multi-stage: Node 20 (build) → Nginx (run)  |
| `frontend/nginx.conf`        | Config do Nginx com proxy reverso para a API       |

---

## 🚀 Deploy em Produção — Variáveis de Ambiente

O `docker-compose.yml` funciona de primeira com defaults de desenvolvimento. Em produção, sobrescreva os valores sensíveis criando um arquivo `.env` na raiz (modelo em [`.env.example`](.env.example)):

```bash
cp .env.example .env
# edite .env com senha do banco e segredo JWT fortes
docker compose up -d --build
```

| Variável | Descrição | Default (dev) |
| -------- | --------- | ------------- |
| `POSTGRES_DB` | Nome do banco | `devflow_db` |
| `POSTGRES_USER` | Usuário do banco | `devflow_user` |
| `POSTGRES_PASSWORD` | Senha do banco | `devflow_senha123` |
| `API_SECURITY_TOKEN_SECRET` | Segredo do JWT (use chave forte/única) | _(default de dev)_ |

> O backend expõe **`GET /actuator/health`** (usado pelo healthcheck do Docker). O Compose só sobe o frontend depois que o backend está **healthy**, evitando 502 no proxy durante a inicialização.

---

## ⚙️ Execução Local (Desenvolvimento)

### 1. Requisitos
- **Node.js** v20+
- **Java JDK** 21
- **Docker Desktop**

### 2. Banco de Dados

```bash
# Sobe apenas o PostgreSQL via Docker
docker compose up devflow-postgres -d
```

### 3. Backend

```bash
cd backend

# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```
API disponível em: `http://localhost:8080`

### 4. Frontend

```bash
cd frontend
npm install
npm start
```
Frontend disponível em: `http://localhost:4200`

---

## 🗃️ Banco de Dados

| Item             | Valor                 |
| ---------------- | --------------------- |
| **SGBD**         | PostgreSQL 16         |
| **Nome do Banco**| `devflow_db`          |
| **Usuário**      | `devflow_user`        |
| **Senha**        | `devflow_senha123`    |
| **Porta (host)** | `5432`                |
| **Porta (container)** | `5432`           |

> ⚠️ O esquema é gerenciado automaticamente pelo Hibernate (`ddl-auto=update`). Ao iniciar o backend, todas as tabelas são criadas/atualizadas automaticamente.

---

## 🔑 Dados de Acesso para Teste

O sistema possui uma **carga inicial de dados (seed)** com dados massivos e diversificados (4 projetos, incluindo cenários de **ALERTA** e **ESTOURADO** do Budget Guard).

### Opção A — Importar o dump SQL (recomendado, portável)

Arquivo: **`docs/devflow_seed.sql`** (schema + dados + credenciais já com hash BCrypt). Funciona em qualquer ambiente (Linux/Windows), sem precisar do backend no ar:

```bash
# Importa no banco devflow_db (criado pelo Docker / docker-compose)
psql -U devflow_user -d devflow_db -f docs/devflow_seed.sql

# Via container Docker:
docker exec -i devflow_db psql -U devflow_user -d devflow_db < docs/devflow_seed.sql
```

### Opção B — Executar o seed via API (PowerShell)

```powershell
# No Windows (PowerShell) — requer o backend rodando em http://localhost:8080
powershell -ExecutionPolicy Bypass -File .\docs\seed-completo.ps1
```

> ⚠️ A Opção B exige o backend rodando em `http://localhost:8080`. A Opção A não exige.

### Credenciais Padrão

| Perfil                  | E-mail                        | Senha         | Role           |
| ----------------------- | ----------------------------- | ------------- | -------------- |
| ⚙️ Admin (Acesso Total) | `admin_final@devflow.com`     | `Admin@2026`  | `ADMIN`        |
| 🎨 Gestor de Projetos   | `gestor_final@devflow.com`    | `Dev@2026`    | `GESTOR`       |
| 👨‍💻 Desenvolvedor 1      | `dev1_final@devflow.com`      | `Dev@2026`    | `DESENVOLVEDOR`|
| 👨‍💻 Desenvolvedor 2      | `dev2_final@devflow.com`      | `Dev@2026`    | `DESENVOLVEDOR`|

### Fluxo de Teste Recomendado

1. Acesse `http://localhost:4200` (ou `http://localhost` via Docker)
2. Faça login com as credenciais de **Admin** acima
3. Navegue pelo **Dashboard**, **Projetos**, **Timesheets** e **Financeiro**
4. Teste diferentes perfis logando com Gestor e Desenvolvedores

---

## 🎯 Funcionalidades Principais

- **Dashboard Executivo:** Visualização rápida de KPIs financeiros e Burn Rate.
- **Gestão de Projetos:** CRUD completo de projetos com sprints e alocação de desenvolvedores.
- **Gestão de Timesheets:** Lançamento de horas e conversão em custos reais de alocação.
- **Controle Financeiro:** Análise de custos, receitas e margens por projeto.
- **Budget Guard:** Sistema inteligente de alertas visuais e travas financeiras (80% / 100%).
- **Geração de Relatórios PDF:** Relatórios gerenciais automáticos com iTextPDF.
- **Gestão de Perfil:** Upload de foto e edição de dados do usuário.
- **Landing Page:** Página institucional com efeitos visuais e animações 3D.

---

## 🔒 Segurança

- **Autenticação JWT** (Stateless) — Token gerado no login e enviado automaticamente via interceptor Angular.
- **Role-Based Access Control (RBAC)** — 3 perfis: ADMIN, GESTOR, DESENVOLVEDOR.
- **Route Guards** no frontend para proteção de rotas.
- **CORS** configurado para aceitar requisições do frontend.

---

## 📁 Estrutura do Projeto

```
devflow-solutions/
├── backend/                    # API REST (Spring Boot 4 + Java 21)
│   ├── Dockerfile              # Dockerfile do backend
│   ├── pom.xml                 # Dependências Maven
│   ├── mvnw / mvnw.cmd         # Maven Wrapper
│   └── src/
│       └── main/
│           ├── java/com/devflow/
│           │   ├── controller/  # REST Controllers
│           │   ├── model/       # Entidades JPA
│           │   ├── repository/  # Repositories
│           │   ├── service/     # Regras de negócio
│           │   ├── security/    # JWT + Spring Security
│           │   └── config/      # Configurações (CORS, etc.)
│           └── resources/
│               └── application.properties
├── frontend/                   # SPA (Angular 21 + TypeScript)
│   ├── Dockerfile              # Dockerfile do frontend
│   ├── nginx.conf              # Configuração Nginx (produção)
│   ├── package.json            # Dependências npm
│   ├── angular.json            # Configuração Angular CLI
│   ├── proxy.conf.json         # Proxy para dev local
│   └── src/
│       └── app/
│           ├── core/           # Services, Guards, Interceptors
│           ├── pages/          # Componentes de página
│           └── shared/         # Componentes reutilizáveis
├── docs/                       # Documentação e scripts
│   ├── devflow_seed.sql        # Dump SQL portável (schema + dados de teste)
│   ├── seed-completo.ps1       # Script de carga de dados via API
│   └── credenciaispadrao.txt   # Credenciais de teste
├── docker-compose.yml          # Orquestração de todos os serviços
└── README.md                   # Este arquivo
```

---

> 💡 *Projeto Integrador Universitário — IMEPAC 2026 | Equipe DevFlow Solutions*
