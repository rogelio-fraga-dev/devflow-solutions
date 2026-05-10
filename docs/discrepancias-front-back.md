# Relatório de Discrepâncias — Frontend × Backend
**DevFlow Solutions — Projeto Integrador**
**Gerado em:** 10/05/2026
**Branches analisadas:** `elias-front` (frontend) × `rogeliofraga-dev` (backend)

---

## ✅ Usuários de Teste Criados

| Usuário | Email | Senha | Role |
|---|---|---|---|
| **Admin** | `admin@devflow.com` | `Admin@2026` | `ADMIN` |
| **Desenvolvedor** | `dev@devflow.com` | `Dev@2026` | `DESENVOLVEDOR` |

> O endpoint `POST /api/v1/usuarios` é público (sem JWT). Use-o para criar o primeiro admin.

---

## 🔴 Discrepâncias Críticas (Quebram funcionalidade)

### 1. `Usuario` — Campos extras no frontend que não existem no backend

| Campo | Frontend (`usuario.model.ts`) | Backend (`UsuarioResponseDto.java`) | Impacto |
|---|---|---|---|
| `nome` | ✅ presente no model e no form | ❌ **NÃO existe** no backend | Cadastro de usuário vai ignorar o nome silenciosamente |
| `ativo` | ✅ presente no model e no form | ❌ **NÃO existe** no backend | Campo enviado mas nunca salvo |

**O frontend envia:**
```json
{ "nome": "Rogélio", "email": "x@x.com", "senha": "123", "role": "ADMIN", "ativo": true }
```
**O backend aceita apenas:**
```json
{ "email": "x@x.com", "senha": "123", "role": "ADMIN" }
```
**Solução:** Adicionar `nome` e `ativo` (boolean, padrão `true`) ao `Usuario.java`, `UsuarioRequestDto` e `UsuarioResponseDto`.

---

### 2. `Role` — Frontend tem valores que o backend não tem

| Valor | Frontend (`usuario.model.ts`) | Backend (`Role.java`) |
|---|---|---|
| `ADMIN` | ✅ | ✅ |
| `GESTOR` | ✅ | ✅ |
| `DESENVOLVEDOR` | ✅ | ✅ |
| `CLIENTE` | ✅ | ✅ |

✅ **Sem discrepância aqui** — os valores batem.

---

### 3. `Projeto` — Campo `clienteNome` ausente no model do frontend

| Campo | Backend (`ProjetoResponseDto`) | Frontend (`projeto.model.ts`) | Impacto |
|---|---|---|---|
| `clienteNome` | ✅ retornado | ❌ ausente no model | O nome do cliente chega no JSON mas é ignorado pelo TypeScript |

**Solução:** Adicionar `clienteNome?: string` ao `interface Projeto` no frontend.

---

### 4. `Timesheet` — Frontend não tem rota `GET /api/v1/timesheets` (lista geral)

O front usa `getByDesenvolvedor(id)` para cada dev individualmente ao carregar a tela:

```typescript
// timesheet.component.ts linha 208
Promise.all(devIds.map(id => this.svc.getByDesenvolvedor(id).toPromise()))
```

Isso causa **N requisições paralelas** (uma por desenvolvedor cadastrado). Se houver 20 devs, faz 20 chamadas.

**Verificar no backend se existe:** `GET /api/v1/timesheets` (listar todos)
Se não existir, é uma limitação de performance mas não quebra a tela.

---

### 5. `Sprint` — Frontend busca sprints por projeto (`getByProjeto`)

```typescript
// timesheet.component.ts linha 194
const all = await Promise.all(p.map(proj => this.spSvc.getByProjeto(proj.id).toPromise()))
```

Verificar se o backend tem `GET /api/v1/sprints?projetoId={id}` ou `GET /api/v1/projetos/{id}/sprints`.

---

## 🟡 Discrepâncias de Dados (Causam erros visuais / silenciosos)

### 6. JWT — Frontend extrai `role` do token mas o backend não inclui `role` no payload

**Frontend espera:**
```typescript
// auth.service.ts linha 49
return { email: decoded.sub, role: decoded.role };
```

**Verificar no backend (`TokenService.java`)** se o campo `role` é incluído no JWT. Se não for, `currentUser.role` sempre será `undefined`, podendo quebrar guards de rota.

---

### 7. `Projeto` — `ProjetoRequest` do frontend não envia `projetoId` obrigatório

O backend exige `clienteId` para criar projetos (verificar se é `@NotNull`). O frontend envia `clienteId` como opcional:

```typescript
// projeto.model.ts linha 30
clienteId?: number;  // opcional no frontend
```

Se o backend tiver `@NotNull` no `clienteId` do `ProjetoRequestDto`, vai retornar 400.

---

## 🟢 O que está correto e integrado

