<p align="center">
  <img src="https://img.shields.io/badge/Angular_21-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular"/>
  <img src="https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=java&logoColor=white" alt="Java"/>
  <img src="https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JWT"/>
</p>

# 🚀 DevFlow Solutions — FullStack Project Management

> **Plataforma de Gestão de Projetos e Dashboards C-Level** focada em motor financeiro, alocação de timesheets e acompanhamento corporativo em tempo real. Uma solução completa que une uma API robusta em Spring Boot 4 a uma interface moderna e reativa em Angular 21.

---

## 👨‍💻 Equipe de Desenvolvimento (Autores)

O projeto é fruto da integração entre as frentes de Engenharia de Software e Design de Interface:

### ⚙️ Engenharia Backend e Infraestrutura
- **Rogélio Claro Fraga**
- **João Gabriel Barbosa Araujo Campos**

### 🎨 Engenharia Frontend e UX/UI Design
- **Elias Fernandes**
- **Alexandre Farias**

---

## 🎯 Objetivo e Escopo
O **DevFlow Solutions** funciona como a espinha dorsal de um sistema SaaS B2B. Ele processa, em tempo real, a viabilidade financeira e o consumo de orçamento de múltiplos contratos de tecnologia, oferecendo:
- **Dashboard Executivo:** Visualização rápida de KPIs financeiros e Burn Rate.
- **Gestão de Timesheets:** Lançamento de horas e conversão em custos reais de alocação.
- **Controle de Custos:** Extração de faturas de Nuvem (AWS/Azure/GCP) e Licenciamento de APIs.
- **Budget Guard:** Sistema inteligente de alertas visuais e travas financeiras (80% / 100%).
- **Project Closeout:** Geração automatizada de relatórios gerenciais em PDF.

---

## 🧱 Arquitetura e Diferenciais Técnicos

### 1. ⚛️ Frontend Reativo (Angular 21 + Signals)
A interface foi construída utilizando as tecnologias mais recentes do ecossistema Angular:
- **Angular Signals:** Gestão de estado moderna para atualizações granulares de UI sem sobrecarga de Change Detection.
- **Custom Design System:** UI premium desenvolvida com CSS nativo (Vanilla), focada em performance e estética industrial.
- **Security Guards & Interceptors:** Proteção de rotas e injeção automática de tokens JWT em todas as requisições para a API.
- **Responsive Dashboard:** Layout adaptável para dispositivos móveis e desktops.

### 2. ⚡ Backend Metrológico (Spring Boot 4)
O motor financeiro foi arquitetado para precisão extrema e segurança:
- **Budget Guard Sentinel:** Uso de `@PreUpdate` e `@PrePersist` para monitoramento de budget no nível de domínio.
- **Zero N+1 Queries:** Modelagem JPA otimizada com `FetchType.LAZY` e gerenciamento de transações estável.
- **Security JWT (Stateless):** Autenticação robusta baseada em tokens, sem estado no servidor.
- **API Versionada:** Endpoints estruturados sob o padrão `/api/v1/`.

---

## 🛠️ Stack Tecnológica

### Frontend
* **Framework:** Angular 21 (Standalone Components)
* **Linguagem:** TypeScript
* **Estado:** Signals & RxJS
* **Estilização:** CSS3 Custom Properties (Design System)

### Backend
* **Linguagem:** Java 21 LTS
* **Framework:** Spring Boot 4 (ou 3.3+)
* **Banco de Dados:** MySQL 8.0 + Hibernate 6
* **Relatórios:** iTextPDF (Geração de documentos On-the-Fly)
* **Containerização:** Docker & Docker Compose

---

## ⚙️ Como Executar a Aplicação

### 1. Requisitos
- Node.js (v20+)
- Java JDK 21
- Docker Desktop

### 2. Backend e Banco de Dados
No diretório raiz do projeto:
```bash
# Sobe o MySQL via Docker
docker-compose up -d

# Inicia a API
cd backend
./mvnw spring-boot:run
```

### 3. Frontend
Em um novo terminal no diretório `frontend`:
```bash
npm install
npm start
```
Acesse: `http://localhost:4200`

### 4. Carga de Dados Inicial (Seed)
Para popular o sistema com dados de teste (Projetos, Sprints, Desenvolvedores e Custos):
```powershell
# No Windows
powershell -File .\docs\seed.ps1
```

---
> 💡 *Projeto Integrador Universitário - Finalizado com excelência técnica pela equipe DevFlow (Maio de 2026).*
