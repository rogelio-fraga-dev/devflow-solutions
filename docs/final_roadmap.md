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
-**Pagina de Registro:** - Com Registro do Usuario, sua empresa, e escolha do plano. ao fazer o cadastro da empresa ele será o administrador da empresa, ai ele tem que registrar outros usuarios. o gestor e seus devs entram na plataforma e veem apenas os projetos que a empresa dele está envolvida.
- **Central de Ajuda:** Documentação técnica sobre a plataforma (Como funciona, como contratar planos, etc) e suporte (Seguindo o design de card com ícone de interrogação).
- **Landing Page Completa:**
  - Header: Recursos (retirar esse item do header),
   Funcionalidade(da plataforma),Sobre (a empresa devflow, o que resolvemos dores do clientes e por trás da equipe.), 
   Planos (free tier - beta teste, e 2 pagos ficticios), 
   Suporte .
  - Botões: "Acesso Plataforma" (Login) e "Contratar Planos" (Destaque em degradê roxo). - Contratar planos vai ser a tela de registro e escolha de plano, por enquanto tera apenas o free tier- beta teste). 
  

### Refatoração de Layout & Sidebar:

- **Sidebar Inteligente (Role-based):**
  Retirar o header de dentro da pagina da plataforma em si. (portal dos dev). 

  - **CTO / Admin:** Acesso total (Projetos, Clientes, Financeiro, Gestão de Devs).
  - **Desenvolvedor:** Acesso restrito (Meus Projetos, Lançar Timesheet, Perfil, Ajuda).
- **Visual Moderno:** Glassmorphism na sidebar e remoção do Header interno redundante.
- **Responsividade:** Menu hambúrguer para mobile. e responsividade de todas as telas para ser possivel verem e entrar na plataforma via celular sem quebras e respeitando paginações.
**Criar uma Identidade Visual para a EmpresaDevflow**

---
> "Transformando horas de código em lucro real." — **DevFlow Solutions 2026**
