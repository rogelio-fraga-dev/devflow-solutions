# ⚙️ DevFlow Manager — Roadmap Backend
**Projeto Integrador ADS 2026/01 — DevFlow Solutions**
**Responsável:** Rogélio Claro Fraga
**Stack:** Spring Boot 4.0.3 · Java 21 · MySQL 8 · JPA/Hibernate · JWT · iText5

> Documento exclusivo de backend. Para frontend, ver `ROADMAP_FRONTEND.md`.

---

## 📋 Índice

| # | Seção | Prioridade |
|---|---|---|
| 0 | Bugs Críticos de Integração (lado backend) | 🔴 IMEDIATO |
| 1 | Segurança e Configuração de Produção | 🟠 ALTA |
| 2 | Novos Endpoints e Serviços | 🟠 ALTA |
| 3 | Estrutura Multi-tenant (Empresa) | 🟡 MÉDIA |
| 4 | Evoluções de Domínio (Timesheet + DRE) | 🟢 V1.5 |
| 5 | Deploy AWS — Infraestrutura e Checklist | 🟠 PRÉ-ENTREGA |

---

## 🔴 PARTE 0 — Bugs Críticos (Lado Backend)

Identificados na auditoria de integração `elias-front` ↔ `rogeliofraga-dev`. **Resolver antes de qualquer nova feature.**

---

### BUG 01 — `Usuario`: campos `nome` e `ativo` não persistidos

**Problema:** O frontend envia `nome` e `ativo` no payload, mas o backend ignora ambos silenciosamente. O nome do usuário nunca é salvo.

**`Usuario.java` — confirmar que os campos existem:**
```java
@Column(nullable = false)
private String nome;

@Column(nullable = false)
private Boolean ativo = true;
```

**`UsuarioRequestDto.java` — adicionar:**
```java
@NotBlank(message = "Nome é obrigatório")
private String nome;

private Boolean ativo = true;
```

**`UsuarioResponseDto.java` — adicionar:**
```java
private String nome;
private Boolean ativo;
```

**`UsuarioServiceImpl.java` — atualizar mapeamento nos métodos `criarUsuario` e `mapToResponse`:**
```java
// Em criarUsuario / atualizarUsuario:
usuario.setNome(request.getNome());
usuario.setAtivo(request.getAtivo() != null ? request.getAtivo() : true);

// Em mapToResponse:
response.setNome(usuario.getNome());
response.setAtivo(usuario.getAtivo());
```

---

### BUG 02 — `JWT`: campo `role` ausente no payload do token

**Problema:** O frontend lê `decoded.role` do JWT para controle de rotas e sidebar. Se o backend não incluir o claim `role`, o `currentUser.role` é sempre `undefined` e os guards de navegação quebram para todos os usuários.

**`TokenService.java` — verificar e garantir o claim:**
```java
return JWT.create()
    .withSubject(usuario.getEmail())
    .withClaim("role", usuario.getRole().name())  // ← OBRIGATÓRIO
    .withExpiresAt(expiracao)
    .sign(algorithm);
```

---

### BUG 03 — `Timesheet`: N+1 requisições por falta de endpoint de listagem geral

**Problema:** Sem um `GET /api/v1/timesheets` geral, o frontend faz uma requisição por desenvolvedor (`Promise.all(devIds.map(...))`). Com 10 devs são 10 chamadas simultâneas; com 20 devs o risco de timeout é real.

**`TimesheetController.java` — adicionar endpoint de listagem:**
```java
@GetMapping
public ResponseEntity<List<TimesheetResponseDto>> listarTodos() {
    return ResponseEntity.ok(timesheetService.listarTodos());
}
```

**`TimesheetService.java` (interface) — adicionar assinatura:**
```java
List<TimesheetResponseDto> listarTodos();
```

**`TimesheetServiceImpl.java` — implementar:**
```java
@Override
public List<TimesheetResponseDto> listarTodos() {
    return timesheetRepository.findAll().stream()
        .map(this::converterParaDto)
        .collect(Collectors.toList());
}
```

---

## 🟠 PARTE 1 — Segurança e Configuração de Produção

### 1.1 Variáveis de Ambiente — Migrar Segredos

**Problema atual:** JWT secret e credenciais do banco provavelmente hardcoded em `application.properties`. Em produção isso é crítico.

