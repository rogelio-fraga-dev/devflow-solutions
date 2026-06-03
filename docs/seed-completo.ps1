# DevFlow Seed Completo — Popula banco com dados massivos e diversificados
# Uso: powershell -ExecutionPolicy Bypass -File .\docs\seed-completo.ps1

function ApiPost($uri, $bodyObj, $token) {
    $json = $bodyObj | ConvertTo-Json -Depth 5
    $headers = @{ "Content-Type"  = "application/json; charset=utf-8" }
    if ($token) { $headers["Authorization"] = "Bearer $token" }
    
    try {
        return Invoke-RestMethod -Method POST -Uri $uri -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($json))
    } catch {
        $err = $_.ErrorDetails.Message
        if (-not $err) {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $err = $reader.ReadToEnd()
        }
        Write-Host "ERRO em $uri : $err" -ForegroundColor Red
        return $null
    }
}

$base = 'http://localhost:8080/api/v1'

# =====================================================
# REGISTRO DA EMPRESA E ADMIN
# =====================================================
Write-Host '=== REGISTRANDO EMPRESA E ADMIN ===' -ForegroundColor Cyan
$regResp = ApiPost "$base/auth/registrar" @{ 
    nomeFantasia="DevFlow Solutions"
    cnpj="00.111.222/0001-33"
    nomeAdmin="Admin DevFlow"
    emailAdmin="admin_final@devflow.com"
    senhaAdmin="Admin@2026" 
} $null

$token = $regResp.token
if (-not $token) {
    Write-Host "Falha ao registrar (talvez ja exista). Tentando login..." -ForegroundColor Yellow
    $loginResp = ApiPost "$base/auth/login" @{ email="admin_final@devflow.com"; senha="Admin@2026" } $null
    $token = $loginResp.token
}

if (-not $token) { Write-Host "FALHA COMPLETA AO OBTER TOKEN!"; exit }
Write-Host 'Token Admin OK' -ForegroundColor Green

# =====================================================
# USUARIOS SECUNDARIOS
# =====================================================
Write-Host '=== CRIANDO USUARIOS SECUNDARIOS ===' -ForegroundColor Cyan
ApiPost "$base/usuarios" @{ nome="Ricardo Lima"; email="gestor_final@devflow.com"; senha="Dev@2026"; role="GESTOR"; ativo=$true } $token
ApiPost "$base/usuarios" @{ nome="Carlos Mendes"; email="dev1_final@devflow.com"; senha="Dev@2026"; role="DESENVOLVEDOR"; ativo=$true } $token
ApiPost "$base/usuarios" @{ nome="Ana Beatriz"; email="dev2_final@devflow.com"; senha="Dev@2026"; role="DESENVOLVEDOR"; ativo=$true } $token

# =====================================================
# LOGIN SECUNDARIO
# =====================================================
$loginGestorResp = ApiPost "$base/auth/login" @{ email="gestor_final@devflow.com"; senha="Dev@2026" } $null
$tokenGestor = $loginGestorResp.token

# =====================================================
# RECUPERANDO IDS USUARIOS
# =====================================================
$usuarios = Invoke-RestMethod -Method GET -Uri "$base/usuarios" -Headers @{ "Authorization" = "Bearer $token" }

$uGestor = ($usuarios | Where-Object email -eq 'gestor_final@devflow.com').id
$uDev1 = ($usuarios | Where-Object email -eq 'dev1_final@devflow.com').id
$uDev2 = ($usuarios | Where-Object email -eq 'dev2_final@devflow.com').id

# =====================================================
# CLIENTES
# =====================================================
Write-Host '=== CLIENTES ===' -ForegroundColor Cyan
$end1 = @{ rua="Av. das Nações Unidas"; numero="1000"; bairro="Itaim Bibi"; cidade="São Paulo"; estado="SP"; cep="04533-000" }
$cli1 = ApiPost "$base/clientes" @{ razaoSocial="Vale S.A."; cnpj="33.592.510/0001-54"; pessoaContato="Eduardo Martins"; endereco=$end1 } $token

$end2 = @{ rua="Cidade de Deus"; numero="S/N"; bairro="Vila Yara"; cidade="Osasco"; estado="SP"; cep="06029-900" }
$cli2 = ApiPost "$base/clientes" @{ razaoSocial="Banco Bradesco"; cnpj="60.746.948/0001-12"; pessoaContato="Roberto Alves"; endereco=$end2 } $token

$end3 = @{ rua="Praça Mauá"; numero="1"; bairro="Centro"; cidade="Rio de Janeiro"; estado="RJ"; cep="20081-240" }
$cli3 = ApiPost "$base/clientes" @{ razaoSocial="Porto Rio Logística"; cnpj="44.555.666/0001-77"; pessoaContato="Amanda Silveira"; endereco=$end3 } $token

