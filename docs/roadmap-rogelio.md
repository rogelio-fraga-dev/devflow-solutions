# 🚀 Roadmap — Rogélio Claro Fraga
**Projeto Integrador ADS 2026/01 — DevFlow Solutions**
**Responsabilidades:** Infraestrutura, Segurança, Deploy e Core Frontend (Visual/Acesso)

---

## ⚙️ BACKEND — Infraestrutura & Segurança

### 1. Segurança e Configuração de Produção
- **1.1 Variáveis de Ambiente:** Migrar segredos (JWT, DB) do `application.properties` para variáveis de ambiente na AWS.
- **1.2 CORS:** Configurar permissões para o domínio final do CloudFront.

### 5. Deploy AWS — Infraestrutura e Checklist
- **5.1 AWS RDS:** Provisionamento e configuração do banco MySQL 8.
- **5.2 AWS EC2:** Configuração do servidor Ubuntu, Java 21 e serviço systemd para o JAR.
- **5.3 Checklist Pré-Deploy:** Validação final de build e variáveis.
- **5.4 Deploy Final:** S3 + CloudFront para o frontend e EC2 para o backend.

---

## 🎨 FRONTEND — Identidade & Lançamento

### 1. Identidade Visual DevFlow
- Definição de paleta de cores, tipografia e design system (vars CSS).

### 2. Landing Page — Refatoração Completa
- Reestruturação do Header, Seção Hero, Preview Cards, Funcionalidades, Planos e Suporte.

### 3. Página de Registro
- Fluxo de 2 steps para criação de empresa e administrador inicial.

### 9. Responsividade Mobile
- Ajustes de breakpoints, sidebar colapsável e tabelas com scroll horizontal para dispositivos móveis.

---

## 🏆 Diferenciais Técnicos do DevFlow (Visão Rogélio)
- **Budget Guard:** Rollback transacional real em nível de banco.
- **Cloud Costs:** Integração direta de faturas AWS/Azure/GCP.
- **Scale:** Arquitetura pronta para multi-tenancy e múltiplos projetos.
