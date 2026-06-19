-- ============================================================
-- DevFlow Solutions — Seed portável (PostgreSQL 16)
-- ============================================================
-- Dump completo (schema + dados de teste) gerado a partir do
-- estado final populado pelo seed oficial. Inclui Empresa,
-- Usuarios (ADMIN/GESTOR/2x DESENVOLVEDOR), Clientes,
-- Desenvolvedores, Projetos (com cenarios ALERTA e ESTOURADO
-- do Budget Guard), Sprints, Timesheets aprovados, Change
-- Requests e Custos (Cloud/API/Adicionais).
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

\restrict zghD7RecSBpZLvb1Z8kUlEYNkMyj9tVj8DSlfeKIByWtrpFnPEPrGwtZHUf3d11

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
-- Name: tb_change_request; Type: TABLE; Schema: public; Owner: -
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
    CONSTRAINT tb_change_request_status_check CHECK (((status)::text = ANY ((ARRAY['PENDENTE'::character varying, 'EM_ANALISE'::character varying, 'APROVADO'::character varying, 'REJEITADO'::character varying])::text[])))
);


--
-- Name: tb_change_request_id_seq; Type: SEQUENCE; Schema: public; Owner: -
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
-- Name: tb_cliente; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: tb_cliente_id_seq; Type: SEQUENCE; Schema: public; Owner: -
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
-- Name: tb_custo_adicional; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_custo_adicional (
    id bigint NOT NULL,
    descricao character varying(255) NOT NULL,
    valor_adicional numeric(15,2) NOT NULL,
    projeto_id bigint NOT NULL
);


--
-- Name: tb_custo_adicional_id_seq; Type: SEQUENCE; Schema: public; Owner: -
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
-- Name: tb_custo_api; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_custo_api (
    id bigint NOT NULL,
    nome_ferramenta character varying(255) NOT NULL,
    valor_licenca numeric(38,2) NOT NULL,
    projeto_id bigint NOT NULL
);


--
-- Name: tb_custo_api_id_seq; Type: SEQUENCE; Schema: public; Owner: -
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
-- Name: tb_custo_cloud; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_custo_cloud (
    id bigint NOT NULL,
    mes_referencia character varying(255) NOT NULL,
    provedor character varying(255) NOT NULL,
    valor_fatura numeric(38,2) NOT NULL,
    projeto_id bigint NOT NULL
);


--
-- Name: tb_custo_cloud_id_seq; Type: SEQUENCE; Schema: public; Owner: -
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
-- Name: tb_desenvolvedor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_desenvolvedor (
    id bigint NOT NULL,
    nome character varying(255) NOT NULL,
    senioridade character varying(255) NOT NULL,
    valor_hora_custo numeric(10,2) NOT NULL,
    valor_hora_extra numeric(10,2) NOT NULL,
    usuario_id bigint,
    CONSTRAINT tb_desenvolvedor_senioridade_check CHECK (((senioridade)::text = ANY ((ARRAY['JUNIOR'::character varying, 'PLENO'::character varying, 'SENIOR'::character varying, 'GESTOR_TECH_LEAD'::character varying])::text[])))
);


--
-- Name: tb_desenvolvedor_id_seq; Type: SEQUENCE; Schema: public; Owner: -
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
-- Name: tb_empresa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_empresa (
    id bigint NOT NULL,
    cnpj character varying(255) NOT NULL,
    data_registro date NOT NULL,
    nome_fantasia character varying(255) NOT NULL,
    plano character varying(255) NOT NULL,
    CONSTRAINT tb_empresa_plano_check CHECK (((plano)::text = ANY ((ARRAY['FREE_BETA'::character varying, 'STARTER'::character varying, 'SCALE'::character varying])::text[])))
);


