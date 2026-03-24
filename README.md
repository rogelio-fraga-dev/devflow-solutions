<p align="center">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white" alt="Java"/>
  <img src="https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JWT"/>
  <img src="https://img.shields.io/badge/JUnit5-25A162?style=for-the-badge&logo=junit5&logoColor=white" alt="JUnit5"/>
</p>

# 🚀 DevFlow Solutions - Backend API

> **Projeto Integrador Universitário** focado no desenvolvimento de um motor de gestão financeira, alocação de timesheets e acompanhamento corporativo C-Level, com arquitetura robusta baseada em **Domain-Driven Design (DDD)** e **APIs RESTful**.

---

## 👨‍💻 Equipe de Engenharia Backend (Autores)
O motor, a inteligência de negócios e a infraestrutura de dados foram completamente arquitetados, desenvolvidos e testados em conjunto por:
- **Rogélio Claro Fraga**
- **João Gabriel Barbosa Araujo Campos**

*(A interface gráfica — Frontend Angular — é de responsabilidade da outra dupla integrada ao escopo do projeto).*

---

## 🎯 Objetivo e Escopo Empresarial
O **DevFlow Solutions** funciona como a espinha dorsal de um sistema SaaS B2B. Ele processa, em tempo real, a viabilidade financeira e o consumo de orçamento de múltiplos contratos de tecnologia, oferecendo:
- Lançamento de **Horas (Timesheets)** e conversão em custos reais.
- Extração de **Nuvem e Aditivos** na base do projeto.
- Cálculo nativo e imediato da **DRE (Demonstrativo do Resultado do Exercício)**.
- Geração de *Project Closeout* inteligente em formato **PDF**.

---

## 🧱 Arquitetura e Padrões Aplicados

A equipe de backend realizou *refactorings* profundos e implementou padrões corporativos de alto nível, passando por 3 ciclos de estabilidades nas *branches* para fornecer a API blindada:

### 1. ⚡ Motor Metrológico e Financeiro (DRE)
Serviço autônomo e de alta precisão que dispensa triggers de banco. Calcula a **Margem de Lucro Bruta** sob as classes filhas de Custo (`CustoCloud`, `CustoApi`, `ChangeRequest` e `Timesheet`), processando também o **Burn Rate %** em tempo real usando `BigDecimal` para evitar ponto flutuante na bolsa do projeto. 

### 2. 🛡️ Budget Guard Patroll (JPA Life-cycle)
Uso de métodos anotados com **`@PrePersist`** e **`@PreUpdate`** (Sentinel passivo do Hibernate) no domínio do `Projeto`. Ao se aproximar de **80% de consumo** orçamentário total, o sistema instantaneamente corta a saúde do projeto alterando seu estado transacional de `EM_ANDAMENTO` para `ALERTA` sem sobrecarregar a rede ou os Controllers.

### 3. 🔒 Autenticação JWT (Stateless) e Autorização
Um filtro customizado no Spring Security (`SecurityFilter`) processa algoritmos *HMAC256* assíncronos. Permite controle minucioso do Perfil Corporativo (Roles de sistema interligadas via `Enums`). Total flexibilidade, ausência de Sessões na memória e zero roubo de dados via N+1 Injection.

### 4. 🚀 Zero N+1 Queries (Otimização Extrema)
Refatoração de toda a modelagem de Banco de Dados. Substituição compulsória de relacionamentos impulsionados (`EAGER`) para `FetchType.LAZY` e exclusão de anomalias no Lombok (`@EqualsAndHashCode`), evitando o fenômeno cartesiano do JPA que derrubava os recursos da máquina virtual (JVM) com laços duplicados.

### 5. 📄 Motor de Documentos (iTextPDF PDF Gen)
Motor de emissão de relatório *On-the-Fly* de encerramento de escopo, rodando no EndPoint e disparando relatórios gerenciais customizados de lucro em folha A4 dinâmica com regras de cores indicativas (Verde = Superávit / Vermelho = Deficit de Budget).

### 6. 🧪 TDD e Quality Assurance 
A API Rest inteira roda abaixo de uma malha sofisticada de Testes de Integração e Unidade:
- **Testes de Contrato (WebMvcTest):** Blindagem total das desserializações em JSON com `MockMvc`.
- **Testes de Motor com Mockito:** Fraude orçamentária zero e confirmações seguras via `ReflectionTestUtils`.

---

## 🛠️ Tecnologias Utilizadas

* **Linguagem:** Java 21 LTS 
* **Framework Web:** Spring Boot 3.3.0+
* **Persistência e Banco de Dados:** JPA / Hibernate 6 + MySQL 8.0
* **Migrações e Configurações:** Maven (Build Lifecycle)
* **Design Patters e Bibliotecas:** JWT Auth0, iText Core (PDF), Lombok, FasterXML (Jackson JSR-310).
* **Testes:** JUnit 5 Jupiter + Mockito + MockMvc
* **Containerização:** Docker & Docker Compose

---

## ⚙️ Como Executar a Aplicação (Instruções Repasse Front-End)

A base de dados conta com provisionamento nativo do Docker. Sigam as ordens à risca para inicialização simultânea.

### 1. Iniciar o Banco de Dados (MySQL)
No terminal root do projeto (`devflow-solutions`), levante a instância do Banco de Dados. Isso criará também o Database `devflow_db` via volumes.

```bash
docker-compose up -d
```

### 2. Executar e Subir a API REST (Spring Boot)
Com o banco estável e a porta *3306* escutando a sua máquina, abra o diretório da pasta `backend` e efetue a descarga de bibliotecas e inicialização do servidor (Ele ficará alocado na rota padrão `http://localhost:8080/api/v1` ou `http://localhost:8080`):

```bash
cd backend
./mvnw clean install -DskipTests
./mvnw spring-boot:run
```

### 3. Executar o Pipeline de Quality Assurance (Opcional)
Para auditar e testar os limites do sistema, basta disparar individualmente:
```bash
./mvnw test
```
*(Saída esperada: `BUILD SUCCESS` com todas as malhas de injeção Web completas).*

---
> 💡 *Projeto Integrador Universitário - Backend Finalizado Exitosamente (Março de 2026).*
> Desenvolvido com excelência técnica por Rogélio C. Fraga e João G. B. Araujo Campos.
