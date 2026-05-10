# DevFlow Seed Script — popula banco com dados fictícios
# Uso: powershell -ExecutionPolicy Bypass -File .\docs\seed.ps1

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
        Write-Host 'ERRO em ' $uri ' : ' $err -ForegroundColor Red
        return $null
    }
}

$base = 'http://localhost:8080/api/v1'

Write-Host '=== CRIANDO USUARIOS ===' -ForegroundColor Cyan
ApiPost "$base/usuarios" @{ nome="Admin Sistema"; email="admin_final@devflow.com"; senha="Admin@2026"; role="ADMIN"; ativo=$true } $null
ApiPost "$base/usuarios" @{ nome="Desenvolvedor Um"; email="dev1_final@devflow.com"; senha="Dev@2026"; role="DESENVOLVEDOR"; ativo=$true } $null
ApiPost "$base/usuarios" @{ nome="Desenvolvedor Dois"; email="dev2_final@devflow.com"; senha="Dev@2026"; role="DESENVOLVEDOR"; ativo=$true } $null
ApiPost "$base/usuarios" @{ nome="Gestor Projetos"; email="gestor_final@devflow.com"; senha="Dev@2026"; role="GESTOR"; ativo=$true } $null

Write-Host '=== LOGIN ===' -ForegroundColor Cyan
$loginResp = ApiPost "$base/auth/login" @{ email="admin_final@devflow.com"; senha="Admin@2026" } $null
$token = $loginResp.token
if (-not $token) { Write-Host "FALHA NO LOGIN!"; exit }
Write-Host 'Token OK' -ForegroundColor Green

Write-Host '=== CLIENTES ===' -ForegroundColor Cyan
# CNPJs validos: Vale SA e Bradesco
$cli1 = ApiPost "$base/clientes" @{ razaoSocial="Vale S.A."; cnpj="33.592.510/0001-54"; pessoaContato="Eduardo" } $token
$cli2 = ApiPost "$base/clientes" @{ razaoSocial="Banco Bradesco"; cnpj="60.746.948/0001-12"; pessoaContato="Roberto" } $token

Write-Host '=== PROJETOS ===' -ForegroundColor Cyan
$p1 = ApiPost "$base/projetos" @{ nome="Portal Mineracao"; stackTecnologica="Angular 21, Spring Boot 4"; budgetTotal=180000.00; dataInicio="2026-01-15"; dataPrevisaoEntrega="2026-07-31"; clienteId=$cli1.id } $token
$p2 = ApiPost "$base/projetos" @{ nome="App Internet Banking"; stackTecnologica="React Native, Node.js"; budgetTotal=250000.00; dataInicio="2026-02-01"; dataPrevisaoEntrega="2026-09-30"; clienteId=$cli2.id } $token
$p3 = ApiPost "$base/projetos" @{ nome="DevFlow Analytics"; stackTecnologica="Angular 21, Spring Boot 4"; budgetTotal=50000.00; dataInicio="2026-03-01"; dataPrevisaoEntrega="2026-06-30"; clienteId=$cli1.id } $token

Write-Host '=== SPRINTS ===' -ForegroundColor Cyan
$s1 = ApiPost "$base/sprints" @{ nomeFase="PLANEJAMENTO"; projetoId=$p1.id; dataInicio="2026-01-15"; dataFim="2026-02-15" } $token
$s2 = ApiPost "$base/sprints" @{ nomeFase="DESENVOLVIMENTO"; projetoId=$p1.id; dataInicio="2026-02-16"; dataFim="2026-04-30" } $token
$s3 = ApiPost "$base/sprints" @{ nomeFase="PLANEJAMENTO"; projetoId=$p2.id; dataInicio="2026-02-01"; dataFim="2026-03-01" } $token
$s4 = ApiPost "$base/sprints" @{ nomeFase="DESENVOLVIMENTO"; projetoId=$p3.id; dataInicio="2026-03-01"; dataFim="2026-05-01" } $token
$s5 = ApiPost "$base/sprints" @{ nomeFase="TESTES"; projetoId=$p3.id; dataInicio="2026-05-02"; dataFim="2026-06-30" } $token

Write-Host '=== DESENVOLVEDORES ===' -ForegroundColor Cyan
$usuarios = Invoke-RestMethod -Method GET -Uri "$base/usuarios" -Headers @{ "Authorization" = "Bearer $token" }

