// DevFlow Solutions – seed data (mocks the Spring Boot backend)
const STATUS_PROJETO = {
  RASCUNHO:     { label: 'Rascunho',     bg: '#F1F5F9', fg: '#475569' },
  PLANEJADO:    { label: 'Planejado',    bg: '#DBEAFE', fg: '#1D4ED8' },
  EM_ANDAMENTO: { label: 'Em andamento', bg: '#EDE9FE', fg: '#5B21B6' },
  ALERTA:       { label: 'Alerta',       bg: '#FEF3C7', fg: '#92400E' },
  ESTOURADO:    { label: 'Estourado',    bg: '#FEE2E2', fg: '#991B1B' },
  PAUSADO:      { label: 'Pausado',      bg: '#FEF9C3', fg: '#854D0E' },
  CONCLUIDO:    { label: 'Concluído',    bg: '#DCFCE7', fg: '#166534' },
  CANCELADO:    { label: 'Cancelado',    bg: '#F1F5F9', fg: '#64748B' },
};

const STATUS_SPRINT = {
  PLANEJADA:     { label: 'Planejada',     bg: '#F1F5F9', fg: '#475569' },
  ATIVA:         { label: 'Ativa',         bg: '#DBEAFE', fg: '#1D4ED8' },
  EM_ANDAMENTO:  { label: 'Em andamento',  bg: '#EDE9FE', fg: '#5B21B6' },
  HOMOLOGACAO:   { label: 'Homologação',   bg: '#FEF3C7', fg: '#92400E' },
  ENCERRADA:     { label: 'Encerrada',     bg: '#DCFCE7', fg: '#166534' },
  CANCELADA:     { label: 'Cancelada',     bg: '#FEE2E2', fg: '#991B1B' },
};

const SENIORIDADE = {
  ESTAGIARIO:   { label: 'Estagiário',   bg: '#F1F5F9', fg: '#475569' },
  JUNIOR:       { label: 'Júnior',       bg: '#DBEAFE', fg: '#1D4ED8' },
  PLENO:        { label: 'Pleno',        bg: '#BFDBFE', fg: '#1E3A8A' },
  SENIOR:       { label: 'Sênior',       bg: '#EDE9FE', fg: '#5B21B6' },
  ESPECIALISTA: { label: 'Especialista', bg: '#FEF3C7', fg: '#B45309' },
};

const FASE_SPRINT = {
  BACKLOG:        'Backlog',
  PLANEJAMENTO:   'Planejamento',
  DESENVOLVIMENTO:'Desenvolvimento',
  TESTES:         'Testes',
  HOMOLOGACAO:    'Homologação',
  ENCERRAMENTO:   'Encerramento',
};

const ROLES = {
  ADMIN:         { label: 'Admin',         bg: '#EDE9FE', fg: '#5B21B6' },
  GESTOR:        { label: 'Gestor',        bg: '#DBEAFE', fg: '#1D4ED8' },
  DESENVOLVEDOR: { label: 'Desenvolvedor', bg: '#DCFCE7', fg: '#166534' },
  CLIENTE:       { label: 'Cliente',       bg: '#F1F5F9', fg: '#475569' },
};

const PROVEDOR_API = {
  'OpenAI':       { bg: '#DCFCE7', fg: '#166534' },
  'AWS Bedrock':  { bg: '#FFEDD5', fg: '#9A3412' },
  'Google AI':    { bg: '#DBEAFE', fg: '#1D4ED8' },
  'Anthropic':    { bg: '#F3E8FF', fg: '#6B21A8' },
};
const PROVEDOR_CLOUD = {
  'AWS':    { bg: '#FFEDD5', fg: '#9A3412' },
  'GCP':    { bg: '#DBEAFE', fg: '#1D4ED8' },
  'Azure':  { bg: '#E0E7FF', fg: '#3730A3' },
  'Oracle': { bg: '#FEE2E2', fg: '#991B1B' },
};