**`application.properties` de produção:**
```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}

jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION_MS:86400000}

# Logging em produção
logging.file.name=/var/log/devflow/app.log
logging.level.com.devflow=INFO
logging.level.org.hibernate.SQL=WARN
```

**Na EC2, configurar via arquivo `.env` ou systemd (ver Parte 5).**

---

### 1.2 CORS — Configuração para Produção

**`SecurityConfig.java` — atualizar a configuração de CORS:**
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of(
        "http://localhost:4200",       // dev local
        "https://xxxx.cloudfront.net" // prod — substituir pelo domínio real do CloudFront
    ));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", config);
    return source;
}
```

> **Atenção:** Assim que o CloudFront for provisionado, substituir `xxxx.cloudfront.net` pelo domínio gerado e fazer rebuild do JAR.

---

## 🟠 PARTE 2 — Novos Endpoints e Serviços

### 2.1 Dashboard Executivo Consolidado — Cross-Project

**Motivação:** O DRE atual funciona individualmente por projeto. O CTO precisa de uma visão consolidada de toda a empresa em uma única chamada.

**Novo `DashboardExecutivoDto.java`:**
```java
package com.devflow.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardExecutivoDto {
    private int totalProjetos;
    private int projetosEmAlerta;
    private int projetosEstourados;
    private int projetosEmAndamento;
    private BigDecimal investimentoTotalAlocado;
    private BigDecimal custoTotalAcumulado;
    private BigDecimal margemGlobal;
    private double burnRateGlobal;
    private List<ProjetoResumoDto> resumoProjetos;
    // getters/setters ou @Data
}
```

**Novo `ProjetoResumoDto.java`:**
```java
public class ProjetoResumoDto {
    private Long id;
    private String nome;
    private String clienteNome;
    private BigDecimal budgetTotal;
    private BigDecimal custoAtual;
    private double burnRatePercentual;
    private String status;
    private LocalDate dataPrevisaoEsgotamento; // ver Parte 4.1
}
```

**`AnaliseFinanceiraController.java` — adicionar endpoint:**
```java
@GetMapping("/dashboard-executivo")
@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
public ResponseEntity<DashboardExecutivoDto> dashboardExecutivo() {
    return ResponseEntity.ok(analiseService.gerarDashboardExecutivo());
}
```

**`AnaliseFinanceiraService.java` — implementar método:**
```java
public DashboardExecutivoDto gerarDashboardExecutivo() {
    List<Projeto> todos = projetoRepository.findAll();

    BigDecimal totalBudget = todos.stream()
        .map(Projeto::getBudgetTotal)
        .filter(Objects::nonNull)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal totalCusto = todos.stream()
        .map(p -> p.getCustoAtualAcumulado() != null ? p.getCustoAtualAcumulado() : BigDecimal.ZERO)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    DashboardExecutivoDto dto = new DashboardExecutivoDto();
    dto.setTotalProjetos(todos.size());
    dto.setProjetosEmAlerta(
        (int) todos.stream().filter(p -> p.getStatus() == StatusProjeto.ALERTA).count());
    dto.setProjetosEstourados(
        (int) todos.stream().filter(p -> p.getStatus() == StatusProjeto.ESTOURADO).count());
    dto.setProjetosEmAndamento(
        (int) todos.stream().filter(p -> p.getStatus() == StatusProjeto.EM_ANDAMENTO).count());
    dto.setInvestimentoTotalAlocado(totalBudget);
    dto.setCustoTotalAcumulado(totalCusto);
    dto.setMargemGlobal(totalBudget.subtract(totalCusto));
    dto.setBurnRateGlobal(totalBudget.compareTo(BigDecimal.ZERO) > 0
        ? totalCusto.divide(totalBudget, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100")).doubleValue()
        : 0.0);
    dto.setResumoProjetos(todos.stream().map(this::toResumo).collect(Collectors.toList()));
    return dto;
}

private ProjetoResumoDto toResumo(Projeto p) {
    ProjetoResumoDto r = new ProjetoResumoDto();
    r.setId(p.getId());
    r.setNome(p.getNome());
    r.setClienteNome(p.getCliente() != null ? p.getCliente().getRazaoSocial() : "Sem cliente");
    r.setBudgetTotal(p.getBudgetTotal());
    BigDecimal custo = p.getCustoAtualAcumulado() != null ? p.getCustoAtualAcumulado() : BigDecimal.ZERO;
    r.setCustoAtual(custo);
    r.setStatus(p.getStatus() != null ? p.getStatus().name() : "RASCUNHO");
    r.setBurnRatePercentual(p.getBudgetTotal() != null && p.getBudgetTotal().compareTo(BigDecimal.ZERO) > 0
        ? custo.divide(p.getBudgetTotal(), 4, RoundingMode.HALF_UP)
               .multiply(new BigDecimal("100")).doubleValue()
        : 0.0);
    return r;
}
```

---

### 2.2 Ranking de Produtividade por Desenvolvedor

**Motivação:** Saber quem está gerando mais custo e quantas horas cada dev lançou. Equivale ao relatório de "utilização" do Harvest, mas com custo financeiro direto.

**Novo `ProdutividadeDevDto.java`:**
```java
public class ProdutividadeDevDto {
    private Long desenvolvedorId;
    private String nomeDesenvolvedor;
    private Senioridade senioridade;
    private double totalHorasLancadas;
    private double totalHorasExtras;
    private BigDecimal custoTotalGerado;
    private int totalSprintsParticipados;
}
```

**`DesenvolvedorRepository.java` — adicionar query nativa:**
```java
@Query("""
    SELECT d.id, d.nome, d.senioridade,
           COALESCE(SUM(t.horasTrabalhadas), 0)       AS totalHoras,
           COALESCE(SUM(t.horasExtras), 0)             AS totalExtras,
           COALESCE(SUM(t.horasTrabalhadas * d.valorHoraCusto +
                        COALESCE(t.horasExtras,0) * d.valorHoraExtra), 0) AS custoGerado,
           COUNT(DISTINCT t.sprint.id)                 AS totalSprints
    FROM Desenvolvedor d
    LEFT JOIN Timesheet t ON t.desenvolvedor.id = d.id
    GROUP BY d.id, d.nome, d.senioridade
    ORDER BY custoGerado DESC
""")
List<Object[]> findProdutividadeRanking();
```

**`DesenvolvedorController.java` — adicionar endpoint:**
```java
@GetMapping("/produtividade")
@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
public ResponseEntity<List<ProdutividadeDevDto>> ranking() {
    return ResponseEntity.ok(desenvolvedorService.gerarRankingProdutividade());
}
```

---

## 🟡 PARTE 3 — Estrutura Multi-tenant (Empresa)

**Motivação:** O roadmap original define que ao se registrar, o primeiro usuário se torna administrador da empresa e os outros devs entram apenas vendo os projetos da sua empresa. Isso exige um conceito de tenant no banco.

### 3.1 Nova Entidade `Empresa.java`

```java
@Entity
@Table(name = "tb_empresa")
@Getter @Setter
public class Empresa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomeFantasia;

    @Column(nullable = false, unique = true)
    private String cnpj;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlanoAssinatura plano = PlanoAssinatura.FREE_BETA;

    @Column(nullable = false)
    private LocalDate dataRegistro = LocalDate.now();
}
```

**Nova enum `PlanoAssinatura.java`:**
```java
public enum PlanoAssinatura {
    FREE_BETA, STARTER, SCALE
}
```

### 3.2 Atualizar entidades existentes com `empresa_id`

**`Usuario.java`:**
```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "empresa_id")
private Empresa empresa;
```

**`Projeto.java`:**
```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "empresa_id", nullable = false)
private Empresa empresa;
```

**`Cliente.java`:**
```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "empresa_id", nullable = false)
private Empresa empresa;
```

### 3.3 Endpoint de Registro de Empresa

**`RegistroEmpresaRequestDto.java`:**
```java
public class RegistroEmpresaRequestDto {
    // Dados da empresa
    @NotBlank private String nomeFantasia;
    @NotBlank private String cnpj;