$uDev1 = ($usuarios | Where-Object email -eq 'dev1_final@devflow.com').id
$uDev2 = ($usuarios | Where-Object email -eq 'dev2_final@devflow.com').id
$uGestor = ($usuarios | Where-Object email -eq 'gestor_final@devflow.com').id

$d1 = ApiPost "$base/desenvolvedores" @{ nome="Desenvolvedor Um"; senioridade="PLENO"; valorHoraCusto=85.00; valorHoraExtra=127.50; usuarioId=$uDev1; projetoId=$p1.id } $token
$d2 = ApiPost "$base/desenvolvedores" @{ nome="Desenvolvedor Dois"; senioridade="JUNIOR"; valorHoraCusto=60.00; valorHoraExtra=90.00; usuarioId=$uDev2; projetoId=$p1.id } $token
$d3 = ApiPost "$base/desenvolvedores" @{ nome="Gestor Projetos"; senioridade="SENIOR"; valorHoraCusto=120.00; valorHoraExtra=180.00; usuarioId=$uGestor; projetoId=$p2.id } $token

Write-Host '=== TIMESHEETS ===' -ForegroundColor Cyan
$ts1 = ApiPost "$base/timesheets" @{ desenvolvedorId=$d1.id; sprintId=$s1.id; dataRegistro="2026-01-20"; horasTrabalhadas=8.0; horasExtras=0.0; descricaoTarefa="Levantamento DB" } $token
$ts2 = ApiPost "$base/timesheets" @{ desenvolvedorId=$d1.id; sprintId=$s2.id; dataRegistro="2026-02-18"; horasTrabalhadas=8.0; horasExtras=2.0; descricaoTarefa="Controllers REST" } $token
$ts3 = ApiPost "$base/timesheets" @{ desenvolvedorId=$d2.id; sprintId=$s2.id; dataRegistro="2026-02-20"; horasTrabalhadas=8.0; horasExtras=0.0; descricaoTarefa="Componentes Angular" } $token
$ts4 = ApiPost "$base/timesheets" @{ desenvolvedorId=$d2.id; sprintId=$s4.id; dataRegistro="2026-03-10"; horasTrabalhadas=6.0; horasExtras=2.0; descricaoTarefa="Integracao e bugs" } $token
$ts5 = ApiPost "$base/timesheets" @{ desenvolvedorId=$d3.id; sprintId=$s3.id; dataRegistro="2026-02-05"; horasTrabalhadas=8.0; horasExtras=0.0; descricaoTarefa="Arquitetura mobile" } $token

Write-Host '=== CUSTOS CLOUD ===' -ForegroundColor Cyan
$cc1 = ApiPost "$base/custos-cloud" @{ projetoId=$p1.id; provedor="AWS"; valorFatura=1200.00; mesReferencia="2026-02" } $token
$cc2 = ApiPost "$base/custos-cloud" @{ projetoId=$p1.id; provedor="AWS"; valorFatura=1350.00; mesReferencia="2026-03" } $token
$cc3 = ApiPost "$base/custos-cloud" @{ projetoId=$p2.id; provedor="GCP"; valorFatura=850.00; mesReferencia="2026-03" } $token
$cc4 = ApiPost "$base/custos-cloud" @{ projetoId=$p3.id; provedor="Azure"; valorFatura=420.00; mesReferencia="2026-04" } $token

Write-Host '=== CUSTOS API ===' -ForegroundColor Cyan
$ca1 = ApiPost "$base/custos-api" @{ projetoId=$p1.id; nomeFerramenta="Google Maps API"; valorLicenca=150.00 } $token
$ca2 = ApiPost "$base/custos-api" @{ projetoId=$p1.id; nomeFerramenta="Twilio SMS"; valorLicenca=45.00 } $token
$ca3 = ApiPost "$base/custos-api" @{ projetoId=$p2.id; nomeFerramenta="Stripe Connect"; valorLicenca=89.90 } $token

Write-Host '=== CHANGE REQUESTS ===' -ForegroundColor Cyan
$cr1 = ApiPost "$base/change-requests" @{ projetoId=$p1.id; descricaoMudanca="Modulo de Relatorios Avançados"; valorAdicional=5000.00; dataAprovacao="2026-03-15" } $token
$cr2 = ApiPost "$base/change-requests" @{ projetoId=$p2.id; descricaoMudanca="Integracao com PIX"; valorAdicional=3500.00; dataAprovacao="2026-04-10" } $token

Write-Host 'SEED CONCLUIDO COM SUCESSO' -ForegroundColor Green
