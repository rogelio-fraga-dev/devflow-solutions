-- ============================================================
-- DevFlow Solutions — Seed portável (PostgreSQL 16)
-- ============================================================
-- Dump completo (schema + dados de teste) com massa de dados
-- para apresentação. Inclui Empresa, Usuarios, Clientes,
-- Desenvolvedores, Projetos (com cenarios ALERTA e ESTOURADO do
-- Budget Guard), Sprints, Timesheets, Change Requests e Custos.
--
-- COMO IMPORTAR (o banco devflow_db precisa existir — o Docker ja cria):
--   psql -U devflow_user -d devflow_db -f docs/devflow_seed.sql
--   docker exec -i devflow_db psql -U devflow_user -d devflow_db < docs/devflow_seed.sql
--
-- CREDENCIAIS DE ACESSO (ja com hash BCrypt neste dump):
--   admin_final@devflow.com   / Admin@2026   (ADMIN)
--   gestor_final@devflow.com  / Dev@2026     (GESTOR)
--   dev1_final@devflow.com    / Dev@2026     (DESENVOLVEDOR)
--   dev2_final@devflow.com    / Dev@2026     (DESENVOLVEDOR)
-- ============================================================

--
-- PostgreSQL database dump
--

\restrict uvg0f1vHdlB0z0gHuwE8On12KwmUuPex7d6bm8k3qCGWK7gEfsCNHTwxfXFz0IZ

-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.tb_projeto DROP CONSTRAINT IF EXISTS fkrl6md92t1sy0eyofwapuy7lp5;
ALTER TABLE IF EXISTS ONLY public.tb_custo_cloud DROP CONSTRAINT IF EXISTS fknwg8g6e6kl28dwulgeaw6wjo9;
ALTER TABLE IF EXISTS ONLY public.tb_projeto_desenvolvedor DROP CONSTRAINT IF EXISTS fknddrl6prnpkxtno6e1x6fs0dy;
ALTER TABLE IF EXISTS ONLY public.tb_timesheet DROP CONSTRAINT IF EXISTS fkkusswercdt84ycoijv2g5wjaw;
ALTER TABLE IF EXISTS ONLY public.tb_change_request DROP CONSTRAINT IF EXISTS fkk6cnmmdwfldvy92g80dd2eoyw;
ALTER TABLE IF EXISTS ONLY public.tb_sprint DROP CONSTRAINT IF EXISTS fkjlkembsp4g390bgf9f7gynr5s;
ALTER TABLE IF EXISTS ONLY public.tb_timesheet DROP CONSTRAINT IF EXISTS fkj5w6fevqbtkad2l2j2ita7u73;
ALTER TABLE IF EXISTS ONLY public.tb_custo_adicional DROP CONSTRAINT IF EXISTS fkibp19ngyw27s6lepu70v14i67;
ALTER TABLE IF EXISTS ONLY public.tb_desenvolvedor DROP CONSTRAINT IF EXISTS fkgps0oyriissvoqa7r2n3lhpt0;
ALTER TABLE IF EXISTS ONLY public.tb_usuario DROP CONSTRAINT IF EXISTS fke96d4ypi44t879mh2aprwm1a4;
ALTER TABLE IF EXISTS ONLY public.tb_projeto DROP CONSTRAINT IF EXISTS fk9kpyxkatclqjleyl29ruybljy;
ALTER TABLE IF EXISTS ONLY public.tb_projeto_desenvolvedor DROP CONSTRAINT IF EXISTS fk8chy74jfu4cce8asamagsh152;
ALTER TABLE IF EXISTS ONLY public.tb_cliente DROP CONSTRAINT IF EXISTS fk7ilcpbqq0bk0m0ffyton3f253;
ALTER TABLE IF EXISTS ONLY public.tb_custo_api DROP CONSTRAINT IF EXISTS fk59dtdr4li3seqaaevjikbapm9;
ALTER TABLE IF EXISTS ONLY public.tb_projeto DROP CONSTRAINT IF EXISTS fk3bkvf7rgjrob5w5y30q04ex7w;
DROP INDEX IF EXISTS public.idx_timesheet_sprint_id;
DROP INDEX IF EXISTS public.idx_timesheet_desenvolvedor_id;
DROP INDEX IF EXISTS public.idx_cloud_projeto_id;
ALTER TABLE IF EXISTS ONLY public.tb_usuario DROP CONSTRAINT IF EXISTS ukspmnyb4dsul95fjmr5kmdmvub;
ALTER TABLE IF EXISTS ONLY public.tb_desenvolvedor DROP CONSTRAINT IF EXISTS ukk3y93h6l2sq267rr2dx4sso15;
ALTER TABLE IF EXISTS ONLY public.tb_empresa DROP CONSTRAINT IF EXISTS ukgamqi2pvmfim8800oc5jw05up;
ALTER TABLE IF EXISTS ONLY public.tb_cliente DROP CONSTRAINT IF EXISTS uk88fd7rfxahu9fc66c80gfvrf9;
ALTER TABLE IF EXISTS ONLY public.tb_usuario DROP CONSTRAINT IF EXISTS tb_usuario_pkey;
ALTER TABLE IF EXISTS ONLY public.tb_timesheet DROP CONSTRAINT IF EXISTS tb_timesheet_pkey;
ALTER TABLE IF EXISTS ONLY public.tb_sprint DROP CONSTRAINT IF EXISTS tb_sprint_pkey;
ALTER TABLE IF EXISTS ONLY public.tb_projeto DROP CONSTRAINT IF EXISTS tb_projeto_pkey;
ALTER TABLE IF EXISTS ONLY public.tb_empresa DROP CONSTRAINT IF EXISTS tb_empresa_pkey;
ALTER TABLE IF EXISTS ONLY public.tb_desenvolvedor DROP CONSTRAINT IF EXISTS tb_desenvolvedor_pkey;
ALTER TABLE IF EXISTS ONLY public.tb_custo_cloud DROP CONSTRAINT IF EXISTS tb_custo_cloud_pkey;
ALTER TABLE IF EXISTS ONLY public.tb_custo_api DROP CONSTRAINT IF EXISTS tb_custo_api_pkey;
ALTER TABLE IF EXISTS ONLY public.tb_custo_adicional DROP CONSTRAINT IF EXISTS tb_custo_adicional_pkey;
ALTER TABLE IF EXISTS ONLY public.tb_cliente DROP CONSTRAINT IF EXISTS tb_cliente_pkey;
ALTER TABLE IF EXISTS ONLY public.tb_change_request DROP CONSTRAINT IF EXISTS tb_change_request_pkey;
DROP TABLE IF EXISTS public.tb_usuario;
DROP TABLE IF EXISTS public.tb_timesheet;
DROP TABLE IF EXISTS public.tb_sprint;
DROP TABLE IF EXISTS public.tb_projeto_desenvolvedor;
DROP TABLE IF EXISTS public.tb_projeto;
DROP TABLE IF EXISTS public.tb_empresa;
DROP TABLE IF EXISTS public.tb_desenvolvedor;
DROP TABLE IF EXISTS public.tb_custo_cloud;
DROP TABLE IF EXISTS public.tb_custo_api;
DROP TABLE IF EXISTS public.tb_custo_adicional;
DROP TABLE IF EXISTS public.tb_cliente;
DROP TABLE IF EXISTS public.tb_change_request;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: tb_change_request; Type: TABLE; Schema: public; Owner: devflow_user
--