    // Dados do administrador (primeiro usuário)
    @NotBlank private String nomeAdmin;
    @NotBlank @Email private String emailAdmin;
    @NotBlank @Size(min = 8) private String senhaAdmin;
}
```

**`AuthController.java` — adicionar endpoint público:**
```java
@PostMapping("/registrar")
public ResponseEntity<LoginResponseDto> registrarEmpresa(
        @RequestBody @Valid RegistroEmpresaRequestDto request) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(authService.registrarNovaEmpresa(request));
}
```

**`AuthServiceImpl.java` — implementar:**
```java
@Transactional
public LoginResponseDto registrarNovaEmpresa(RegistroEmpresaRequestDto request) {
    // 1. Criar a empresa
    Empresa empresa = new Empresa();
    empresa.setNomeFantasia(request.getNomeFantasia());
    empresa.setCnpj(request.getCnpj());
    empresa = empresaRepository.save(empresa);

    // 2. Criar o usuário admin vinculado à empresa
    Usuario admin = new Usuario();
    admin.setNome(request.getNomeAdmin());
    admin.setEmail(request.getEmailAdmin());
    admin.setSenha(passwordEncoder.encode(request.getSenhaAdmin()));
    admin.setRole(Role.ADMIN);
    admin.setAtivo(true);
    admin.setEmpresa(empresa);
    admin = usuarioRepository.save(admin);

    // 3. Gerar token JWT e retornar
    String token = tokenService.gerarToken(admin);
    return new LoginResponseDto(token);
}
```

> **Segurança de isolamento:** Nos `*ServiceImpl` existentes, filtrar consultas por `empresa_id` do usuário logado extraído do `SecurityContext`.

---

## 🟢 PARTE 4 — Evoluções de Domínio

### 4.1 🔮 Forecast de Esgotamento de Budget

**Motivação:** Com o burn rate diário calculado, prever **quando** o projeto vai atingir 100% do budget. Nenhum concorrente faz isso com precisão diária baseada em dados reais.

**`AnaliseFinanceiraDto.java` — adicionar campos:**
```java
private LocalDate dataPrevisaoEsgotamento; // null = budget seguro ou projeto concluído
private Double diasRestantesEstimados;
private String mensagemForecast; // ex: "Budget previsto para esgotar em 47 dias"
```

**`AnaliseFinanceiraService.java` — adicionar ao método `gerarDreProjeto`:**
```java
// Após calcular burnRate e margemBruta:
LocalDate hoje = LocalDate.now();
long diasDecorridos = ChronoUnit.DAYS.between(projeto.getDataInicio(), hoje);