const seedUsuarios = [
  { id: 1, nome: 'Marina Castelo Branco', email: 'marina@devflow.io', role: 'ADMIN',         dataCriacao: '2024-09-12' },
  { id: 2, nome: 'Rafael Andrade',         email: 'rafael@devflow.io', role: 'GESTOR',        dataCriacao: '2024-10-03' },
  { id: 3, nome: 'Beatriz Saito',          email: 'bia@devflow.io',    role: 'GESTOR',        dataCriacao: '2024-11-20' },
  { id: 4, nome: 'João Henrique Pinto',    email: 'joao.h@devflow.io', role: 'DESENVOLVEDOR', dataCriacao: '2025-01-08' },
  { id: 5, nome: 'Ana Beatriz Cunha',      email: 'ana.c@devflow.io',  role: 'DESENVOLVEDOR', dataCriacao: '2025-01-22' },
  { id: 6, nome: 'Diego Oliveira',         email: 'diego@devflow.io',  role: 'DESENVOLVEDOR', dataCriacao: '2025-02-14' },
  { id: 7, nome: 'Larissa Mendes',         email: 'lari@devflow.io',   role: 'DESENVOLVEDOR', dataCriacao: '2025-02-28' },
  { id: 8, nome: 'Heitor Vasconcelos',     email: 'heitor@petrobras.com.br', role: 'CLIENTE', dataCriacao: '2024-12-01' },
];

const seedDesenvolvedores = [
  { id: 1, nome: 'João Henrique Pinto',  senioridade: 'SENIOR',       valorHoraCusto: 180.00, valorHoraExtra: 220.00, usuarioId: 4, projetoId: 1 },
  { id: 2, nome: 'Ana Beatriz Cunha',    senioridade: 'PLENO',        valorHoraCusto: 130.00, valorHoraExtra: 165.00, usuarioId: 5, projetoId: 1 },
  { id: 3, nome: 'Diego Oliveira',       senioridade: 'JUNIOR',       valorHoraCusto:  85.00, valorHoraExtra: 105.00, usuarioId: 6, projetoId: 2 },
  { id: 4, nome: 'Larissa Mendes',       senioridade: 'ESPECIALISTA', valorHoraCusto: 260.00, valorHoraExtra: 320.00, usuarioId: 7, projetoId: 3 },
  { id: 5, nome: 'Tiago Salles',         senioridade: 'PLENO',        valorHoraCusto: 140.00, valorHoraExtra: 170.00, usuarioId: null, projetoId: 4 },
  { id: 6, nome: 'Camila Reis',          senioridade: 'ESTAGIARIO',   valorHoraCusto:  45.00, valorHoraExtra:  55.00, usuarioId: null, projetoId: 2 },
];

const seedClientes = [
  { id: 1, nome: 'Petrobras S.A.',      cnpj: '33.000.167/0001-01', email: 'ti@petrobras.com.br', telefone: '(21) 3224-1510',
    endereco: { logradouro: 'Av. República do Chile', numero: '65', complemento: '', bairro: 'Centro',  cidade: 'Rio de Janeiro', estado: 'RJ', cep: '20031-912' } },
  { id: 2, nome: 'Magalu Tecnologia',   cnpj: '47.960.950/0001-21', email: 'devops@magalu.com',   telefone: '(11) 3508-7000',
    endereco: { logradouro: 'Rua Voluntários da Franca', numero: '1465', complemento: '', bairro: 'Centro', cidade: 'Franca', estado: 'SP', cep: '14400-490' } },
  { id: 3, nome: 'Banco Inter',         cnpj: '00.416.968/0001-01', email: 'parcerias@bancointer.com.br', telefone: '(31) 2105-3500',
    endereco: { logradouro: 'Av. Barbacena', numero: '1219', complemento: '21º andar', bairro: 'Santo Agostinho', cidade: 'Belo Horizonte', estado: 'MG', cep: '30190-131' } },
  { id: 4, nome: 'Movile',              cnpj: '03.230.221/0001-58', email: 'ti@movile.com',       telefone: '(19) 3429-7600',
    endereco: { logradouro: 'Av. Brigadeiro Faria Lima', numero: '4221', complemento: '5º andar', bairro: 'Itaim Bibi', cidade: 'São Paulo', estado: 'SP', cep: '04538-133' } },
];