--
-- Name: tb_empresa_id_seq; Type: SEQUENCE; Schema: public; Owner: -
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
-- Name: tb_projeto; Type: TABLE; Schema: public; Owner: -
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
    CONSTRAINT tb_projeto_prioridade_check CHECK (((prioridade)::text = ANY ((ARRAY['BAIXA'::character varying, 'MEDIA'::character varying, 'ALTA'::character varying])::text[]))),
    CONSTRAINT tb_projeto_risco_atual_check CHECK (((risco_atual)::text = ANY ((ARRAY['BAIXO'::character varying, 'MEDIO'::character varying, 'ALTO'::character varying, 'CRITICO'::character varying])::text[]))),
    CONSTRAINT tb_projeto_status_check CHECK (((status)::text = ANY ((ARRAY['RASCUNHO'::character varying, 'PLANEJADO'::character varying, 'EM_ANDAMENTO'::character varying, 'ALERTA'::character varying, 'ESTOURADO'::character varying, 'PAUSADO'::character varying, 'CONCLUIDO'::character varying, 'CANCELADO'::character varying])::text[])))
);


--
-- Name: tb_projeto_desenvolvedor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_projeto_desenvolvedor (
    projeto_id bigint NOT NULL,
    desenvolvedor_id bigint NOT NULL
);


--
-- Name: tb_projeto_id_seq; Type: SEQUENCE; Schema: public; Owner: -
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
-- Name: tb_sprint; Type: TABLE; Schema: public; Owner: -
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
    CONSTRAINT tb_sprint_nome_fase_check CHECK (((nome_fase)::text = ANY ((ARRAY['BACKLOG'::character varying, 'PLANEJAMENTO'::character varying, 'DESENVOLVIMENTO'::character varying, 'TESTES'::character varying, 'HOMOLOGACAO'::character varying, 'ENCERRAMENTO'::character varying])::text[]))),
    CONSTRAINT tb_sprint_status_check CHECK (((status)::text = ANY ((ARRAY['PLANEJADA'::character varying, 'ATIVA'::character varying, 'EM_ANDAMENTO'::character varying, 'HOMOLOGACAO'::character varying, 'ENCERRADA'::character varying, 'CANCELADA'::character varying])::text[])))
);


--
-- Name: tb_sprint_id_seq; Type: SEQUENCE; Schema: public; Owner: -
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
-- Name: tb_timesheet; Type: TABLE; Schema: public; Owner: -
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
    CONSTRAINT tb_timesheet_status_aprovacao_check CHECK (((status_aprovacao)::text = ANY ((ARRAY['PENDENTE'::character varying, 'APROVADO'::character varying, 'REJEITADO'::character varying])::text[])))
);


--
-- Name: tb_timesheet_id_seq; Type: SEQUENCE; Schema: public; Owner: -
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
-- Name: tb_usuario; Type: TABLE; Schema: public; Owner: -
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
    CONSTRAINT tb_usuario_role_check CHECK (((role)::text = ANY ((ARRAY['ADMIN'::character varying, 'GESTOR'::character varying, 'DESENVOLVEDOR'::character varying, 'CLIENTE'::character varying])::text[])))
);


--
-- Name: tb_usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: -
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
-- Data for Name: tb_change_request; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_change_request (id, data_aprovacao, descricao_mudanca, impacto_horas, justificativa, solicitante, status, valor_adicional, projeto_id) FROM stdin;
1	2026-02-28	Adicao de graficos em tempo real para alertas	\N	Cliente quer visao instantanea	Eduardo Martins	APROVADO	15000.00	1
2	2026-02-28	Sensores Adicionais de Temperatura	\N	Requisito de Seguranca	Eduardo Martins	APROVADO	5000.00	3
3	2026-03-15	Refatoracao Completa do Gateway	\N	Suporte a PIX Internacional	Roberto Alves	APROVADO	8000.00	4
\.


--
-- Data for Name: tb_cliente; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_cliente (id, cnpj, bairro, cep, cidade, estado, numero, rua, foto, pessoa_contato, razao_social, empresa_id) FROM stdin;
1	33.592.510/0001-54	Itaim Bibi	04533-000	SÃ£o Paulo	SP	1000	Av. das NaÃ§Ãµes Unidas	\N	Eduardo Martins	Vale S.A.	1
2	60.746.948/0001-12	Vila Yara	06029-900	Osasco	SP	S/N	Cidade de Deus	\N	Roberto Alves	Banco Bradesco	1
3	44.555.666/0001-77	Centro	20081-240	Rio de Janeiro	RJ	1	PraÃ§a MauÃ¡	\N	Amanda Silveira	Porto Rio LogÃ­stica	1
\.