CREATE TABLE public.tb_change_request (
    id bigint NOT NULL,
    data_aprovacao date,
    descricao_mudanca character varying(255) NOT NULL,
    impacto_horas integer,
    justificativa text,
    solicitante character varying(255),
    status character varying(255),
    valor_adicional numeric(38,2) NOT NULL,
    projeto_id bigint NOT NULL,
    CONSTRAINT tb_change_request_status_check CHECK (((status)::text = ANY (ARRAY[('PENDENTE'::character varying)::text, ('EM_ANALISE'::character varying)::text, ('APROVADO'::character varying)::text, ('REJEITADO'::character varying)::text])))
);


ALTER TABLE public.tb_change_request OWNER TO devflow_user;

--
-- Name: tb_change_request_id_seq; Type: SEQUENCE; Schema: public; Owner: devflow_user
--

ALTER TABLE public.tb_change_request ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.tb_change_request_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tb_cliente; Type: TABLE; Schema: public; Owner: devflow_user
--

CREATE TABLE public.tb_cliente (
    id bigint NOT NULL,
    cnpj character varying(255),
    bairro character varying(255),
    cep character varying(255),
    cidade character varying(255),
    estado character varying(255),
    numero character varying(255),
    rua character varying(255),
    foto text,
    pessoa_contato character varying(255),
    razao_social character varying(255) NOT NULL,
    empresa_id bigint
);


ALTER TABLE public.tb_cliente OWNER TO devflow_user;

--
-- Name: tb_cliente_id_seq; Type: SEQUENCE; Schema: public; Owner: devflow_user
--

ALTER TABLE public.tb_cliente ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.tb_cliente_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tb_custo_adicional; Type: TABLE; Schema: public; Owner: devflow_user
--

CREATE TABLE public.tb_custo_adicional (
    id bigint NOT NULL,
    descricao character varying(255) NOT NULL,
    valor_adicional numeric(15,2) NOT NULL,
    projeto_id bigint NOT NULL
);


ALTER TABLE public.tb_custo_adicional OWNER TO devflow_user;

--
-- Name: tb_custo_adicional_id_seq; Type: SEQUENCE; Schema: public; Owner: devflow_user
--

ALTER TABLE public.tb_custo_adicional ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.tb_custo_adicional_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tb_custo_api; Type: TABLE; Schema: public; Owner: devflow_user
--

CREATE TABLE public.tb_custo_api (
    id bigint NOT NULL,
    nome_ferramenta character varying(255) NOT NULL,
    valor_licenca numeric(38,2) NOT NULL,
    projeto_id bigint NOT NULL
);


ALTER TABLE public.tb_custo_api OWNER TO devflow_user;

--
-- Name: tb_custo_api_id_seq; Type: SEQUENCE; Schema: public; Owner: devflow_user
--

ALTER TABLE public.tb_custo_api ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.tb_custo_api_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tb_custo_cloud; Type: TABLE; Schema: public; Owner: devflow_user
--

CREATE TABLE public.tb_custo_cloud (
    id bigint NOT NULL,
    mes_referencia character varying(255) NOT NULL,
    provedor character varying(255) NOT NULL,
    valor_fatura numeric(38,2) NOT NULL,
    projeto_id bigint NOT NULL
);


ALTER TABLE public.tb_custo_cloud OWNER TO devflow_user;

--
-- Name: tb_custo_cloud_id_seq; Type: SEQUENCE; Schema: public; Owner: devflow_user
--

ALTER TABLE public.tb_custo_cloud ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.tb_custo_cloud_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tb_desenvolvedor; Type: TABLE; Schema: public; Owner: devflow_user
--

CREATE TABLE public.tb_desenvolvedor (
    id bigint NOT NULL,
    nome character varying(255) NOT NULL,
    senioridade character varying(255) NOT NULL,
    valor_hora_custo numeric(10,2) NOT NULL,
    valor_hora_extra numeric(10,2) NOT NULL,
    usuario_id bigint,
    CONSTRAINT tb_desenvolvedor_senioridade_check CHECK (((senioridade)::text = ANY (ARRAY[('JUNIOR'::character varying)::text, ('PLENO'::character varying)::text, ('SENIOR'::character varying)::text, ('GESTOR_TECH_LEAD'::character varying)::text])))
);


ALTER TABLE public.tb_desenvolvedor OWNER TO devflow_user;

--
-- Name: tb_desenvolvedor_id_seq; Type: SEQUENCE; Schema: public; Owner: devflow_user
--

ALTER TABLE public.tb_desenvolvedor ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.tb_desenvolvedor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tb_empresa; Type: TABLE; Schema: public; Owner: devflow_user
--

CREATE TABLE public.tb_empresa (
    id bigint NOT NULL,
    cnpj character varying(255) NOT NULL,
    data_registro date NOT NULL,
    nome_fantasia character varying(255) NOT NULL,
    plano character varying(255) NOT NULL,
    CONSTRAINT tb_empresa_plano_check CHECK (((plano)::text = ANY (ARRAY[('FREE_BETA'::character varying)::text, ('STARTER'::character varying)::text, ('SCALE'::character varying)::text])))
);


ALTER TABLE public.tb_empresa OWNER TO devflow_user;

--
-- Name: tb_empresa_id_seq; Type: SEQUENCE; Schema: public; Owner: devflow_user
--

ALTER TABLE public.tb_empresa ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.tb_empresa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tb_projeto; Type: TABLE; Schema: public; Owner: devflow_user
--