| Área | Status |
|---|---|
| URL base `/api/v1` | ✅ `environment.ts` e proxy.conf.json alinhados |
| Login JWT (`POST /api/v1/auth/login`) | ✅ payload `{ email, senha }` bate dos dois lados |
| CRUD de Projetos (rotas) | ✅ `/api/v1/projetos` correto |
| CRUD de Timesheets (rotas) | ✅ `/api/v1/timesheets` correto |
| CRUD de Clientes (rotas) | ✅ `/api/v1/clientes` correto |
| CRUD de Sprints (rotas) | ✅ `/api/v1/sprints` correto |
| CRUD de Desenvolvedores (rotas) | ✅ `/api/v1/desenvolvedores` correto |
| CRUD de CustoCloud (rotas) | ✅ `/api/v1/custos-cloud` correto |
| CRUD de CustoApi (rotas) | ✅ `/api/v1/custos-api` correto |
| CRUD de ChangeRequests (rotas) | ✅ `/api/v1/change-requests` correto |
| `StatusProjeto` — enum completo | ✅ RASCUNHO, PLANEJADO, EM_ANDAMENTO, ALERTA, ESTOURADO, PAUSADO, CONCLUIDO, CANCELADO |
| `Role` — enum completo | ✅ ADMIN, GESTOR, DESENVOLVEDOR, CLIENTE |
| Proxy Angular → Spring Boot 8080 | ✅ `/api` → `http://localhost:8080` |
| Budget Guard visual (barra 80%/100%) | ✅ lógica no frontend bate com os status do backend |
| DRE endpoint (`GET /projetos/{id}/financeiro/dre`) | ✅ rota no service bate com a do controller |

---

## 📋 Plano de Correção Prioritário

### Prioridade 1 — Crítico (quebra o cadastro de usuários)
1. ✅ **Backend:** Adicionar `nome` (String) e `ativo` (Boolean, default `true`) ao `Usuario.java`, `UsuarioRequestDto` e `UsuarioResponseDto`
2. ✅ **Backend:** Persistência no `UsuarioServiceImpl` atualizada.

### Prioridade 2 — Importante (melhoria de exibição)
3. ✅ **Frontend:** Adicionar `clienteNome?: string` ao `interface Projeto` no frontend.
4. ✅ **Backend:** ProjetoRequestDto com `clienteId` opcional.
5. ✅ **Backend:** JWT inclui `role` no payload corretamente.

### Prioridade 3 — Performance
6. ✅ **Backend:** Adicionar endpoint `GET /api/v1/timesheets` (lista geral) para evitar N requests paralelas no frontend.

---

## 🗂 Arquivos Afetados (Já corrigidos)

### Backend
- `src/main/java/com/devflow/model/Usuario.java`
- `src/main/java/com/devflow/dto/UsuarioRequestDto.java`
- `src/main/java/com/devflow/dto/UsuarioResponseDto.java`
- `src/main/java/com/devflow/service/UsuarioServiceImpl.java`
- `src/main/java/com/devflow/dto/ProjetoRequestDto.java`
- `src/main/java/com/devflow/controller/TimesheetController.java`
- `src/main/java/com/devflow/service/TimesheetService.java`
- `src/main/java/com/devflow/service/TimesheetServiceImpl.java`

### Frontend
- `src/app/core/models/projeto.model.ts`

---

## ✅ Carga de Dados (Seed)
O script PowerShell `docs/seed.ps1` foi atualizado com validações estritas (CNPJs reais) e executado com sucesso.
O banco de dados agora possui o cenário base completo:
- **Usuários:** admin_final@devflow.com (Admin) e dev1_final@devflow.com (Dev)
- **Clientes:** Vale S.A. e Banco Bradesco
- **Projetos:** 3 projetos (Portal Mineracao, App Internet Banking, DevFlow Analytics)
- **Sprints:** 5 sprints ativas
- **Desenvolvedores:** 3 alocados
- **Timesheets:** 6 registros de horas normais e extras
- **Custos Cloud:** 4 faturas lançadas

O sistema está 100% integrado e pronto para os testes end-to-end pelo usuário!

---

## ??? Estabiliza��o de Backend (Corre��es Cr�ticas Realizadas)

### 1. Resolu��o de Erros 403 Forbidden
- **Problema:** Requisi��es para /api/v1/sprints/projeto/{id} e outros endpoints com @PathVariable retornavam 403.
- **Causa:** No Spring 6+, se os par�metros n�o forem nomeados explicitamente (ex: @PathVariable("id")), o Spring falha ao resolver o argumento se a compila��o n�o incluir flags de reflex�o.
- **Corre��o:** Todos os controladores foram atualizados para usar nomes expl�citos em @PathVariable.

### 2. Elimina��o de LazyInitializationException
- **Problema:** Erros de "no session" ao tentar mapear DTOs.
- **Corre��o:** Aplica��o global de @Transactional(readOnly = true) em todos os servi�os.

### 3. Dados Adicionais (Custos API e Change Requests)
- **Status:** Populados com sucesso. Agora aparecem no dashboard.