--
-- Data for Name: tb_custo_adicional; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_custo_adicional (id, descricao, valor_adicional, projeto_id) FROM stdin;
1	Auditoria de Seguranca externa e homologacao de LGPD	15000.00	1
2	Contratacao de servidores temporarios de stress test e carga	25000.00	2
3	Calibracao de sensores e certificacao de conformidade de hardware	122080.00	3
4	Licenciamento empresarial de banco de dados e consultoria tecnica de escalabilidade	200660.00	4
\.


--
-- Data for Name: tb_custo_api; Type: TABLE DATA; Schema: public; Owner: -
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
\.


--
-- Data for Name: tb_custo_cloud; Type: TABLE DATA; Schema: public; Owner: -
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
\.


--
-- Data for Name: tb_desenvolvedor; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_desenvolvedor (id, nome, senioridade, valor_hora_custo, valor_hora_extra, usuario_id) FROM stdin;
1	Carlos Mendes	PLENO	85.00	127.50	3
2	Ana Beatriz	SENIOR	120.00	180.00	4
\.


--
-- Data for Name: tb_empresa; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_empresa (id, cnpj, data_registro, nome_fantasia, plano) FROM stdin;
1	00.111.222/0001-33	2026-06-19	DevFlow Solutions	FREE_BETA
\.


--
-- Data for Name: tb_projeto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_projeto (id, budget_total, custo_atual_acumulado, data_inicio, data_previsao_entrega, descricao, nome, prioridade, risco_atual, stack_tecnologica, status, cliente_id, empresa_id, gestor_id) FROM stdin;
3	155000.00	127100.00	2026-01-15	2026-07-31	Portal de monitoramento IoT sob risco de atencao	Portal Mineracao IoT - Alerta	ALTA	ALTO	Angular 21, Spring Boot 4	ALERTA	1	1	2
4	208000.00	208000.00	2026-02-01	2026-09-30	Aplicativo mobile estourado financeiramente	App Internet Banking - Estourado	ALTA	ALTO	React Native, Node.js	ESTOURADO	2	1	2
1	195000.00	25480.00	2026-01-15	2026-07-31	Modernizacao do portal de monitoramento	Portal Mineracao IoT	ALTA	MEDIO	Angular 21, Spring Boot 4	EM_ANDAMENTO	1	1	2
2	250000.00	37192.50	2026-02-01	2026-09-30	Desenvolvimento aplicativo mobile	App Internet Banking	ALTA	BAIXO	React Native, Node.js	EM_ANDAMENTO	2	1	2
\.


--
-- Data for Name: tb_projeto_desenvolvedor; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_projeto_desenvolvedor (projeto_id, desenvolvedor_id) FROM stdin;
1	1
1	2
2	1
2	2
3	1
4	2
\.


--
-- Data for Name: tb_sprint; Type: TABLE DATA; Schema: public; Owner: -
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
\.


--
-- Data for Name: tb_timesheet; Type: TABLE DATA; Schema: public; Owner: -
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
\.


--
-- Data for Name: tb_usuario; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_usuario (id, ativo, email, foto, nome, role, senha, empresa_id) FROM stdin;
1	t	admin_final@devflow.com	\N	Admin DevFlow	ADMIN	$2a$10$w.RMKPn/9H6.YEHqvjT5p.euMo/PTwdVxXVGzorJy6lqMLiArgeHK	1
2	t	gestor_final@devflow.com	\N	Ricardo Lima	GESTOR	$2a$10$3NWHujtSkd2JV9WSHXey6ubQMbgySJYw7pCfXK9Bm6FiIeLi/MwTq	1
3	t	dev1_final@devflow.com	\N	Carlos Mendes	DESENVOLVEDOR	$2a$10$F9CCPZ0rdE8Qj/oqtwTILegH04RRqX2WJ1xK/NIFaQL643CinQPX2	1
4	t	dev2_final@devflow.com	\N	Ana Beatriz	DESENVOLVEDOR	$2a$10$SqPbBTecsk0Wf9MVQFA.TuyqoNk0D48w1JwZBVQKT8bFye8w/ruYC	1
\.


--
-- Name: tb_change_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_change_request_id_seq', 3, true);


--
-- Name: tb_cliente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_cliente_id_seq', 3, true);