CREATE TABLE public.tb_projeto (
    id bigint NOT NULL,
    budget_total numeric(15,2) NOT NULL,
    custo_atual_acumulado numeric(15,2),
    data_inicio date NOT NULL,
    data_previsao_entrega date,
    descricao text,
    nome character varying(255) NOT NULL,
    prioridade character varying(255),
    risco_atual character varying(255),
    stack_tecnologica character varying(255),
    status character varying(255),
    cliente_id bigint,
    empresa_id bigint,
    gestor_id bigint NOT NULL,
    CONSTRAINT tb_projeto_prioridade_check CHECK (((prioridade)::text = ANY (ARRAY[('BAIXA'::character varying)::text, ('MEDIA'::character varying)::text, ('ALTA'::character varying)::text]))),
    CONSTRAINT tb_projeto_risco_atual_check CHECK (((risco_atual)::text = ANY (ARRAY[('BAIXO'::character varying)::text, ('MEDIO'::character varying)::text, ('ALTO'::character varying)::text, ('CRITICO'::character varying)::text]))),
    CONSTRAINT tb_projeto_status_check CHECK (((status)::text = ANY (ARRAY[('RASCUNHO'::character varying)::text, ('PLANEJADO'::character varying)::text, ('EM_ANDAMENTO'::character varying)::text, ('ALERTA'::character varying)::text, ('ESTOURADO'::character varying)::text, ('PAUSADO'::character varying)::text, ('CONCLUIDO'::character varying)::text, ('CANCELADO'::character varying)::text])))
);


ALTER TABLE public.tb_projeto OWNER TO devflow_user;

--
-- Name: tb_projeto_desenvolvedor; Type: TABLE; Schema: public; Owner: devflow_user
--

CREATE TABLE public.tb_projeto_desenvolvedor (
    projeto_id bigint NOT NULL,
    desenvolvedor_id bigint NOT NULL
);


ALTER TABLE public.tb_projeto_desenvolvedor OWNER TO devflow_user;

--
-- Name: tb_projeto_id_seq; Type: SEQUENCE; Schema: public; Owner: devflow_user
--

ALTER TABLE public.tb_projeto ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.tb_projeto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tb_sprint; Type: TABLE; Schema: public; Owner: devflow_user
--

CREATE TABLE public.tb_sprint (
    id bigint NOT NULL,
    data_fim date NOT NULL,
    data_inicio date NOT NULL,
    horas_estimadas integer,
    nome_fase character varying(255),
    objetivo text,
    observacoes text,
    status character varying(255),
    projeto_id bigint NOT NULL,
    CONSTRAINT tb_sprint_nome_fase_check CHECK (((nome_fase)::text = ANY (ARRAY[('BACKLOG'::character varying)::text, ('PLANEJAMENTO'::character varying)::text, ('DESENVOLVIMENTO'::character varying)::text, ('TESTES'::character varying)::text, ('HOMOLOGACAO'::character varying)::text, ('ENCERRAMENTO'::character varying)::text]))),
    CONSTRAINT tb_sprint_status_check CHECK (((status)::text = ANY (ARRAY[('PLANEJADA'::character varying)::text, ('ATIVA'::character varying)::text, ('EM_ANDAMENTO'::character varying)::text, ('HOMOLOGACAO'::character varying)::text, ('ENCERRADA'::character varying)::text, ('CANCELADA'::character varying)::text])))
);


ALTER TABLE public.tb_sprint OWNER TO devflow_user;

--
-- Name: tb_sprint_id_seq; Type: SEQUENCE; Schema: public; Owner: devflow_user
--

ALTER TABLE public.tb_sprint ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.tb_sprint_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tb_timesheet; Type: TABLE; Schema: public; Owner: devflow_user
--

CREATE TABLE public.tb_timesheet (
    id bigint NOT NULL,
    billable boolean NOT NULL,
    data_registro date NOT NULL,
    descricao_tarefa character varying(255),
    horas_extras double precision,
    horas_trabalhadas double precision NOT NULL,
    status_aprovacao character varying(255) NOT NULL,
    desenvolvedor_id bigint NOT NULL,
    sprint_id bigint NOT NULL,
    CONSTRAINT tb_timesheet_status_aprovacao_check CHECK (((status_aprovacao)::text = ANY (ARRAY[('PENDENTE'::character varying)::text, ('APROVADO'::character varying)::text, ('REJEITADO'::character varying)::text])))
);


ALTER TABLE public.tb_timesheet OWNER TO devflow_user;

--
-- Name: tb_timesheet_id_seq; Type: SEQUENCE; Schema: public; Owner: devflow_user
--

ALTER TABLE public.tb_timesheet ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.tb_timesheet_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tb_usuario; Type: TABLE; Schema: public; Owner: devflow_user
--

CREATE TABLE public.tb_usuario (
    id bigint NOT NULL,
    ativo boolean NOT NULL,
    email character varying(255) NOT NULL,
    foto text,
    nome character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    senha character varying(255) NOT NULL,
    empresa_id bigint,
    CONSTRAINT tb_usuario_role_check CHECK (((role)::text = ANY (ARRAY[('ADMIN'::character varying)::text, ('GESTOR'::character varying)::text, ('DESENVOLVEDOR'::character varying)::text, ('CLIENTE'::character varying)::text])))
);


ALTER TABLE public.tb_usuario OWNER TO devflow_user;

--
-- Name: tb_usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: devflow_user
--

ALTER TABLE public.tb_usuario ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.tb_usuario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: tb_change_request; Type: TABLE DATA; Schema: public; Owner: devflow_user
--