if (diasDecorridos > 0 && custo.compareTo(BigDecimal.ZERO) > 0
        && projeto.getStatus() != StatusProjeto.CONCLUIDO
        && projeto.getStatus() != StatusProjeto.CANCELADO) {

    BigDecimal custoPorDia = custo.divide(
        BigDecimal.valueOf(diasDecorridos), 2, RoundingMode.HALF_UP);

    BigDecimal budgetRestante = projeto.getBudgetTotal().subtract(custo);

    if (custoPorDia.compareTo(BigDecimal.ZERO) > 0
            && budgetRestante.compareTo(BigDecimal.ZERO) > 0) {
        long diasRestantes = budgetRestante.divide(
            custoPorDia, 0, RoundingMode.UP).longValue();
        dre.setDiasRestantesEstimados((double) diasRestantes);
        dre.setDataPrevisaoEsgotamento(hoje.plusDays(diasRestantes));
        dre.setMensagemForecast("Budget previsto para esgotar em " + diasRestantes + " dias");
    } else if (budgetRestante.compareTo(BigDecimal.ZERO) <= 0) {
        dre.setDiasRestantesEstimados(0.0);
        dre.setMensagemForecast("Budget esgotado");
    }
}
```

---

### 4.2 ✅ Aprovação de Timesheet pelo Gestor

**Motivação:** Antes de um timesheet ser computado no custo do projeto, o gestor deve aprová-lo. Previne lançamentos errados que acionam o Budget Guard indevidamente.

**Nova enum `StatusTimesheet.java`:**
```java
public enum StatusTimesheet {
    PENDENTE, APROVADO, REJEITADO
}
```

**`Timesheet.java` — adicionar campo:**
```java
@Enumerated(EnumType.STRING)
@Column(nullable = false)
private StatusTimesheet statusAprovacao = StatusTimesheet.PENDENTE;
```

**`TimesheetServiceImpl.java` — condicionar a soma do custo ao status:**
```java
// Ao criar timesheet, NÃO somar o custo imediatamente.
// Criar endpoint separado de aprovação:
@Transactional
public void aprovarTimesheet(Long timesheetId) {
    Timesheet ts = timesheetRepository.findById(timesheetId)
        .orElseThrow(() -> new ResourceNotFoundException("Timesheet não encontrado"));

    if (ts.getStatusAprovacao() != StatusTimesheet.PENDENTE) {
        throw new BusinessRuleException("Timesheet já foi processado.");
    }

    // Calcular e somar o custo ao projeto
    BigDecimal custo = BigDecimal.valueOf(ts.getHorasTrabalhadas())
        .multiply(ts.getDesenvolvedor().getValorHoraCusto());
    if (ts.getHorasExtras() != null && ts.getHorasExtras() > 0) {
        custo = custo.add(BigDecimal.valueOf(ts.getHorasExtras())
            .multiply(ts.getDesenvolvedor().getValorHoraExtra()));
    }

    Projeto projeto = ts.getSprint().getProjeto();
    projeto.setCustoAtualAcumulado(
        projeto.getCustoAtualAcumulado().add(custo));
    projetoRepository.save(projeto); // dispara Budget Guard

    ts.setStatusAprovacao(StatusTimesheet.APROVADO);
    timesheetRepository.save(ts);
}
```

**`TimesheetController.java` — adicionar endpoint de aprovação:**
```java
@PatchMapping("/{id}/aprovar")
@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
public ResponseEntity<Void> aprovar(@PathVariable Long id) {
    timesheetService.aprovarTimesheet(id);
    return ResponseEntity.ok().build();
}