# Recuperando ids reais dos clientes se ja existirem
$clientesList = Invoke-RestMethod -Method GET -Uri "$base/clientes" -Headers @{ "Authorization" = "Bearer $token" }
$cli1Id = ($clientesList | Where-Object cnpj -eq '33.592.510/0001-54').id
$cli2Id = ($clientesList | Where-Object cnpj -eq '60.746.948/0001-12').id
$cli3Id = ($clientesList | Where-Object cnpj -eq '44.555.666/0001-77').id
$cli1 = @{ id = $cli1Id }
$cli2 = @{ id = $cli2Id }
$cli3 = @{ id = $cli3Id }

# =====================================================
# DESENVOLVEDORES (2 devs)
# =====================================================
Write-Host '=== DESENVOLVEDORES ===' -ForegroundColor Cyan
$null = ApiPost "$base/desenvolvedores" @{ nome="Carlos Mendes"; senioridade="PLENO"; valorHoraCusto=85.00; valorHoraExtra=127.50; usuarioId=$uDev1 } $token
$null = ApiPost "$base/desenvolvedores" @{ nome="Ana Beatriz"; senioridade="SENIOR"; valorHoraCusto=120.00; valorHoraExtra=180.00; usuarioId=$uDev2 } $token

# Recuperando ids reais dos devs se ja existirem
$devsList = Invoke-RestMethod -Method GET -Uri "$base/desenvolvedores" -Headers @{ "Authorization" = "Bearer $token" }
$d1Id = ($devsList | Where-Object usuarioId -eq $uDev1).id
$d2Id = ($devsList | Where-Object usuarioId -eq $uDev2).id
$d1 = @{ id = $d1Id }
$d2 = @{ id = $d2Id }

# =====================================================
# PROJETOS
# =====================================================
Write-Host '=== PROJETOS ===' -ForegroundColor Cyan

$p1 = ApiPost "$base/projetos" @{
    nome="Portal Mineracao IoT"
    stackTecnologica="Angular 21, Spring Boot 4"
    descricao="Modernizacao do portal de monitoramento"
    prioridade="ALTA"
    riscoAtual="MEDIO"
    budgetTotal=180000.00
    status="EM_ANDAMENTO"
    dataInicio="2026-01-15"
    dataPrevisaoEntrega="2026-07-31"
    clienteId=$cli1Id
    gestorId=$uGestor
    desenvolvedoresIds=@($d1Id, $d2Id)
} $token

$p2 = ApiPost "$base/projetos" @{
    nome="App Internet Banking"
    stackTecnologica="React Native, Node.js"
    descricao="Desenvolvimento aplicativo mobile"
    prioridade="ALTA"
    riscoAtual="BAIXO"
    budgetTotal=250000.00
    status="EM_ANDAMENTO"
    dataInicio="2026-02-01"
    dataPrevisaoEntrega="2026-09-30"
    clienteId=$cli2Id
    gestorId=$uGestor
    desenvolvedoresIds=@($d1Id, $d2Id)
} $token

$p3 = ApiPost "$base/projetos" @{
    nome="Portal Mineracao IoT - Alerta"
    stackTecnologica="Angular 21, Spring Boot 4"
    descricao="Portal de monitoramento IoT sob risco de atencao"
    prioridade="ALTA"
    riscoAtual="ALTO"
    budgetTotal=150000.00
    status="ALERTA"
    dataInicio="2026-01-15"
    dataPrevisaoEntrega="2026-07-31"
    clienteId=$cli1Id
    gestorId=$uGestor
    desenvolvedoresIds=@($d1Id)
} $token

$p4 = ApiPost "$base/projetos" @{
    nome="App Internet Banking - Estourado"
    stackTecnologica="React Native, Node.js"
    descricao="Aplicativo mobile estourado financeiramente"
    prioridade="ALTA"
    riscoAtual="ALTO"
    budgetTotal=200000.00
    status="ESTOURADO"
    dataInicio="2026-02-01"
    dataPrevisaoEntrega="2026-09-30"
    clienteId=$cli2Id
    gestorId=$uGestor
    desenvolvedoresIds=@($d2Id)
} $token

# =====================================================
# SPRINTS
# =====================================================
Write-Host '=== SPRINTS ===' -ForegroundColor Cyan