COPY public.tb_change_request (id, data_aprovacao, descricao_mudanca, impacto_horas, justificativa, solicitante, status, valor_adicional, projeto_id) FROM stdin;
1	2026-02-28	Adicao de graficos em tempo real para alertas	\N	Cliente quer visao instantanea	Eduardo Martins	APROVADO	15000.00	1
2	2026-02-28	Sensores Adicionais de Temperatura	\N	Requisito de Seguranca	Eduardo Martins	APROVADO	5000.00	3
3	2026-03-15	Refatoracao Completa do Gateway	\N	Suporte a PIX Internacional	Roberto Alves	APROVADO	8000.00	4
4	2026-06-10	Mudança de provedor Cloud	40	Cliente prefere GCP ao invés de AWS	Roberto Alves	APROVADO	20000.00	7
5	\N	Adicionar Dashboard Executivo	80	Diretoria quer visão analítica	Amanda Silveira	PENDENTE	15000.00	5
6	2025-08-01	Inclusão de App iOS nativo	300	Mercado demanda	Eduardo Martins	REJEITADO	100000.00	8
7	2026-06-05	Troca de framework frontend para Angular 21	120	Padronização tech stack empresa	Roberto Alves	APROVADO	25000.00	5
8	\N	Inclusão de PIX no app B2B	80	Mercado exige PIX	Eduardo Martins	PENDENTE	18000.00	5
9	2025-05-10	Remoção de módulo Logística Inbound	0	Corte de escopo por orçamento	Roberto Alves	APROVADO	0.00	6
10	\N	Aumento de cluster K8s	60	Testes de carga falharam	Amanda Silveira	EM_ANALISE	12000.00	7
11	2026-04-01	Migrar banco para RDS Aurora	40	Performance de I/O insuficiente	Carlos Mendes	APROVADO	8500.00	7
12	2025-06-20	Adição de módulo B2C	300	Diretoria quer expandir publico alvo no meio do projeto	Eduardo Martins	REJEITADO	150000.00	8
13	2025-07-01	Troca de Gateway Pagar.me para Stripe	100	Taxas melhores	Roberto Alves	APROVADO	20000.00	8
14	2026-06-18	Novo layout dark mode	20	Tendência design	Amanda Silveira	PENDENTE	4000.00	9
15	2025-04-10	Integração com ADP RH antigo	200	Manter histórico de 10 anos	Roberto Alves	APROVADO	45000.00	10
16	2026-03-01	Incluir prescrição médica digital	180	Diferencial competitivo	Eduardo Martins	APROVADO	60000.00	11
17	2026-04-10	Suporte a smartwatch	250	Coletar bpm	Eduardo Martins	REJEITADO	85000.00	11
18	\N	Uso de LLM local privado Llama 3	100	Privacidade de dados de fábrica	Roberto Alves	EM_ANALISE	55000.00	12
19	2026-04-15	Módulo de conciliação bancária automática	150	Financeiro exigiu para fechar contrato	Amanda Silveira	APROVADO	45000.00	13
20	2026-05-10	Suporte a Open Finance	300	Novo marco regulatório Banco Central	Eduardo Martins	PENDENTE	120000.00	13
21	2025-12-01	Refazer telas em Flutter	150	React Native estava lento	Carlos Mendes	REJEITADO	35000.00	14
\.


--
-- Data for Name: tb_cliente; Type: TABLE DATA; Schema: public; Owner: devflow_user
--

COPY public.tb_cliente (id, cnpj, bairro, cep, cidade, estado, numero, rua, foto, pessoa_contato, razao_social, empresa_id) FROM stdin;
2	60.746.948/0001-12	Vila Yara	06029-900	Osasco	SP	S/N	Cidade de Deus	\N	Roberto Alves	Banco Bradesco	1
3	44.555.666/0001-77	Centro	20081-240	Rio de Janeiro	RJ	1	PraÃ§a MauÃ¡	\N	Amanda Silveira	Porto Rio LogÃ­stica	1
1	33.592.510/0001-54	Itaim Bibi	04533-000	SÃ£o Paulo	SP	1000	Av. das NaÃ§Ãµes Unidas	data:image/jpeg;base64,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	Eduardo Martins	Vale S.A.	1
\.


--
-- Data for Name: tb_custo_adicional; Type: TABLE DATA; Schema: public; Owner: devflow_user
--

COPY public.tb_custo_adicional (id, descricao, valor_adicional, projeto_id) FROM stdin;
1	Auditoria de Seguranca externa e homologacao de LGPD	15000.00	1
2	Contratacao de servidores temporarios de stress test e carga	25000.00	2
3	Calibracao de sensores e certificacao de conformidade de hardware	122080.00	3
4	Licenciamento empresarial de banco de dados e consultoria tecnica de escalabilidade	200660.00	4
5	Consultoria Jurídica Internacional	25000.00	5
6	Multa contratual de rescisão	50000.00	6
7	Hardware Security Modules (HSM)	15000.00	5
8	Treinamento Kafka Certificação	8000.00	5
9	Rescisão de contrato fornecedor terceiro	45000.00	6
10	Consultoria AWS Architect Pj	35000.00	7
11	Multa atraso datacenter on-premise	18000.00	7
12	Compra de licenças Windows Server	12500.00	7
13	Campanha de Marketing Lançamento B2B	120000.00	8
14	Auditoria de segurança UX/UI B2B	15000.00	8
15	Fotógrafo profissional para produtos	3500.00	9
16	Licenças Microsoft 365 para equipe RH	25000.00	10
17	Certificação HIPPA Consultoria Médica	35000.00	11
18	Campanha Ads Telemedicina App	18000.00	11
19	Aquisição de Servidor GPU Nvidia A100	180000.00	12
20	Dataset proprietário para treinamento AI	75000.00	12
21	Licença Anual Certificado SSL EV Financeiro	12000.00	13
22	Devolução de valores de Beta Testers	8000.00	14
\.


--
-- Data for Name: tb_custo_api; Type: TABLE DATA; Schema: public; Owner: devflow_user
--

COPY public.tb_custo_api (id, nome_ferramenta, valor_licenca, projeto_id) FROM stdin;
1	OpenAI GPT-4o API	1200.00	1
2	Anthropic Claude 3.5 API	1500.00	1
3	Google Gemini Pro API	800.00	1
4	Anthropic Claude 3.5 API	2000.00	2
5	OpenAI GPT-4 API	1800.00	2
6	Pinecone Vector DB	500.00	2
7	OpenAI Whisper API	800.00	3
8	OpenAI GPT-4o Mini	500.00	3
9	Anthropic Claude Haiku API	1000.00	4
10	OpenAI Embeddings API	400.00	4
11	OpenAI GPT-4o API	1000.00	12
12	Stripe API	500.00	8
13	Kafka Confluent Cloud	3500.00	5
14	Auth0 Enterprise	1200.00	5
15	Google Maps API	400.00	6
16	Twilio SMS	250.00	6
17	Datadog APM	2800.00	7
18	Snowflake DB	4500.00	7
19	Stripe Billing	1500.00	8
20	Algolia Search	800.00	8
21	SendGrid Pro	350.00	8
22	Mailchimp API	120.00	9
23	BambooHR API	850.00	10
24	DocuSign API	600.00	10
25	Agora.io Video API	2500.00	11
26	AWS Comprehend Medical	1800.00	11
27	Twilio WhatsApp API	450.00	11
28	OpenAI GPT-4o API	5000.00	12
29	HuggingFace Endpoints	3200.00	12
30	Serpro Receita API	900.00	13
31	Plaid API	2200.00	13
32	Bloomberg Data API	6500.00	13
33	Firebase Auth	50.00	14
34	Google Calendar API	15.00	14
\.


--
-- Data for Name: tb_custo_cloud; Type: TABLE DATA; Schema: public; Owner: devflow_user
--