@PatchMapping("/{id}/rejeitar")
@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
public ResponseEntity<Void> rejeitar(@PathVariable Long id) {
    timesheetService.rejeitarTimesheet(id);
    return ResponseEntity.ok().build();
}
```

---

### 4.3 🏷️ Horas Billable vs. Non-Billable

**Motivação:** Diferenciar horas cobráveis do cliente (código, reuniões com cliente) das internas (treinamento, setup, reuniões internas). Permite que o DRE mostre o custo que o cliente não vai pagar.

**`Timesheet.java` — adicionar campo:**
```java
@Column(nullable = false)
private Boolean billable = true;
```

**`TimesheetRequestDto.java` — adicionar:**
```java
private Boolean billable = true;
```

**`AnaliseFinanceiraDto.java` — enriquecer com breakdown billable:**
```java
private Double totalHorasBillable;
private Double totalHorasNonBillable;
private BigDecimal custoNonBillable; // custo interno que o cliente não cobre
```

---

## 🟠 PARTE 5 — Deploy AWS

### Infraestrutura Alvo

```
Internet
   │
   ├─→ CloudFront (HTTPS) ──→ S3 (Angular build estático)
   │
   └─→ EC2 Ubuntu 22.04 (Spring Boot JAR via systemd)
              │
              └─→ RDS MySQL 8.0 (instância dedicada)
```

---

### 5.1 AWS RDS — Banco de Dados

```sql
-- Criar schema:
CREATE DATABASE devflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário de aplicação com permissões mínimas:
CREATE USER 'devflow_app'@'%' IDENTIFIED BY 'SenhaForte@2026';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP
  ON devflow_db.* TO 'devflow_app'@'%';
FLUSH PRIVILEGES;
```

> **Security Group do RDS:** Liberar porta 3306 apenas para o Security Group da EC2. Nunca expor ao 0.0.0.0/0.

---

### 5.2 AWS EC2 — Servidor da API

```bash
# 1. Preparar servidor (Ubuntu 22.04):
sudo apt update && sudo apt install -y openjdk-21-jdk

# 2. Criar diretório de logs:
sudo mkdir -p /var/log/devflow && sudo chown ubuntu:ubuntu /var/log/devflow

# 3. Copiar JAR gerado localmente (mvn clean package -DskipTests):
scp -i devflow-key.pem target/backend-0.0.1-SNAPSHOT.jar \
  ubuntu@{EC2_IP}:/home/ubuntu/devflow.jar

# 4. Criar serviço systemd:
sudo nano /etc/systemd/system/devflow.service
```

**`/etc/systemd/system/devflow.service`:**
```ini
[Unit]
Description=DevFlow Manager API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu
Environment="SPRING_PROFILES_ACTIVE=prod"
Environment="DB_URL=jdbc:mysql://{RDS_ENDPOINT}:3306/devflow_db?useSSL=true"
Environment="DB_USER=devflow_app"
Environment="DB_PASSWORD=SenhaForte@2026"
Environment="JWT_SECRET={openssl rand -hex 64}"
ExecStart=/usr/bin/java -Xmx512m -jar /home/ubuntu/devflow.jar
SuccessExitStatus=143
Restart=on-failure
RestartSec=15