$s1 = ApiPost "$base/sprints" @{ nomeFase="PLANEJAMENTO"; projetoId=$p1.id; dataInicio="2026-01-15"; dataFim="2026-02-15"; status="ENCERRADA"; objetivo="Levantar requisitos tecnicos"; horasEstimadas=120 } $token
$s2 = ApiPost "$base/sprints" @{ nomeFase="DESENVOLVIMENTO"; projetoId=$p1.id; dataInicio="2026-02-16"; dataFim="2026-04-30"; status="EM_ANDAMENTO"; objetivo="Entregar os primeiros dashboards"; horasEstimadas=300 } $token
$s3 = ApiPost "$base/sprints" @{ nomeFase="PLANEJAMENTO"; projetoId=$p2.id; dataInicio="2026-02-01"; dataFim="2026-03-01"; status="ENCERRADA"; objetivo="Design System"; horasEstimadas=80 } $token
$s4 = ApiPost "$base/sprints" @{ nomeFase="DESENVOLVIMENTO"; projetoId=$p2.id; dataInicio="2026-03-02"; dataFim="2026-06-30"; status="EM_ANDAMENTO"; objetivo="Modulo PIX"; horasEstimadas=400 } $token

$s5 = ApiPost "$base/sprints" @{ nomeFase="PLANEJAMENTO"; projetoId=$p3.id; dataInicio="2026-01-15"; dataFim="2026-02-15"; status="ENCERRADA"; objetivo="Sensores e Integracao"; horasEstimadas=100 } $token
$s6 = ApiPost "$base/sprints" @{ nomeFase="DESENVOLVIMENTO"; projetoId=$p3.id; dataInicio="2026-02-16"; dataFim="2026-04-30"; status="EM_ANDAMENTO"; objetivo="Controllers IoT e Alertas"; horasEstimadas=250 } $token

$s7 = ApiPost "$base/sprints" @{ nomeFase="PLANEJAMENTO"; projetoId=$p4.id; dataInicio="2026-02-01"; dataFim="2026-03-01"; status="ENCERRADA"; objetivo="Design mobile v2"; horasEstimadas=90 } $token
$s8 = ApiPost "$base/sprints" @{ nomeFase="DESENVOLVIMENTO"; projetoId=$p4.id; dataInicio="2026-03-02"; dataFim="2026-06-30"; status="EM_ANDAMENTO"; objetivo="Integracao com Bancos"; horasEstimadas=350 } $token

# =====================================================
# TIMESHEETS
# =====================================================
Write-Host '=== TIMESHEETS ===' -ForegroundColor Cyan

ApiPost "$base/timesheets" @{ desenvolvedorId=$d1.id; sprintId=$s1.id; dataRegistro="2026-01-20"; horasTrabalhadas=8; horasExtras=0; descricaoTarefa="Levantamento IoT" } $token
ApiPost "$base/timesheets" @{ desenvolvedorId=$d1.id; sprintId=$s1.id; dataRegistro="2026-01-22"; horasTrabalhadas=8; horasExtras=2; descricaoTarefa="Reuniao minas" } $token
ApiPost "$base/timesheets" @{ desenvolvedorId=$d2.id; sprintId=$s1.id; dataRegistro="2026-01-25"; horasTrabalhadas=6; horasExtras=0; descricaoTarefa="Revisao arquitetura" } $token
ApiPost "$base/timesheets" @{ desenvolvedorId=$d1.id; sprintId=$s2.id; dataRegistro="2026-02-18"; horasTrabalhadas=8; horasExtras=2; descricaoTarefa="Controllers REST" } $token
ApiPost "$base/timesheets" @{ desenvolvedorId=$d2.id; sprintId=$s2.id; dataRegistro="2026-02-20"; horasTrabalhadas=8; horasExtras=0; descricaoTarefa="Componentes Angular" } $token

ApiPost "$base/timesheets" @{ desenvolvedorId=$d2.id; sprintId=$s3.id; dataRegistro="2026-02-05"; horasTrabalhadas=8; horasExtras=0; descricaoTarefa="Arquitetura mobile" } $token
ApiPost "$base/timesheets" @{ desenvolvedorId=$d1.id; sprintId=$s4.id; dataRegistro="2026-03-10"; horasTrabalhadas=8; horasExtras=3; descricaoTarefa="Modulo PIX sandbox" } $token
ApiPost "$base/timesheets" @{ desenvolvedorId=$d2.id; sprintId=$s4.id; dataRegistro="2026-03-20"; horasTrabalhadas=8; horasExtras=2; descricaoTarefa="Transferencias" } $token