--
-- Name: tb_custo_adicional_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_custo_adicional_id_seq', 4, true);


--
-- Name: tb_custo_api_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_custo_api_id_seq', 10, true);


--
-- Name: tb_custo_cloud_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_custo_cloud_id_seq', 24, true);


--
-- Name: tb_desenvolvedor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_desenvolvedor_id_seq', 2, true);


--
-- Name: tb_empresa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_empresa_id_seq', 1, true);


--
-- Name: tb_projeto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_projeto_id_seq', 4, true);


--
-- Name: tb_sprint_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_sprint_id_seq', 8, true);


--
-- Name: tb_timesheet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_timesheet_id_seq', 12, true);


--
-- Name: tb_usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_usuario_id_seq', 4, true);


--
-- Name: tb_change_request tb_change_request_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_change_request
    ADD CONSTRAINT tb_change_request_pkey PRIMARY KEY (id);


--
-- Name: tb_cliente tb_cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_cliente
    ADD CONSTRAINT tb_cliente_pkey PRIMARY KEY (id);


--
-- Name: tb_custo_adicional tb_custo_adicional_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_custo_adicional
    ADD CONSTRAINT tb_custo_adicional_pkey PRIMARY KEY (id);


--
-- Name: tb_custo_api tb_custo_api_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_custo_api
    ADD CONSTRAINT tb_custo_api_pkey PRIMARY KEY (id);


--
-- Name: tb_custo_cloud tb_custo_cloud_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_custo_cloud
    ADD CONSTRAINT tb_custo_cloud_pkey PRIMARY KEY (id);


--
-- Name: tb_desenvolvedor tb_desenvolvedor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_desenvolvedor
    ADD CONSTRAINT tb_desenvolvedor_pkey PRIMARY KEY (id);


--
-- Name: tb_empresa tb_empresa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_empresa
    ADD CONSTRAINT tb_empresa_pkey PRIMARY KEY (id);


--
-- Name: tb_projeto tb_projeto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_projeto
    ADD CONSTRAINT tb_projeto_pkey PRIMARY KEY (id);


--
-- Name: tb_sprint tb_sprint_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_sprint
    ADD CONSTRAINT tb_sprint_pkey PRIMARY KEY (id);


--
-- Name: tb_timesheet tb_timesheet_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_timesheet
    ADD CONSTRAINT tb_timesheet_pkey PRIMARY KEY (id);


--
-- Name: tb_usuario tb_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_usuario
    ADD CONSTRAINT tb_usuario_pkey PRIMARY KEY (id);


--
-- Name: tb_cliente uk88fd7rfxahu9fc66c80gfvrf9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_cliente
    ADD CONSTRAINT uk88fd7rfxahu9fc66c80gfvrf9 UNIQUE (cnpj);


--
-- Name: tb_empresa ukgamqi2pvmfim8800oc5jw05up; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_empresa
    ADD CONSTRAINT ukgamqi2pvmfim8800oc5jw05up UNIQUE (cnpj);


--
-- Name: tb_desenvolvedor ukk3y93h6l2sq267rr2dx4sso15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_desenvolvedor
    ADD CONSTRAINT ukk3y93h6l2sq267rr2dx4sso15 UNIQUE (usuario_id);


--
-- Name: tb_usuario ukspmnyb4dsul95fjmr5kmdmvub; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_usuario
    ADD CONSTRAINT ukspmnyb4dsul95fjmr5kmdmvub UNIQUE (email);


--
-- Name: idx_cloud_projeto_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cloud_projeto_id ON public.tb_custo_cloud USING btree (projeto_id);


--
-- Name: idx_timesheet_desenvolvedor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_timesheet_desenvolvedor_id ON public.tb_timesheet USING btree (desenvolvedor_id);


--
-- Name: idx_timesheet_sprint_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_timesheet_sprint_id ON public.tb_timesheet USING btree (sprint_id);


--
-- Name: tb_projeto fk3bkvf7rgjrob5w5y30q04ex7w; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_projeto
    ADD CONSTRAINT fk3bkvf7rgjrob5w5y30q04ex7w FOREIGN KEY (cliente_id) REFERENCES public.tb_cliente(id);