[Install]
WantedBy=multi-user.target
```

```bash
# 5. Ativar e iniciar:
sudo systemctl daemon-reload
sudo systemctl enable devflow
sudo systemctl start devflow

# 6. Verificar:
sudo systemctl status devflow
sudo journalctl -u devflow -f   # logs em tempo real
```

> **Security Group da EC2:** Liberar porta 8080 apenas para o IP do CloudFront ou para acesso temporário durante o PI. Porta 22 (SSH) apenas para seu IP.

---

### 5.3 Checklist Completo Pré-Deploy

**Local (antes de subir):**
- [ ] `mvn clean package -DskipTests` — JAR gerado sem erros
- [ ] `application.properties` usando variáveis de ambiente (sem valores hardcoded)
- [ ] CORS configurado com o domínio do CloudFront
- [ ] BUGs 01, 02, 03 corrigidos e testados localmente
- [ ] Endpoint `/api/v1/analise/dashboard-executivo` respondendo

**AWS:**
- [ ] RDS MySQL 8.0 provisionado e acessível pela EC2
- [ ] JAR copiado para EC2 e serviço systemd rodando (`systemctl status devflow`)
- [ ] `GET http://{EC2_IP}:8080/api/v1/auth/...` respondendo do navegador
- [ ] Testar login com `admin@devflow.com` / `Admin@2026` contra a EC2

**Pós-deploy:**
- [ ] Atualizar `environment.prod.ts` no frontend com IP/URL da EC2
- [ ] Rebuild Angular e upload no S3
- [ ] Invalidar cache do CloudFront (`aws cloudfront create-invalidation --paths "/*"`)
- [ ] Fluxo completo: login → criar projeto → lançar timesheet → ver DRE

---

## 📊 Resumo de Prioridades Backend

```
🔴 ESTA SEMANA (bugs)
├── BUG 01: nome + ativo no Usuario         ← 30 min
├── BUG 02: role no JWT                     ← 15 min
└── BUG 03: GET /timesheets geral           ← 45 min

🟠 ESTA SEMANA (features)
├── Variáveis de ambiente                   ← 30 min
├── CORS para produção                      ← 20 min
└── DashboardExecutivo endpoint             ← 2h

🟡 PRÓXIMA SEMANA
├── Forecast de esgotamento (DRE)           ← 1h
├── Endpoint ranking de produtividade       ← 1h
└── Endpoint registro de empresa            ← 2h

🟢 VALOR DIFERENCIAL (se sobrar tempo)
├── Aprovação de timesheet (endpoint)       ← 2h
└── Billable vs Non-Billable (campo + DRE)  ← 1h

🚀 PRÉ-ENTREGA
├── Build JAR produção                      ← 30 min
├── Provisionar RDS + EC2                   ← 1.5h
└── Deploy + validação                      ← 1h
```

---

## 🏆 Diferenciais Técnicos do DevFlow vs. Concorrência

| Diferencial | Harvest | Runn | **DevFlow** |
|---|---|---|---|
| Budget Guard com rollback transacional real | ❌ | ❌ | ✅ **Exclusivo** |
| Cloud costs (AWS/Azure) por projeto | ❌ | ❌ | ✅ **Exclusivo** |
| API/SaaS costs por projeto | ❌ | ❌ | ✅ **Exclusivo** |
| Change Request com estorno automático de budget | ❌ | ❌ | ✅ **Exclusivo** |
| Sprint como unidade financeira de custo | ❌ | ❌ | ✅ |
| Forecast de esgotamento com precisão diária | ✅ Parcial | ✅ Parcial | ✅ **Implementado** |
| DRE exportável em PDF | ❌ | ❌ | ✅ |

> *"O Budget Guard Patroll é nossa vantagem competitiva real. Nenhum concorrente faz rollback transacional automático por regra financeira em nível de banco. Esse mecanismo é o coração técnico do DevFlow."*

---

**DevFlow Solutions — ADS 2026/01**
*Rogélio Claro Fraga · João Gabriel Barbosa · Alexandre Farias Vieira · Elias Coelho Gomes Fernandes*