# Horas nos novos projetos
ApiPost "$base/timesheets" @{ desenvolvedorId=$d1.id; sprintId=$s5.id; dataRegistro="2026-01-20"; horasTrabalhadas=8; horasExtras=0; descricaoTarefa="Configuracao sensores" } $token
ApiPost "$base/timesheets" @{ desenvolvedorId=$d1.id; sprintId=$s6.id; dataRegistro="2026-02-18"; horasTrabalhadas=8; horasExtras=4; descricaoTarefa="Regras de Alerta" } $token

ApiPost "$base/timesheets" @{ desenvolvedorId=$d2.id; sprintId=$s7.id; dataRegistro="2026-02-05"; horasTrabalhadas=8; horasExtras=0; descricaoTarefa="Carga de Telas" } $token
ApiPost "$base/timesheets" @{ desenvolvedorId=$d2.id; sprintId=$s8.id; dataRegistro="2026-03-20"; horasTrabalhadas=8; horasExtras=4; descricaoTarefa="Modulo Seguranca Bancaria" } $token

# =====================================================
# APROVAR TIMESHEETS (Pendente -> Aprovado para gerar custo)
# =====================================================
Write-Host '=== APROVANDO TIMESHEETS ===' -ForegroundColor Cyan
$allTs = Invoke-RestMethod -Method GET -Uri "$base/timesheets" -Headers @{ "Authorization" = "Bearer $tokenGestor" }
foreach ($ts in $allTs) {
    if ($ts.statusAprovacao -eq "PENDENTE") {
        Invoke-RestMethod -Method POST -Uri "$base/timesheets/$($ts.id)/aprovar" -Headers @{ "Authorization" = "Bearer $tokenGestor" }
    }
}

# =====================================================
# CHANGE REQUESTS & CUSTOS CLOUD
# =====================================================
Write-Host '=== CUSTOS EXTRA ===' -ForegroundColor Cyan