COPY public.tb_custo_cloud (id, mes_referencia, provedor, valor_fatura, projeto_id) FROM stdin;
1	2025-12	AWS	300.00	1
2	2026-01	AWS	350.00	1
3	2026-02	AWS	450.00	1
4	2026-03	AWS	500.00	1
5	2026-04	AWS	550.00	1
6	2026-05	AWS	600.00	1
7	2025-12	AWS	500.00	2
8	2026-01	AWS	600.00	2
9	2026-02	AWS	700.00	2
10	2026-03	AWS	850.00	2
11	2026-04	AWS	900.00	2
12	2026-05	AWS	1000.00	2
13	2025-12	AWS	150.00	3
14	2026-01	AWS	200.00	3
15	2026-02	AWS	300.00	3
16	2026-03	AWS	350.00	3
17	2026-04	AWS	400.00	3
18	2026-05	AWS	450.00	3
19	2025-12	AWS	300.00	4
20	2026-01	AWS	400.00	4
21	2026-02	AWS	500.00	4
22	2026-03	AWS	600.00	4
23	2026-04	AWS	700.00	4
24	2026-05	AWS	800.00	4
25	2026-06	AWS	1500.00	5
26	2026-06	GCP	3000.00	7
27	2026-06	AZURE	500.00	13
28	2026-06	AWS	2500.00	5
29	2026-07	AWS	3500.00	5
30	2025-02	GCP	800.00	6
31	2025-03	GCP	1200.00	6
32	2025-04	GCP	1500.00	6
33	2026-03	AWS	5000.00	7
34	2026-04	AWS	12000.00	7
35	2026-05	AWS	18000.00	7
36	2026-06	AWS	22000.00	7
37	2025-05	AZURE	400.00	8
38	2025-06	AZURE	900.00	8
39	2025-07	AZURE	1800.00	8
40	2025-08	AZURE	3000.00	8
41	2025-09	AZURE	4500.00	8
42	2026-06	DIGITALOCEAN	50.00	9
43	2025-01	ORACLE	2000.00	10
44	2025-06	ORACLE	2500.00	10
45	2025-11	ORACLE	2500.00	10
46	2026-01	GCP	600.00	11
47	2026-02	GCP	800.00	11
48	2026-03	GCP	1200.00	11
49	2026-04	GCP	1800.00	11
50	2026-08	AWS	400.00	12
51	2026-02	AZURE	1000.00	13
52	2026-03	AZURE	1500.00	13
53	2026-04	AZURE	2500.00	13
54	2026-05	AZURE	3500.00	13
55	2025-11	AWS	200.00	14
56	2025-12	AWS	350.00	14
\.


--
-- Data for Name: tb_desenvolvedor; Type: TABLE DATA; Schema: public; Owner: devflow_user
--

COPY public.tb_desenvolvedor (id, nome, senioridade, valor_hora_custo, valor_hora_extra, usuario_id) FROM stdin;
1	Carlos Mendes	PLENO	85.00	127.50	3
2	Ana Beatriz	SENIOR	120.00	180.00	4
\.


--
-- Data for Name: tb_empresa; Type: TABLE DATA; Schema: public; Owner: devflow_user
--

COPY public.tb_empresa (id, cnpj, data_registro, nome_fantasia, plano) FROM stdin;
1	00.111.222/0001-33	2026-06-19	DevFlow Solutions	FREE_BETA
\.


--
-- Data for Name: tb_projeto; Type: TABLE DATA; Schema: public; Owner: devflow_user
--

COPY public.tb_projeto (id, budget_total, custo_atual_acumulado, data_inicio, data_previsao_entrega, descricao, nome, prioridade, risco_atual, stack_tecnologica, status, cliente_id, empresa_id, gestor_id) FROM stdin;
3	155000.00	127100.00	2026-01-15	2026-07-31	Portal de monitoramento IoT sob risco de atencao	Portal Mineracao IoT - Alerta	ALTA	ALTO	Angular 21, Spring Boot 4	ALERTA	1	1	2
4	208000.00	208000.00	2026-02-01	2026-09-30	Aplicativo mobile estourado financeiramente	App Internet Banking - Estourado	ALTA	ALTO	React Native, Node.js	ESTOURADO	2	1	2
1	195000.00	25480.00	2026-01-15	2026-07-31	Modernizacao do portal de monitoramento	Portal Mineracao IoT	ALTA	MEDIO	Angular 21, Spring Boot 4	EM_ANDAMENTO	1	1	2
2	250000.00	37192.50	2026-02-01	2026-09-30	Desenvolvimento aplicativo mobile	App Internet Banking	ALTA	BAIXO	React Native, Node.js	EM_ANDAMENTO	2	1	2
5	500000.00	10000.00	2026-06-01	2027-06-01	Reconstrução do core banking com arquitetura de microserviços. Projeto gigantesco e com alto risco.	Core Banking V2	ALTA	ALTO	Java, Spring Boot, Kafka	PLANEJADO	2	1	2
6	120000.00	150000.00	2025-01-10	2025-10-10	Projeto cancelado devido a problemas de orçamento e mudanças na diretoria do cliente.	App Logística Antigo	MEDIA	CRITICO	React Native, Node.js	CANCELADO	3	1	2
7	85000.00	80000.00	2026-03-01	2026-08-30	Migração de servidores on-premise para AWS. Orçamento quase estourado.	Migração Nuvem	ALTA	ALTO	AWS, Terraform, Kubernetes	ALERTA	1	1	2
8	200000.00	250000.00	2025-05-01	2025-12-31	Desenvolvimento de plataforma E-commerce B2B. Estourou o orçamento por escopo mal definido.	E-commerce B2B	MEDIA	CRITICO	Angular, Node.js, PostgreSQL	ESTOURADO	3	1	2
9	45000.00	5000.00	2026-06-15	2026-09-15	Criação de landing pages e campanhas de marketing pontuais.	Campanha Q3 2026	BAIXA	BAIXO	Wordpress, PHP	EM_ANDAMENTO	2	1	2
10	300000.00	300000.00	2025-01-01	2025-12-01	Sistema de RH interno para gestão de ponto e benefícios. Entregue no prazo e orçamento.	Portal RH Interno	MEDIA	BAIXO	Vue.js, Python Django	CONCLUIDO	1	1	2
11	150000.00	75000.00	2026-01-10	2026-11-20	App de telemedicina focado em saúde mental.	Telemedicina App	ALTA	MEDIO	Flutter, Firebase, Node	PAUSADO	2	1	2
12	600000.00	0.00	2026-08-01	2028-08-01	Novo projeto de inteligência artificial para predição de falhas em maquinário pesado.	IA Manutenção Preditiva	ALTA	BAIXO	Python, TensorFlow, AWS	RASCUNHO	1	1	2
13	95000.00	90000.00	2026-02-01	2026-07-01	Projeto de integração de APIs de terceiros para consolidação de dados financeiros.	Integração Financeira API	MEDIA	ALTO	Spring Boot, RabbitMQ	ALERTA	2	1	2
14	50000.00	55000.00	2025-11-01	2026-02-28	App de agendamento de consultas cancelado logo após o MVP por falta de tração.	Agendamento Fácil	BAIXA	CRITICO	React, Firebase	CANCELADO	3	1	2
\.


