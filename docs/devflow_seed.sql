-- ============================================================
-- DevFlow Solutions — Seed portável (MySQL 8.0)
-- ============================================================
-- Dump completo (schema + dados de teste) gerado a partir do
-- estado final populado pelo seed oficial. Inclui:
--   Empresa, Usuários (ADMIN/GESTOR/2x DESENVOLVEDOR),
--   Clientes, Desenvolvedores, Projetos (com cenários ALERTA
--   e ESTOURADO do Budget Guard), Sprints, Timesheets aprovados,
--   Change Requests e Custos (Cloud/API/Adicionais).
--
-- COMO IMPORTAR (banco será criado se não existir):
--   mysql -u root -p < docs/devflow_seed.sql
--   (ou:  mysql -u devflow_user -p devflow_db < docs/devflow_seed.sql)
--
-- CREDENCIAIS DE ACESSO (já com hash BCrypt neste dump):
--   admin_final@devflow.com   / Admin@2026   (ADMIN)
--   gestor_final@devflow.com  / Dev@2026     (GESTOR)
--   dev1_final@devflow.com    / Dev@2026     (DESENVOLVEDOR)
--   dev2_final@devflow.com    / Dev@2026     (DESENVOLVEDOR)
-- ============================================================

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `devflow_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `devflow_db`;
DROP TABLE IF EXISTS `tb_change_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_change_request` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `data_aprovacao` date DEFAULT NULL,
  `descricao_mudanca` varchar(255) NOT NULL,
  `impacto_horas` int DEFAULT NULL,
  `justificativa` text,
  `solicitante` varchar(255) DEFAULT NULL,
  `status` enum('APROVADO','EM_ANALISE','PENDENTE','REJEITADO') DEFAULT NULL,
  `valor_adicional` decimal(38,2) NOT NULL,
  `projeto_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKk6cnmmdwfldvy92g80dd2eoyw` (`projeto_id`),
  CONSTRAINT `FKk6cnmmdwfldvy92g80dd2eoyw` FOREIGN KEY (`projeto_id`) REFERENCES `tb_projeto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `tb_change_request` WRITE;