const seedProjetos = [
  {
    id: 1, nome: 'Atena — Plataforma de Análise Sísmica',
    stackTecnologica: 'Python · FastAPI · PostgreSQL · React',
    budgetTotal: 480000.00, custoAtualAcumulado: 412800.00,
    dataInicio: '2025-01-15', dataPrevisaoEntrega: '2025-08-30',
    status: 'ALERTA', clienteId: 1,
    descricao: 'Plataforma para processamento de dados sísmicos offshore, com pipeline de ingestão em tempo real e dashboards de monitoramento de poços.',
  },
  {
    id: 2, nome: 'Cortex — Recomendador de Catálogo',
    stackTecnologica: 'Java · Spring Boot · Kafka · Redis',
    budgetTotal: 220000.00, custoAtualAcumulado: 89760.00,
    dataInicio: '2025-03-01', dataPrevisaoEntrega: '2025-09-15',
    status: 'EM_ANDAMENTO', clienteId: 2,
    descricao: 'Motor de recomendação para catálogo do marketplace com inferência por embeddings e A/B testing nativo.',
  },
  {
    id: 3, nome: 'Hermes — Gateway de Pagamentos PIX',
    stackTecnologica: 'Go · gRPC · MongoDB · Kubernetes',
    budgetTotal: 360000.00, custoAtualAcumulado: 388920.00,
    dataInicio: '2024-11-04', dataPrevisaoEntrega: '2025-05-20',
    status: 'ESTOURADO', clienteId: 3,
    descricao: 'Gateway de alta disponibilidade para liquidação PIX com integração ao SPI do Banco Central e antifraude em tempo real.',
  },
  {
    id: 4, nome: 'Lumen — Painel de Operações Mobile',
    stackTecnologica: 'TypeScript · Next.js · Prisma',
    budgetTotal: 150000.00, custoAtualAcumulado: 22300.00,
    dataInicio: '2025-04-08', dataPrevisaoEntrega: '2025-10-30',
    status: 'PLANEJADO', clienteId: 4,
    descricao: 'Painel web responsivo para o time de operações, com SSE para atualizações ao vivo e modo escuro nativo.',
  },
];

const seedSprints = [
  { id: 1,  projetoId: 1, nomeFase: 'PLANEJAMENTO',    dataInicio: '2025-01-15', dataFim: '2025-01-28', status: 'ENCERRADA' },
  { id: 2,  projetoId: 1, nomeFase: 'DESENVOLVIMENTO', dataInicio: '2025-01-29', dataFim: '2025-02-25', status: 'ENCERRADA' },
  { id: 3,  projetoId: 1, nomeFase: 'DESENVOLVIMENTO', dataInicio: '2025-02-26', dataFim: '2025-03-25', status: 'ENCERRADA' },
  { id: 4,  projetoId: 1, nomeFase: 'DESENVOLVIMENTO', dataInicio: '2025-03-26', dataFim: '2025-04-22', status: 'EM_ANDAMENTO' },
  { id: 5,  projetoId: 1, nomeFase: 'TESTES',          dataInicio: '2025-04-23', dataFim: '2025-05-20', status: 'PLANEJADA' },
  { id: 6,  projetoId: 1, nomeFase: 'HOMOLOGACAO',     dataInicio: '2025-05-21', dataFim: '2025-06-17', status: 'PLANEJADA' },
  { id: 10, projetoId: 2, nomeFase: 'PLANEJAMENTO',    dataInicio: '2025-03-01', dataFim: '2025-03-14', status: 'ENCERRADA' },
  { id: 11, projetoId: 2, nomeFase: 'DESENVOLVIMENTO', dataInicio: '2025-03-15', dataFim: '2025-04-11', status: 'ENCERRADA' },
  { id: 12, projetoId: 2, nomeFase: 'DESENVOLVIMENTO', dataInicio: '2025-04-12', dataFim: '2025-05-09', status: 'ATIVA' },
  { id: 20, projetoId: 3, nomeFase: 'PLANEJAMENTO',    dataInicio: '2024-11-04', dataFim: '2024-11-22', status: 'ENCERRADA' },
  { id: 21, projetoId: 3, nomeFase: 'DESENVOLVIMENTO', dataInicio: '2024-11-25', dataFim: '2025-01-03', status: 'ENCERRADA' },
  { id: 22, projetoId: 3, nomeFase: 'DESENVOLVIMENTO', dataInicio: '2025-01-06', dataFim: '2025-02-14', status: 'ENCERRADA' },
  { id: 23, projetoId: 3, nomeFase: 'TESTES',          dataInicio: '2025-02-17', dataFim: '2025-03-21', status: 'ENCERRADA' },
  { id: 24, projetoId: 3, nomeFase: 'HOMOLOGACAO',     dataInicio: '2025-03-24', dataFim: '2025-04-25', status: 'HOMOLOGACAO' },
  { id: 30, projetoId: 4, nomeFase: 'PLANEJAMENTO',    dataInicio: '2025-04-08', dataFim: '2025-04-21', status: 'ATIVA' },
];