--
-- Data for Name: tb_projeto_desenvolvedor; Type: TABLE DATA; Schema: public; Owner: devflow_user
--

COPY public.tb_projeto_desenvolvedor (projeto_id, desenvolvedor_id) FROM stdin;
1	1
1	2
2	1
2	2
3	1
4	2
5	1
5	2
6	1
7	2
8	1
8	2
9	1
10	1
10	2
11	1
13	2
14	1
\.


--
-- Data for Name: tb_sprint; Type: TABLE DATA; Schema: public; Owner: devflow_user
--

COPY public.tb_sprint (id, data_fim, data_inicio, horas_estimadas, nome_fase, objetivo, observacoes, status, projeto_id) FROM stdin;
1	2026-02-15	2026-01-15	120	PLANEJAMENTO	Levantar requisitos tecnicos	\N	ENCERRADA	1
2	2026-04-30	2026-02-16	300	DESENVOLVIMENTO	Entregar os primeiros dashboards	\N	EM_ANDAMENTO	1
3	2026-03-01	2026-02-01	80	PLANEJAMENTO	Design System	\N	ENCERRADA	2
4	2026-06-30	2026-03-02	400	DESENVOLVIMENTO	Modulo PIX	\N	EM_ANDAMENTO	2
5	2026-02-15	2026-01-15	100	PLANEJAMENTO	Sensores e Integracao	\N	ENCERRADA	3
6	2026-04-30	2026-02-16	250	DESENVOLVIMENTO	Controllers IoT e Alertas	\N	EM_ANDAMENTO	3
7	2026-03-01	2026-02-01	90	PLANEJAMENTO	Design mobile v2	\N	ENCERRADA	4
8	2026-06-30	2026-03-02	350	DESENVOLVIMENTO	Integracao com Bancos	\N	EM_ANDAMENTO	4
9	2026-07-02	2026-06-19	\N	BACKLOG	22222222	\N	PLANEJADA	4
10	2026-06-30	2026-06-19	\N	PLANEJAMENTO	2222222222222222	\N	PLANEJADA	1
11	2026-06-24	2026-06-02	\N	BACKLOG	2222222222222	\N	PLANEJADA	3
12	2026-06-30	2026-06-01	120	PLANEJAMENTO	Kickoff e arquitetura	\N	EM_ANDAMENTO	5
13	2025-12-31	2025-12-01	200	ENCERRAMENTO	Entrega final	\N	ENCERRADA	10
14	2026-06-30	2026-06-01	80	DESENVOLVIMENTO	Refatoracao final	\N	ATIVA	13
15	2026-06-15	2026-06-01	80	PLANEJAMENTO	Requisitos e backlog inicial	\N	ENCERRADA	5
16	2026-06-30	2026-06-16	100	DESENVOLVIMENTO	Setup ambiente base	\N	EM_ANDAMENTO	5
17	2025-02-15	2025-01-10	120	PLANEJAMENTO	Fase 1	\N	ENCERRADA	6
18	2025-03-15	2025-02-16	100	DESENVOLVIMENTO	MVP 1	\N	ENCERRADA	6
19	2026-04-15	2026-03-01	90	PLANEJAMENTO	Arquitetura AWS	\N	ENCERRADA	7
20	2026-05-15	2026-04-16	110	DESENVOLVIMENTO	Terraform scripts	\N	ENCERRADA	7
21	2026-06-15	2026-05-16	130	HOMOLOGACAO	Teste carga	\N	ATIVA	7
22	2025-06-15	2025-05-01	80	PLANEJAMENTO	UX B2B	\N	ENCERRADA	8
23	2025-07-15	2025-06-16	150	DESENVOLVIMENTO	Core API B2B	\N	ENCERRADA	8
24	2025-08-15	2025-07-16	200	DESENVOLVIMENTO	Módulo carrinho B2B	\N	ENCERRADA	8
25	2026-07-15	2026-06-15	50	PLANEJAMENTO	Landing 1	\N	EM_ANDAMENTO	9
26	2025-02-15	2025-01-01	80	PLANEJAMENTO	Processo RH	\N	ENCERRADA	10
27	2025-06-15	2025-02-16	400	DESENVOLVIMENTO	Sist. de Ponto	\N	ENCERRADA	10
28	2025-11-15	2025-06-16	300	HOMOLOGACAO	Beta testing RH	\N	ENCERRADA	10
29	2026-02-15	2026-01-10	100	PLANEJAMENTO	Arquitetura App Med	\N	ENCERRADA	11
30	2026-05-15	2026-02-16	250	DESENVOLVIMENTO	Videochamada module	\N	ENCERRADA	11
31	2026-09-15	2026-08-01	120	PLANEJAMENTO	Pesquisa IA	\N	PLANEJADA	12
32	2026-03-15	2026-02-01	90	PLANEJAMENTO	APIs Financeiras Mapping	\N	ENCERRADA	13
33	2026-05-15	2026-03-16	200	DESENVOLVIMENTO	Integração Safra e Bradesco	\N	ENCERRADA	13
34	2025-12-15	2025-11-01	60	PLANEJAMENTO	App base Firebase	\N	ENCERRADA	14
\.


--
-- Data for Name: tb_timesheet; Type: TABLE DATA; Schema: public; Owner: devflow_user
--

