# 🗺️ DevFlow Manager — Final Roadmap (Rumo ao 100)
**Projeto Integrador ADS 2026/01**

Este documento centraliza a estratégia final para a entrega do projeto, focando em **Excelência Técnica**, **Aestética Premium** e **Prontidão para Produção (AWS)**.

---

## 🏗️ 1. Análise Técnica & Produção (Backend)

O backend está sólido. Para a subida para AWS, focaremos em uma arquitetura manual e robusta:

### Melhorias de Segurança e Boas Práticas:
- **Variáveis de Ambiente:** Migrar segredos (JWT Secret, DB Password) para variáveis de ambiente (`System.getenv`).
- **CORS Produção:** Configurar política de CORS para aceitar o domínio gerado pelo CloudFront.
- **Log Management:** Garantir logs persistentes no disco da EC2 ou CloudWatch.

### ☁️ Plano de Deploy AWS (Infraestrutura Real):
1. **Backend (AWS EC2):** Provisionar uma instância EC2 (Ubuntu/Amazon Linux) para rodar o JAR do Spring Boot via Docker ou serviço systemd.
2. **Banco de Dados (AWS RDS):** Instância MySQL 8.0 dedicada para garantir persistência e backups automáticos.
3. **Frontend (AWS S3 + CloudFront):**
   - Build do Angular hospedado no S3.
   - **CloudFront** como CDN para prover HTTPS e performance.
   - *Nota:* Utilizaremos o domínio padrão `xxxx.cloudfront.net` (não é necessário comprar domínio próprio).

---

## 🎨 2. Plano de Evolução Visual (Frontend)

O frontend adotará um visual **Industrial Premium** com foco em usabilidade por perfil.

### Novas Telas e Funcionalidades:
- **Página de Perfil:** Gestão de dados do usuário e visualização de sua senioridade/custo base.
- **Central de Ajuda:** Documentação técnica e suporte (Seguindo o design de card com ícone de interrogação).
- **Landing Page Completa:**
  - Header: Recursos, Funcionalidades, Planos, Suporte.
  - Botões: "Entrar" (Login) e "Contratar" (Destaque em degradê roxo).

### Refatoração de Layout & Sidebar:
- **Sidebar Inteligente (Role-based):**
  - **CTO / Admin:** Acesso total (Projetos, Clientes, Financeiro, Gestão de Devs).
  - **Desenvolvedor:** Acesso restrito (Meus Projetos, Lançar Timesheet, Perfil, Ajuda).
- **Visual Moderno:** Glassmorphism na sidebar e remoção do Header interno redundante.
- **Responsividade:** Menu hambúrguer para mobile.

---
> "Transformando horas de código em lucro real." — **DevFlow Solutions 2026**