const seedTimesheets = [
  { id: 100, sprintId: 4, desenvolvedorId: 1, dataRegistro: '2025-04-21', descricaoTarefa: 'Refatoração do pipeline de ingestão Kafka → Postgres com particionamento por poço', horasTrabalhadas: 8, horasExtras: 1.5 },
  { id: 101, sprintId: 4, desenvolvedorId: 2, dataRegistro: '2025-04-21', descricaoTarefa: 'Implementação de cache de leituras sísmicas via Redis com invalidação por região', horasTrabalhadas: 7, horasExtras: 0 },
  { id: 102, sprintId: 4, desenvolvedorId: 1, dataRegistro: '2025-04-22', descricaoTarefa: 'Code review + correção de race condition no consumer de eventos', horasTrabalhadas: 6, horasExtras: 0 },
  { id: 103, sprintId: 4, desenvolvedorId: 2, dataRegistro: '2025-04-22', descricaoTarefa: 'Dashboard de monitoramento de poços — gráfico de pressão em tempo real', horasTrabalhadas: 8, horasExtras: 2 },
  { id: 104, sprintId: 4, desenvolvedorId: 1, dataRegistro: '2025-04-23', descricaoTarefa: 'Migração do schema de leituras para timescaledb', horasTrabalhadas: 8, horasExtras: 0 },
  { id: 110, sprintId: 12, desenvolvedorId: 3, dataRegistro: '2025-04-15', descricaoTarefa: 'Setup do pipeline de embeddings com sentence-transformers', horasTrabalhadas: 8, horasExtras: 0 },
  { id: 111, sprintId: 12, desenvolvedorId: 6, dataRegistro: '2025-04-16', descricaoTarefa: 'Integração com feature store + testes unitários', horasTrabalhadas: 6, horasExtras: 0 },
];

const seedCustosApi = [
  { id: 1, projetoId: 1, provedor: 'OpenAI',    tipoChamada: 'GPT-4o',           quantidadeChamadas: 12400,  custoPorChamada: 0.0480, dataRegistro: '2025-04-15', observacao: 'Análise semântica de relatórios técnicos' },
  { id: 2, projetoId: 1, provedor: 'Anthropic',  tipoChamada: 'Claude 3.5 Sonnet',quantidadeChamadas: 6200,   custoPorChamada: 0.0610, dataRegistro: '2025-04-12', observacao: '' },
  { id: 3, projetoId: 1, provedor: 'OpenAI',    tipoChamada: 'Embeddings',        quantidadeChamadas: 184000, custoPorChamada: 0.00013,dataRegistro: '2025-04-10', observacao: 'Indexação de catálogo sísmico' },
  { id: 4, projetoId: 2, provedor: 'Google AI', tipoChamada: 'Gemini 1.5 Pro',   quantidadeChamadas: 3800,   custoPorChamada: 0.0290, dataRegistro: '2025-04-18', observacao: '' },
  { id: 5, projetoId: 2, provedor: 'AWS Bedrock',tipoChamada: 'Titan Embeddings', quantidadeChamadas: 92000,  custoPorChamada: 0.00010,dataRegistro: '2025-04-17', observacao: 'Indexação de SKUs do catálogo' },
  { id: 6, projetoId: 3, provedor: 'OpenAI',    tipoChamada: 'GPT-4o-mini',      quantidadeChamadas: 28100,  custoPorChamada: 0.0011, dataRegistro: '2025-04-08', observacao: 'Antifraude — análise de transações suspeitas' },
];