COPY public.tb_timesheet (id, billable, data_registro, descricao_tarefa, horas_extras, horas_trabalhadas, status_aprovacao, desenvolvedor_id, sprint_id) FROM stdin;
1	t	2026-01-20	Levantamento IoT	0	8	APROVADO	1	1
2	t	2026-01-22	Reuniao minas	2	8	APROVADO	1	1
3	t	2026-01-25	Revisao arquitetura	0	6	APROVADO	2	1
4	t	2026-02-18	Controllers REST	2	8	APROVADO	1	2
5	t	2026-02-20	Componentes Angular	0	8	APROVADO	2	2
6	t	2026-02-05	Arquitetura mobile	0	8	APROVADO	2	3
7	t	2026-03-10	Modulo PIX sandbox	3	8	APROVADO	1	4
8	t	2026-03-20	Transferencias	2	8	APROVADO	2	4
9	t	2026-01-20	Configuracao sensores	0	8	APROVADO	1	5
10	t	2026-02-18	Regras de Alerta	4	8	APROVADO	1	6
11	t	2026-02-05	Carga de Telas	0	8	APROVADO	2	7
12	t	2026-03-20	Modulo Seguranca Bancaria	4	8	APROVADO	2	8
13	t	2026-06-05	Reunião de Kickoff	0	4	APROVADO	1	9
14	t	2026-06-06	Definição arquitetura	0	8	PENDENTE	2	9
15	f	2026-06-10	Refatoração urgente	2	8	APROVADO	2	11
16	t	2026-06-02	Reunião Kickoff V2	0	8	APROVADO	1	1
17	t	2026-06-05	Especificação Kafka	2	8	APROVADO	2	1
18	t	2026-06-17	Setup cluster Kafka	0	8	PENDENTE	1	2
19	t	2026-06-18	Consumers Node.js	1	8	PENDENTE	2	2
20	t	2026-03-05	Terraform EC2	0	8	APROVADO	2	5
21	t	2026-03-10	Terraform RDS	2	8	APROVADO	2	5
22	t	2026-04-20	Migração de Dados Batch	4	8	APROVADO	1	6
23	t	2026-04-25	Validação integridade dados	0	8	APROVADO	2	6
24	t	2026-05-20	Testes de stress JMeter	0	8	PENDENTE	1	7
25	f	2025-06-20	Correção bug crítico Stripe	5	8	APROVADO	1	9
26	t	2025-07-20	Carrinho persistente Redis	0	8	APROVADO	2	10
27	t	2025-08-05	Checkout final Stripe	2	8	APROVADO	1	10
28	t	2026-06-16	Criação HTML LP 1	0	6	APROVADO	1	11
29	t	2025-04-10	API Integracao ADP	2	8	APROVADO	1	13
30	t	2025-04-12	Workers de Ponto	0	8	APROVADO	2	13
31	t	2025-07-20	Relatórios PDF	0	8	APROVADO	1	14
32	t	2026-03-10	API Twilio Vídeo	1	8	APROVADO	1	16
33	t	2026-03-15	Telas Flutter Câmera	0	8	APROVADO	2	16
34	f	2026-04-05	Refatoração código legado	0	8	REJEITADO	1	19
35	t	2026-04-10	Integração Bradesco NET Empresa	3	8	APROVADO	2	19
36	t	2025-11-20	Firebase Auth UI	0	8	APROVADO	1	20
\.


--
-- Data for Name: tb_usuario; Type: TABLE DATA; Schema: public; Owner: devflow_user
--

COPY public.tb_usuario (id, ativo, email, foto, nome, role, senha, empresa_id) FROM stdin;
2	t	gestor_final@devflow.com	\N	Ricardo Lima	GESTOR	$2a$10$3NWHujtSkd2JV9WSHXey6ubQMbgySJYw7pCfXK9Bm6FiIeLi/MwTq	1
3	t	dev1_final@devflow.com	\N	Carlos Mendes	DESENVOLVEDOR	$2a$10$F9CCPZ0rdE8Qj/oqtwTILegH04RRqX2WJ1xK/NIFaQL643CinQPX2	1
4	t	dev2_final@devflow.com	\N	Ana Beatriz	DESENVOLVEDOR	$2a$10$SqPbBTecsk0Wf9MVQFA.TuyqoNk0D48w1JwZBVQKT8bFye8w/ruYC	1
1	t	admin_final@devflow.com	data:image/jpeg;base64,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	Admin DevFlow	ADMIN	$2a$10$w.RMKPn/9H6.YEHqvjT5p.euMo/PTwdVxXVGzorJy6lqMLiArgeHK	1
\.


--
-- Name: tb_change_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devflow_user
--

SELECT pg_catalog.setval('public.tb_change_request_id_seq', 21, true);


--
-- Name: tb_cliente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devflow_user
--

SELECT pg_catalog.setval('public.tb_cliente_id_seq', 4, true);


--
-- Name: tb_custo_adicional_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devflow_user
--

SELECT pg_catalog.setval('public.tb_custo_adicional_id_seq', 22, true);


--
-- Name: tb_custo_api_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devflow_user
--

SELECT pg_catalog.setval('public.tb_custo_api_id_seq', 34, true);


--
-- Name: tb_custo_cloud_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devflow_user
--

SELECT pg_catalog.setval('public.tb_custo_cloud_id_seq', 56, true);


--
-- Name: tb_desenvolvedor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devflow_user
--

SELECT pg_catalog.setval('public.tb_desenvolvedor_id_seq', 2, true);


--
-- Name: tb_empresa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devflow_user
--

SELECT pg_catalog.setval('public.tb_empresa_id_seq', 1, true);


--
-- Name: tb_projeto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devflow_user
--

SELECT pg_catalog.setval('public.tb_projeto_id_seq', 14, true);


--
-- Name: tb_sprint_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devflow_user
--

SELECT pg_catalog.setval('public.tb_sprint_id_seq', 34, true);


--
-- Name: tb_timesheet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devflow_user
--

SELECT pg_catalog.setval('public.tb_timesheet_id_seq', 36, true);


--
-- Name: tb_usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devflow_user
--

SELECT pg_catalog.setval('public.tb_usuario_id_seq', 4, true);


--
-- Name: tb_change_request tb_change_request_pkey; Type: CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_change_request
    ADD CONSTRAINT tb_change_request_pkey PRIMARY KEY (id);


--
-- Name: tb_cliente tb_cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_cliente
    ADD CONSTRAINT tb_cliente_pkey PRIMARY KEY (id);


--
-- Name: tb_custo_adicional tb_custo_adicional_pkey; Type: CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_custo_adicional
    ADD CONSTRAINT tb_custo_adicional_pkey PRIMARY KEY (id);


--
-- Name: tb_custo_api tb_custo_api_pkey; Type: CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_custo_api
    ADD CONSTRAINT tb_custo_api_pkey PRIMARY KEY (id);


--
-- Name: tb_custo_cloud tb_custo_cloud_pkey; Type: CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_custo_cloud
    ADD CONSTRAINT tb_custo_cloud_pkey PRIMARY KEY (id);


--
-- Name: tb_desenvolvedor tb_desenvolvedor_pkey; Type: CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_desenvolvedor
    ADD CONSTRAINT tb_desenvolvedor_pkey PRIMARY KEY (id);


--
-- Name: tb_empresa tb_empresa_pkey; Type: CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_empresa
    ADD CONSTRAINT tb_empresa_pkey PRIMARY KEY (id);


--
-- Name: tb_projeto tb_projeto_pkey; Type: CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_projeto
    ADD CONSTRAINT tb_projeto_pkey PRIMARY KEY (id);


--
-- Name: tb_sprint tb_sprint_pkey; Type: CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_sprint
    ADD CONSTRAINT tb_sprint_pkey PRIMARY KEY (id);


--
-- Name: tb_timesheet tb_timesheet_pkey; Type: CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_timesheet
    ADD CONSTRAINT tb_timesheet_pkey PRIMARY KEY (id);