--
-- Name: tb_custo_api fk59dtdr4li3seqaaevjikbapm9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_custo_api
    ADD CONSTRAINT fk59dtdr4li3seqaaevjikbapm9 FOREIGN KEY (projeto_id) REFERENCES public.tb_projeto(id);


--
-- Name: tb_cliente fk7ilcpbqq0bk0m0ffyton3f253; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_cliente
    ADD CONSTRAINT fk7ilcpbqq0bk0m0ffyton3f253 FOREIGN KEY (empresa_id) REFERENCES public.tb_empresa(id);


--
-- Name: tb_projeto_desenvolvedor fk8chy74jfu4cce8asamagsh152; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_projeto_desenvolvedor
    ADD CONSTRAINT fk8chy74jfu4cce8asamagsh152 FOREIGN KEY (desenvolvedor_id) REFERENCES public.tb_desenvolvedor(id);


--
-- Name: tb_projeto fk9kpyxkatclqjleyl29ruybljy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_projeto
    ADD CONSTRAINT fk9kpyxkatclqjleyl29ruybljy FOREIGN KEY (gestor_id) REFERENCES public.tb_usuario(id);


--
-- Name: tb_usuario fke96d4ypi44t879mh2aprwm1a4; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_usuario
    ADD CONSTRAINT fke96d4ypi44t879mh2aprwm1a4 FOREIGN KEY (empresa_id) REFERENCES public.tb_empresa(id);


--
-- Name: tb_desenvolvedor fkgps0oyriissvoqa7r2n3lhpt0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_desenvolvedor
    ADD CONSTRAINT fkgps0oyriissvoqa7r2n3lhpt0 FOREIGN KEY (usuario_id) REFERENCES public.tb_usuario(id);


--
-- Name: tb_custo_adicional fkibp19ngyw27s6lepu70v14i67; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_custo_adicional
    ADD CONSTRAINT fkibp19ngyw27s6lepu70v14i67 FOREIGN KEY (projeto_id) REFERENCES public.tb_projeto(id);


--
-- Name: tb_timesheet fkj5w6fevqbtkad2l2j2ita7u73; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_timesheet
    ADD CONSTRAINT fkj5w6fevqbtkad2l2j2ita7u73 FOREIGN KEY (sprint_id) REFERENCES public.tb_sprint(id);


--
-- Name: tb_sprint fkjlkembsp4g390bgf9f7gynr5s; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_sprint
    ADD CONSTRAINT fkjlkembsp4g390bgf9f7gynr5s FOREIGN KEY (projeto_id) REFERENCES public.tb_projeto(id);


--
-- Name: tb_change_request fkk6cnmmdwfldvy92g80dd2eoyw; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_change_request
    ADD CONSTRAINT fkk6cnmmdwfldvy92g80dd2eoyw FOREIGN KEY (projeto_id) REFERENCES public.tb_projeto(id);


--
-- Name: tb_timesheet fkkusswercdt84ycoijv2g5wjaw; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_timesheet
    ADD CONSTRAINT fkkusswercdt84ycoijv2g5wjaw FOREIGN KEY (desenvolvedor_id) REFERENCES public.tb_desenvolvedor(id);


--
-- Name: tb_projeto_desenvolvedor fknddrl6prnpkxtno6e1x6fs0dy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_projeto_desenvolvedor
    ADD CONSTRAINT fknddrl6prnpkxtno6e1x6fs0dy FOREIGN KEY (projeto_id) REFERENCES public.tb_projeto(id);


--
-- Name: tb_custo_cloud fknwg8g6e6kl28dwulgeaw6wjo9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_custo_cloud
    ADD CONSTRAINT fknwg8g6e6kl28dwulgeaw6wjo9 FOREIGN KEY (projeto_id) REFERENCES public.tb_projeto(id);


--
-- Name: tb_projeto fkrl6md92t1sy0eyofwapuy7lp5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_projeto
    ADD CONSTRAINT fkrl6md92t1sy0eyofwapuy7lp5 FOREIGN KEY (empresa_id) REFERENCES public.tb_empresa(id);


--
-- PostgreSQL database dump complete
--

\unrestrict zghD7RecSBpZLvb1Z8kUlEYNkMyj9tVj8DSlfeKIByWtrpFnPEPrGwtZHUf3d11