const seedCustosCloud = [
  { id: 1, projetoId: 1, provedor: 'AWS',   servico: 'EC2 m6i.2xlarge',   tipoCobranca: 'reservado',   valorMensal: 4280.00, mesReferencia: '2025-04-01', observacao: 'Cluster de processamento — 6 nós' },
  { id: 2, projetoId: 1, provedor: 'AWS',   servico: 'RDS Aurora Postgres',tipoCobranca: 'sob demanda', valorMensal: 3120.00, mesReferencia: '2025-04-01', observacao: '' },
  { id: 3, projetoId: 1, provedor: 'AWS',   servico: 'S3 (Glacier IR)',    tipoCobranca: 'sob demanda', valorMensal: 920.00,  mesReferencia: '2025-04-01', observacao: 'Backup de leituras sísmicas' },
  { id: 4, projetoId: 2, provedor: 'GCP',   servico: 'GKE Autopilot',     tipoCobranca: 'sob demanda', valorMensal: 1840.00, mesReferencia: '2025-04-01', observacao: '' },
  { id: 5, projetoId: 2, provedor: 'GCP',   servico: 'BigQuery',          tipoCobranca: 'sob demanda', valorMensal: 1260.00, mesReferencia: '2025-04-01', observacao: '' },
  { id: 6, projetoId: 3, provedor: 'Azure', servico: 'AKS Standard',      tipoCobranca: 'reservado',   valorMensal: 5200.00, mesReferencia: '2025-04-01', observacao: 'Cluster de produção PIX' },
  { id: 7, projetoId: 3, provedor: 'Azure', servico: 'CosmosDB',          tipoCobranca: 'sob demanda', valorMensal: 2840.00, mesReferencia: '2025-04-01', observacao: '' },
];

const seedChangeRequests = [
  { id: 1,  projetoId: 1, descricaoMudanca: 'Inclusão de módulo de exportação de relatórios em PDF assinado digitalmente, exigido pela ANP. Inclui integração com a Certisign e templates customizáveis por região operacional.', valorAdicional: 38000.00, dataAprovacao: '2025-03-12' },
  { id: 2,  projetoId: 1, descricaoMudanca: 'Reescrita do conector com o sistema legado de telemetria offshore (CRC-32 → CRC-64) e suporte a NTPv4 com PTP.', valorAdicional: 22500.00, dataAprovacao: '2025-04-02' },
  { id: 10, projetoId: 3, descricaoMudanca: 'Implementação de tokenização PCI-DSS Level 1 para cartões salvos, com vault em HSM dedicado.', valorAdicional: 64000.00, dataAprovacao: '2025-02-18' },
  { id: 11, projetoId: 3, descricaoMudanca: 'Adequação à nova circular do Bacen sobre PIX por aproximação (NFC) — alteração de fluxo de autenticação e novos casos de teste de homologação.', valorAdicional: 41200.00, dataAprovacao: '2025-03-25' },
];

const formatBRL = (n) => 'R$ ' + (Number(n) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatBRLCompact = (n) => {
  const v = Number(n) || 0;
  if (v >= 1_000_000) return 'R$ ' + (v/1_000_000).toLocaleString('pt-BR',{maximumFractionDigits:1}) + 'M';
  if (v >= 1_000)     return 'R$ ' + (v/1_000).toLocaleString('pt-BR',{maximumFractionDigits:1}) + 'k';
  return formatBRL(v);
};
const formatDate = (iso) => {
  if (!iso) return '—';
  const [y,m,d] = iso.split('-');
  return `${d}/${m}/${y}`;
};
const formatDateShort = (iso) => {
  if (!iso) return '—';
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const [y,m,d] = iso.split('-');
  return `${parseInt(d,10)} ${meses[parseInt(m,10)-1]}`;
};
const formatMesRef = (iso) => {
  if (!iso) return '—';
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const [y,m] = iso.split('-');
  return `${meses[parseInt(m,10)-1]}/${y}`;
};
const initials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length-1][0] : '')).toUpperCase();
};
const daysBetween = (a, b) => {
  const da = new Date(a), db = new Date(b);
  return Math.round((db - da) / (1000*60*60*24));
};
const burnRate = (p) => Math.round((p.custoAtualAcumulado / p.budgetTotal) * 100);
const burnColor = (pct) => {
  if (pct >= 100) return '#EF4444';
  if (pct >= 80)  return '#F97316';
  if (pct >= 60)  return '#F59E0B';
  return '#22C55E';
};

Object.assign(window, {
  STATUS_PROJETO, STATUS_SPRINT, SENIORIDADE, FASE_SPRINT, ROLES,
  PROVEDOR_API, PROVEDOR_CLOUD,
  seedUsuarios, seedDesenvolvedores, seedClientes, seedProjetos,
  seedSprints, seedTimesheets, seedCustosApi, seedCustosCloud, seedChangeRequests,
  formatBRL, formatBRLCompact, formatDate, formatDateShort, formatMesRef,
  initials, daysBetween, burnRate, burnColor,
});