--
-- Name: tb_usuario tb_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_usuario
    ADD CONSTRAINT tb_usuario_pkey PRIMARY KEY (id);


--
-- Name: tb_cliente uk88fd7rfxahu9fc66c80gfvrf9; Type: CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_cliente
    ADD CONSTRAINT uk88fd7rfxahu9fc66c80gfvrf9 UNIQUE (cnpj);


--
-- Name: tb_empresa ukgamqi2pvmfim8800oc5jw05up; Type: CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_empresa
    ADD CONSTRAINT ukgamqi2pvmfim8800oc5jw05up UNIQUE (cnpj);


--
-- Name: tb_desenvolvedor ukk3y93h6l2sq267rr2dx4sso15; Type: CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_desenvolvedor
    ADD CONSTRAINT ukk3y93h6l2sq267rr2dx4sso15 UNIQUE (usuario_id);


--
-- Name: tb_usuario ukspmnyb4dsul95fjmr5kmdmvub; Type: CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_usuario
    ADD CONSTRAINT ukspmnyb4dsul95fjmr5kmdmvub UNIQUE (email);


--
-- Name: idx_cloud_projeto_id; Type: INDEX; Schema: public; Owner: devflow_user
--

CREATE INDEX idx_cloud_projeto_id ON public.tb_custo_cloud USING btree (projeto_id);


--
-- Name: idx_timesheet_desenvolvedor_id; Type: INDEX; Schema: public; Owner: devflow_user
--

CREATE INDEX idx_timesheet_desenvolvedor_id ON public.tb_timesheet USING btree (desenvolvedor_id);


--
-- Name: idx_timesheet_sprint_id; Type: INDEX; Schema: public; Owner: devflow_user
--

CREATE INDEX idx_timesheet_sprint_id ON public.tb_timesheet USING btree (sprint_id);


--
-- Name: tb_projeto fk3bkvf7rgjrob5w5y30q04ex7w; Type: FK CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_projeto
    ADD CONSTRAINT fk3bkvf7rgjrob5w5y30q04ex7w FOREIGN KEY (cliente_id) REFERENCES public.tb_cliente(id);


--
-- Name: tb_custo_api fk59dtdr4li3seqaaevjikbapm9; Type: FK CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_custo_api
    ADD CONSTRAINT fk59dtdr4li3seqaaevjikbapm9 FOREIGN KEY (projeto_id) REFERENCES public.tb_projeto(id);


--
-- Name: tb_cliente fk7ilcpbqq0bk0m0ffyton3f253; Type: FK CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_cliente
    ADD CONSTRAINT fk7ilcpbqq0bk0m0ffyton3f253 FOREIGN KEY (empresa_id) REFERENCES public.tb_empresa(id);


--
-- Name: tb_projeto_desenvolvedor fk8chy74jfu4cce8asamagsh152; Type: FK CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_projeto_desenvolvedor
    ADD CONSTRAINT fk8chy74jfu4cce8asamagsh152 FOREIGN KEY (desenvolvedor_id) REFERENCES public.tb_desenvolvedor(id);


--
-- Name: tb_projeto fk9kpyxkatclqjleyl29ruybljy; Type: FK CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_projeto
    ADD CONSTRAINT fk9kpyxkatclqjleyl29ruybljy FOREIGN KEY (gestor_id) REFERENCES public.tb_usuario(id);


--
-- Name: tb_usuario fke96d4ypi44t879mh2aprwm1a4; Type: FK CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_usuario
    ADD CONSTRAINT fke96d4ypi44t879mh2aprwm1a4 FOREIGN KEY (empresa_id) REFERENCES public.tb_empresa(id);


--
-- Name: tb_desenvolvedor fkgps0oyriissvoqa7r2n3lhpt0; Type: FK CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_desenvolvedor
    ADD CONSTRAINT fkgps0oyriissvoqa7r2n3lhpt0 FOREIGN KEY (usuario_id) REFERENCES public.tb_usuario(id);


--
-- Name: tb_custo_adicional fkibp19ngyw27s6lepu70v14i67; Type: FK CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_custo_adicional
    ADD CONSTRAINT fkibp19ngyw27s6lepu70v14i67 FOREIGN KEY (projeto_id) REFERENCES public.tb_projeto(id);


--
-- Name: tb_timesheet fkj5w6fevqbtkad2l2j2ita7u73; Type: FK CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_timesheet
    ADD CONSTRAINT fkj5w6fevqbtkad2l2j2ita7u73 FOREIGN KEY (sprint_id) REFERENCES public.tb_sprint(id);


--
-- Name: tb_sprint fkjlkembsp4g390bgf9f7gynr5s; Type: FK CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_sprint
    ADD CONSTRAINT fkjlkembsp4g390bgf9f7gynr5s FOREIGN KEY (projeto_id) REFERENCES public.tb_projeto(id);


--
-- Name: tb_change_request fkk6cnmmdwfldvy92g80dd2eoyw; Type: FK CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_change_request
    ADD CONSTRAINT fkk6cnmmdwfldvy92g80dd2eoyw FOREIGN KEY (projeto_id) REFERENCES public.tb_projeto(id);


--
-- Name: tb_timesheet fkkusswercdt84ycoijv2g5wjaw; Type: FK CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_timesheet
    ADD CONSTRAINT fkkusswercdt84ycoijv2g5wjaw FOREIGN KEY (desenvolvedor_id) REFERENCES public.tb_desenvolvedor(id);


--
-- Name: tb_projeto_desenvolvedor fknddrl6prnpkxtno6e1x6fs0dy; Type: FK CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_projeto_desenvolvedor
    ADD CONSTRAINT fknddrl6prnpkxtno6e1x6fs0dy FOREIGN KEY (projeto_id) REFERENCES public.tb_projeto(id);


--
-- Name: tb_custo_cloud fknwg8g6e6kl28dwulgeaw6wjo9; Type: FK CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_custo_cloud
    ADD CONSTRAINT fknwg8g6e6kl28dwulgeaw6wjo9 FOREIGN KEY (projeto_id) REFERENCES public.tb_projeto(id);


--
-- Name: tb_projeto fkrl6md92t1sy0eyofwapuy7lp5; Type: FK CONSTRAINT; Schema: public; Owner: devflow_user
--

ALTER TABLE ONLY public.tb_projeto
    ADD CONSTRAINT fkrl6md92t1sy0eyofwapuy7lp5 FOREIGN KEY (empresa_id) REFERENCES public.tb_empresa(id);


--
-- PostgreSQL database dump complete
--

\unrestrict uvg0f1vHdlB0z0gHuwE8On12KwmUuPex7d6bm8k3qCGWK7gEfsCNHTwxfXFz0IZ