/*!40000 ALTER TABLE `tb_change_request` DISABLE KEYS */;
INSERT INTO `tb_change_request` VALUES (1,'2026-02-28','Adicao de graficos em tempo real para alertas',NULL,'Cliente quer visao instantanea','Eduardo Martins','APROVADO',15000.00,1),(2,'2026-02-28','Sensores Adicionais de Temperatura',NULL,'Requisito de Seguranca','Eduardo Martins','APROVADO',5000.00,3),(3,'2026-03-15','Refatoracao Completa do Gateway',NULL,'Suporte a PIX Internacional','Roberto Alves','APROVADO',8000.00,4);
/*!40000 ALTER TABLE `tb_change_request` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `tb_cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_cliente` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cnpj` varchar(255) DEFAULT NULL,
  `bairro` varchar(255) DEFAULT NULL,
  `cep` varchar(255) DEFAULT NULL,
  `cidade` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `numero` varchar(255) DEFAULT NULL,
  `rua` varchar(255) DEFAULT NULL,
  `foto` longtext,
  `pessoa_contato` varchar(255) DEFAULT NULL,
  `razao_social` varchar(255) NOT NULL,
  `empresa_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK88fd7rfxahu9fc66c80gfvrf9` (`cnpj`),
  KEY `FK7ilcpbqq0bk0m0ffyton3f253` (`empresa_id`),
  CONSTRAINT `FK7ilcpbqq0bk0m0ffyton3f253` FOREIGN KEY (`empresa_id`) REFERENCES `tb_empresa` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `tb_cliente` WRITE;
/*!40000 ALTER TABLE `tb_cliente` DISABLE KEYS */;
INSERT INTO `tb_cliente` VALUES (1,'33.592.510/0001-54','Itaim Bibi','04533-000','SÃ£o Paulo','SP','1000','Av. das NaÃ§Ãµes Unidas',NULL,'Eduardo Martins','Vale S.A.',1),(2,'60.746.948/0001-12','Vila Yara','06029-900','Osasco','SP','S/N','Cidade de Deus',NULL,'Roberto Alves','Banco Bradesco',1),(3,'44.555.666/0001-77','Centro','20081-240','Rio de Janeiro','RJ','1','PraÃ§a MauÃ¡',NULL,'Amanda Silveira','Porto Rio LogÃ­stica',1);
/*!40000 ALTER TABLE `tb_cliente` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `tb_custo_adicional`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_custo_adicional` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `descricao` varchar(255) NOT NULL,
  `valor_adicional` decimal(15,2) NOT NULL,
  `projeto_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKibp19ngyw27s6lepu70v14i67` (`projeto_id`),
  CONSTRAINT `FKibp19ngyw27s6lepu70v14i67` FOREIGN KEY (`projeto_id`) REFERENCES `tb_projeto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `tb_custo_adicional` WRITE;
/*!40000 ALTER TABLE `tb_custo_adicional` DISABLE KEYS */;
INSERT INTO `tb_custo_adicional` VALUES (1,'Auditoria de Seguranca externa e homologacao de LGPD',15000.00,1),(2,'Contratacao de servidores temporarios de stress test e carga',25000.00,2),(3,'Calibracao de sensores e certificacao de conformidade de hardware',122080.00,3),(4,'Licenciamento empresarial de banco de dados e consultoria tecnica de escalabilidade',200660.00,4);
/*!40000 ALTER TABLE `tb_custo_adicional` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `tb_custo_api`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_custo_api` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome_ferramenta` varchar(255) NOT NULL,
  `valor_licenca` decimal(38,2) NOT NULL,
  `projeto_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK59dtdr4li3seqaaevjikbapm9` (`projeto_id`),
  CONSTRAINT `FK59dtdr4li3seqaaevjikbapm9` FOREIGN KEY (`projeto_id`) REFERENCES `tb_projeto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `tb_custo_api` WRITE;
/*!40000 ALTER TABLE `tb_custo_api` DISABLE KEYS */;
INSERT INTO `tb_custo_api` VALUES (1,'OpenAI GPT-4o API',1200.00,1),(2,'Anthropic Claude 3.5 API',1500.00,1),(3,'Google Gemini Pro API',800.00,1),(4,'Anthropic Claude 3.5 API',2000.00,2),(5,'OpenAI GPT-4 API',1800.00,2),(6,'Pinecone Vector DB',500.00,2),(7,'OpenAI Whisper API',800.00,3),(8,'OpenAI GPT-4o Mini',500.00,3),(9,'Anthropic Claude Haiku API',1000.00,4),(10,'OpenAI Embeddings API',400.00,4);
/*!40000 ALTER TABLE `tb_custo_api` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `tb_custo_cloud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_custo_cloud` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `mes_referencia` varbinary(255) NOT NULL,
  `provedor` varchar(255) NOT NULL,
  `valor_fatura` decimal(38,2) NOT NULL,
  `projeto_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_cloud_projeto_id` (`projeto_id`),
  CONSTRAINT `FKnwg8g6e6kl28dwulgeaw6wjo9` FOREIGN KEY (`projeto_id`) REFERENCES `tb_projeto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `tb_custo_cloud` WRITE;
/*!40000 ALTER TABLE `tb_custo_cloud` DISABLE KEYS */;
INSERT INTO `tb_custo_cloud` VALUES (1,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',300.00,1),(2,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',350.00,1),(3,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',450.00,1),(4,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',500.00,1),(5,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',550.00,1),(6,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',600.00,1),(7,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',500.00,2),(8,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',600.00,2),(9,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',700.00,2),(10,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',850.00,2),(11,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',900.00,2),(12,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',1000.00,2),(13,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',150.00,3),(14,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',200.00,3),(15,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',300.00,3),(16,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',350.00,3),(17,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',400.00,3),(18,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',450.00,3),(19,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',300.00,4),(20,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',400.00,4),(21,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',500.00,4),(22,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',600.00,4),(23,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',700.00,4),(24,_binary '�\�\0sr\0\rjava.time.Ser�]��\"H�\0\0xpw\0\0\�x','AWS',800.00,4);
/*!40000 ALTER TABLE `tb_custo_cloud` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `tb_desenvolvedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_desenvolvedor` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `senioridade` enum('GESTOR_TECH_LEAD','JUNIOR','PLENO','SENIOR') NOT NULL,
  `valor_hora_custo` decimal(10,2) NOT NULL,
  `valor_hora_extra` decimal(10,2) NOT NULL,
  `usuario_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKk3y93h6l2sq267rr2dx4sso15` (`usuario_id`),
  CONSTRAINT `FKgps0oyriissvoqa7r2n3lhpt0` FOREIGN KEY (`usuario_id`) REFERENCES `tb_usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `tb_desenvolvedor` WRITE;
/*!40000 ALTER TABLE `tb_desenvolvedor` DISABLE KEYS */;
INSERT INTO `tb_desenvolvedor` VALUES (1,'Carlos Mendes','PLENO',85.00,127.50,3),(2,'Ana Beatriz','SENIOR',120.00,180.00,4);
/*!40000 ALTER TABLE `tb_desenvolvedor` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `tb_empresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_empresa` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cnpj` varchar(255) NOT NULL,
  `data_registro` date NOT NULL,
  `nome_fantasia` varchar(255) NOT NULL,
  `plano` enum('FREE_BETA','SCALE','STARTER') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKgamqi2pvmfim8800oc5jw05up` (`cnpj`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `tb_empresa` WRITE;
/*!40000 ALTER TABLE `tb_empresa` DISABLE KEYS */;
INSERT INTO `tb_empresa` VALUES (1,'00.111.222/0001-33','2026-06-19','DevFlow Solutions','FREE_BETA');
/*!40000 ALTER TABLE `tb_empresa` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `tb_projeto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_projeto` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `budget_total` decimal(15,2) NOT NULL,
  `custo_atual_acumulado` decimal(15,2) DEFAULT NULL,
  `data_inicio` date NOT NULL,
  `data_previsao_entrega` date DEFAULT NULL,
  `descricao` text,
  `nome` varchar(255) NOT NULL,
  `prioridade` enum('ALTA','BAIXA','MEDIA') DEFAULT NULL,
  `risco_atual` enum('ALTO','BAIXO','CRITICO','MEDIO') DEFAULT NULL,
  `stack_tecnologica` varchar(255) DEFAULT NULL,
  `status` enum('ALERTA','CANCELADO','CONCLUIDO','EM_ANDAMENTO','ESTOURADO','PAUSADO','PLANEJADO','RASCUNHO') DEFAULT NULL,
  `cliente_id` bigint DEFAULT NULL,
  `empresa_id` bigint DEFAULT NULL,
  `gestor_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3bkvf7rgjrob5w5y30q04ex7w` (`cliente_id`),
  KEY `FKrl6md92t1sy0eyofwapuy7lp5` (`empresa_id`),
  KEY `FK9kpyxkatclqjleyl29ruybljy` (`gestor_id`),
  CONSTRAINT `FK3bkvf7rgjrob5w5y30q04ex7w` FOREIGN KEY (`cliente_id`) REFERENCES `tb_cliente` (`id`),
  CONSTRAINT `FK9kpyxkatclqjleyl29ruybljy` FOREIGN KEY (`gestor_id`) REFERENCES `tb_usuario` (`id`),
  CONSTRAINT `FKrl6md92t1sy0eyofwapuy7lp5` FOREIGN KEY (`empresa_id`) REFERENCES `tb_empresa` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `tb_projeto` WRITE;
/*!40000 ALTER TABLE `tb_projeto` DISABLE KEYS */;
INSERT INTO `tb_projeto` VALUES (1,195000.00,25480.00,'2026-01-15','2026-07-31','Modernizacao do portal de monitoramento','Portal Mineracao IoT','ALTA','MEDIO','Angular 21, Spring Boot 4','EM_ANDAMENTO',1,1,2),(2,250000.00,37192.50,'2026-02-01','2026-09-30','Desenvolvimento aplicativo mobile','App Internet Banking','ALTA','BAIXO','React Native, Node.js','EM_ANDAMENTO',2,1,2),(3,155000.00,127100.00,'2026-01-15','2026-07-31','Portal de monitoramento IoT sob risco de atencao','Portal Mineracao IoT - Alerta','ALTA','ALTO','Angular 21, Spring Boot 4','ALERTA',1,1,2),(4,208000.00,208000.00,'2026-02-01','2026-09-30','Aplicativo mobile estourado financeiramente','App Internet Banking - Estourado','ALTA','ALTO','React Native, Node.js','ESTOURADO',2,1,2);
/*!40000 ALTER TABLE `tb_projeto` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `tb_projeto_desenvolvedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_projeto_desenvolvedor` (
  `projeto_id` bigint NOT NULL,
  `desenvolvedor_id` bigint NOT NULL,
  KEY `FK8chy74jfu4cce8asamagsh152` (`desenvolvedor_id`),
  KEY `FKnddrl6prnpkxtno6e1x6fs0dy` (`projeto_id`),
  CONSTRAINT `FK8chy74jfu4cce8asamagsh152` FOREIGN KEY (`desenvolvedor_id`) REFERENCES `tb_desenvolvedor` (`id`),
  CONSTRAINT `FKnddrl6prnpkxtno6e1x6fs0dy` FOREIGN KEY (`projeto_id`) REFERENCES `tb_projeto` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `tb_projeto_desenvolvedor` WRITE;
/*!40000 ALTER TABLE `tb_projeto_desenvolvedor` DISABLE KEYS */;
INSERT INTO `tb_projeto_desenvolvedor` VALUES (1,1),(1,2),(2,1),(2,2),(3,1),(4,2);
/*!40000 ALTER TABLE `tb_projeto_desenvolvedor` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `tb_sprint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_sprint` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `data_fim` date NOT NULL,
  `data_inicio` date NOT NULL,
  `horas_estimadas` int DEFAULT NULL,
  `nome_fase` enum('BACKLOG','DESENVOLVIMENTO','ENCERRAMENTO','HOMOLOGACAO','PLANEJAMENTO','TESTES') DEFAULT NULL,
  `objetivo` text,
  `observacoes` text,
  `status` enum('ATIVA','CANCELADA','EM_ANDAMENTO','ENCERRADA','HOMOLOGACAO','PLANEJADA') DEFAULT NULL,
  `projeto_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjlkembsp4g390bgf9f7gynr5s` (`projeto_id`),
  CONSTRAINT `FKjlkembsp4g390bgf9f7gynr5s` FOREIGN KEY (`projeto_id`) REFERENCES `tb_projeto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `tb_sprint` WRITE;
/*!40000 ALTER TABLE `tb_sprint` DISABLE KEYS */;
INSERT INTO `tb_sprint` VALUES (1,'2026-02-15','2026-01-15',120,'PLANEJAMENTO','Levantar requisitos tecnicos',NULL,'ENCERRADA',1),(2,'2026-04-30','2026-02-16',300,'DESENVOLVIMENTO','Entregar os primeiros dashboards',NULL,'EM_ANDAMENTO',1),(3,'2026-03-01','2026-02-01',80,'PLANEJAMENTO','Design System',NULL,'ENCERRADA',2),(4,'2026-06-30','2026-03-02',400,'DESENVOLVIMENTO','Modulo PIX',NULL,'EM_ANDAMENTO',2),(5,'2026-02-15','2026-01-15',100,'PLANEJAMENTO','Sensores e Integracao',NULL,'ENCERRADA',3),(6,'2026-04-30','2026-02-16',250,'DESENVOLVIMENTO','Controllers IoT e Alertas',NULL,'EM_ANDAMENTO',3),(7,'2026-03-01','2026-02-01',90,'PLANEJAMENTO','Design mobile v2',NULL,'ENCERRADA',4),(8,'2026-06-30','2026-03-02',350,'DESENVOLVIMENTO','Integracao com Bancos',NULL,'EM_ANDAMENTO',4);
/*!40000 ALTER TABLE `tb_sprint` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `tb_timesheet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_timesheet` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `billable` bit(1) NOT NULL,
  `data_registro` date NOT NULL,
  `descricao_tarefa` varchar(255) DEFAULT NULL,
  `horas_extras` double DEFAULT NULL,
  `horas_trabalhadas` double NOT NULL,
  `status_aprovacao` enum('APROVADO','PENDENTE','REJEITADO') NOT NULL,
  `desenvolvedor_id` bigint NOT NULL,
  `sprint_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_timesheet_sprint_id` (`sprint_id`),
  KEY `idx_timesheet_desenvolvedor_id` (`desenvolvedor_id`),
  CONSTRAINT `FKj5w6fevqbtkad2l2j2ita7u73` FOREIGN KEY (`sprint_id`) REFERENCES `tb_sprint` (`id`),
  CONSTRAINT `FKkusswercdt84ycoijv2g5wjaw` FOREIGN KEY (`desenvolvedor_id`) REFERENCES `tb_desenvolvedor` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `tb_timesheet` WRITE;
/*!40000 ALTER TABLE `tb_timesheet` DISABLE KEYS */;
INSERT INTO `tb_timesheet` VALUES (1,_binary '','2026-01-20','Levantamento IoT',0,8,'APROVADO',1,1),(2,_binary '','2026-01-22','Reuniao minas',2,8,'APROVADO',1,1),(3,_binary '','2026-01-25','Revisao arquitetura',0,6,'APROVADO',2,1),(4,_binary '','2026-02-18','Controllers REST',2,8,'APROVADO',1,2),(5,_binary '','2026-02-20','Componentes Angular',0,8,'APROVADO',2,2),(6,_binary '','2026-02-05','Arquitetura mobile',0,8,'APROVADO',2,3),(7,_binary '','2026-03-10','Modulo PIX sandbox',3,8,'APROVADO',1,4),(8,_binary '','2026-03-20','Transferencias',2,8,'APROVADO',2,4),(9,_binary '','2026-01-20','Configuracao sensores',0,8,'APROVADO',1,5),(10,_binary '','2026-02-18','Regras de Alerta',4,8,'APROVADO',1,6),(11,_binary '','2026-02-05','Carga de Telas',0,8,'APROVADO',2,7),(12,_binary '','2026-03-20','Modulo Seguranca Bancaria',4,8,'APROVADO',2,8);
/*!40000 ALTER TABLE `tb_timesheet` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `tb_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_usuario` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ativo` bit(1) NOT NULL,
  `email` varchar(255) NOT NULL,
  `foto` longtext,
  `nome` varchar(255) NOT NULL,
  `role` enum('ADMIN','CLIENTE','DESENVOLVEDOR','GESTOR') NOT NULL,
  `senha` varchar(255) NOT NULL,
  `empresa_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKspmnyb4dsul95fjmr5kmdmvub` (`email`),
  KEY `FKe96d4ypi44t879mh2aprwm1a4` (`empresa_id`),
  CONSTRAINT `FKe96d4ypi44t879mh2aprwm1a4` FOREIGN KEY (`empresa_id`) REFERENCES `tb_empresa` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `tb_usuario` WRITE;
/*!40000 ALTER TABLE `tb_usuario` DISABLE KEYS */;
INSERT INTO `tb_usuario` VALUES (1,_binary '','admin_final@devflow.com',NULL,'Admin DevFlow','ADMIN','$2a$10$V.9O1mZ1/l.rD6MIe53QAe2AESoD1iwfKtGWsU97Km3sVSKCEad3C',1),(2,_binary '','gestor_final@devflow.com',NULL,'Ricardo Lima','GESTOR','$2a$10$6dQJHDWCAmd7ZSUddzZNl.KUIlTPdGqR8IwHSnEU.kUBlosskbnoW',1),(3,_binary '','dev1_final@devflow.com',NULL,'Carlos Mendes','DESENVOLVEDOR','$2a$10$OP/S8ICYXDQE0oINvb8r/OWagPuB79feIvCKXpbWgKhxk9d5Gzn76',1),(4,_binary '','dev2_final@devflow.com',NULL,'Ana Beatriz','DESENVOLVEDOR','$2a$10$deGP1mVmrzYH3OCN20V7Uu3DaOBRYeJb./MpwBOcpPeha/qoPjglK',1);
/*!40000 ALTER TABLE `tb_usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