# Projeto 1 — Portal Mineracao IoT
ApiPost "$base/change-requests" @{ projetoId=$p1.id; solicitante="Eduardo Martins"; descricaoMudanca="Adicao de graficos em tempo real para alertas"; justificativa="Cliente quer visao instantanea"; valorAdicional=15000.00; status="APROVADO"; dataAprovacao="2026-02-28" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p1.id; provedor="AWS"; servico="AWS IoT Core"; mesReferencia="2025-12"; valorFatura=300.00; dataLancamento="2026-01-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p1.id; provedor="AWS"; servico="AWS IoT Core"; mesReferencia="2026-01"; valorFatura=350.00; dataLancamento="2026-02-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p1.id; provedor="AWS"; servico="AWS IoT Core"; mesReferencia="2026-02"; valorFatura=450.00; dataLancamento="2026-03-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p1.id; provedor="AWS"; servico="AWS IoT Core"; mesReferencia="2026-03"; valorFatura=500.00; dataLancamento="2026-04-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p1.id; provedor="AWS"; servico="AWS IoT Core"; mesReferencia="2026-04"; valorFatura=550.00; dataLancamento="2026-05-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p1.id; provedor="AWS"; servico="AWS IoT Core"; mesReferencia="2026-05"; valorFatura=600.00; dataLancamento="2026-05-23" } $token
ApiPost "$base/custos-api" @{ projetoId=$p1.id; nomeFerramenta="OpenAI GPT-4o API"; valorLicenca=1200.00 } $token
ApiPost "$base/custos-api" @{ projetoId=$p1.id; nomeFerramenta="Anthropic Claude 3.5 API"; valorLicenca=1500.00 } $token
ApiPost "$base/custos-api" @{ projetoId=$p1.id; nomeFerramenta="Google Gemini Pro API"; valorLicenca=800.00 } $token
ApiPost "$base/custos-adicionais" @{ projetoId=$p1.id; descricao="Auditoria de Seguranca externa e homologacao de LGPD"; valorAdicional=15000.00 } $token

# Projeto 2 — App Internet Banking
ApiPost "$base/custos-cloud" @{ projetoId=$p2.id; provedor="AWS"; servico="RDS"; mesReferencia="2025-12"; valorFatura=500.00; dataLancamento="2026-01-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p2.id; provedor="AWS"; servico="RDS"; mesReferencia="2026-01"; valorFatura=600.00; dataLancamento="2026-02-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p2.id; provedor="AWS"; servico="RDS"; mesReferencia="2026-02"; valorFatura=700.00; dataLancamento="2026-03-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p2.id; provedor="AWS"; servico="RDS"; mesReferencia="2026-03"; valorFatura=850.00; dataLancamento="2026-04-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p2.id; provedor="AWS"; servico="RDS"; mesReferencia="2026-04"; valorFatura=900.00; dataLancamento="2026-05-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p2.id; provedor="AWS"; servico="RDS"; mesReferencia="2026-05"; valorFatura=1000.00; dataLancamento="2026-05-23" } $token
ApiPost "$base/custos-api" @{ projetoId=$p2.id; nomeFerramenta="Anthropic Claude 3.5 API"; valorLicenca=2000.00 } $token
ApiPost "$base/custos-api" @{ projetoId=$p2.id; nomeFerramenta="OpenAI GPT-4 API"; valorLicenca=1800.00 } $token
ApiPost "$base/custos-api" @{ projetoId=$p2.id; nomeFerramenta="Pinecone Vector DB"; valorLicenca=500.00 } $token
ApiPost "$base/custos-adicionais" @{ projetoId=$p2.id; descricao="Contratacao de servidores temporarios de stress test e carga"; valorAdicional=25000.00 } $token

# Projeto 3 — Portal Mineracao IoT - Alerta (Burn rate de 82% do budget)
ApiPost "$base/change-requests" @{ projetoId=$p3.id; solicitante="Eduardo Martins"; descricaoMudanca="Sensores Adicionais de Temperatura"; justificativa="Requisito de Seguranca"; valorAdicional=5000.00; status="APROVADO"; dataAprovacao="2026-02-28" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p3.id; provedor="AWS"; servico="AWS IoT Core"; mesReferencia="2025-12"; valorFatura=150.00; dataLancamento="2026-01-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p3.id; provedor="AWS"; servico="AWS IoT Core"; mesReferencia="2026-01"; valorFatura=200.00; dataLancamento="2026-02-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p3.id; provedor="AWS"; servico="AWS IoT Core"; mesReferencia="2026-02"; valorFatura=300.00; dataLancamento="2026-03-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p3.id; provedor="AWS"; servico="AWS IoT Core"; mesReferencia="2026-03"; valorFatura=350.00; dataLancamento="2026-04-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p3.id; provedor="AWS"; servico="AWS IoT Core"; mesReferencia="2026-04"; valorFatura=400.00; dataLancamento="2026-05-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p3.id; provedor="AWS"; servico="AWS IoT Core"; mesReferencia="2026-05"; valorFatura=450.00; dataLancamento="2026-05-23" } $token
ApiPost "$base/custos-api" @{ projetoId=$p3.id; nomeFerramenta="OpenAI Whisper API"; valorLicenca=800.00 } $token
ApiPost "$base/custos-api" @{ projetoId=$p3.id; nomeFerramenta="OpenAI GPT-4o Mini"; valorLicenca=500.00 } $token
ApiPost "$base/custos-adicionais" @{ projetoId=$p3.id; descricao="Calibracao de sensores e certificacao de conformidade de hardware"; valorAdicional=122080.00 } $token

# Projeto 4 — App Internet Banking - Estourado (Burn rate de 100% do budget)
ApiPost "$base/change-requests" @{ projetoId=$p4.id; solicitante="Roberto Alves"; descricaoMudanca="Refatoracao Completa do Gateway"; justificativa="Suporte a PIX Internacional"; valorAdicional=8000.00; status="APROVADO"; dataAprovacao="2026-03-15" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p4.id; provedor="AWS"; servico="RDS"; mesReferencia="2025-12"; valorFatura=300.00; dataLancamento="2026-01-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p4.id; provedor="AWS"; servico="RDS"; mesReferencia="2026-01"; valorFatura=400.00; dataLancamento="2026-02-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p4.id; provedor="AWS"; servico="RDS"; mesReferencia="2026-02"; valorFatura=500.00; dataLancamento="2026-03-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p4.id; provedor="AWS"; servico="RDS"; mesReferencia="2026-03"; valorFatura=600.00; dataLancamento="2026-04-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p4.id; provedor="AWS"; servico="RDS"; mesReferencia="2026-04"; valorFatura=700.00; dataLancamento="2026-05-01" } $token
ApiPost "$base/custos-cloud" @{ projetoId=$p4.id; provedor="AWS"; servico="RDS"; mesReferencia="2026-05"; valorFatura=800.00; dataLancamento="2026-05-23" } $token
ApiPost "$base/custos-api" @{ projetoId=$p4.id; nomeFerramenta="Anthropic Claude Haiku API"; valorLicenca=1000.00 } $token
ApiPost "$base/custos-api" @{ projetoId=$p4.id; nomeFerramenta="OpenAI Embeddings API"; valorLicenca=400.00 } $token
ApiPost "$base/custos-adicionais" @{ projetoId=$p4.id; descricao="Licenciamento empresarial de banco de dados e consultoria tecnica de escalabilidade"; valorAdicional=200660.00 } $token

Write-Host '=== SEED CONCLUIDO ===' -ForegroundColor Green
