package com.devflow.service;

import com.devflow.dto.AnaliseFinanceiraDto;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.model.*;
import com.devflow.repository.*;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
public class RelatorioPdfService {

    private final AnaliseFinanceiraService analiseFinanceiraService;
    private final ProjetoRepository projetoRepository;
    private final SprintRepository sprintRepository;
    private final ChangeRequestRepository changeRequestRepository;
    private final TimesheetRepository timesheetRepository;
    private final CustoCloudRepository custoCloudRepository;
    private final CustoApiRepository custoApiRepository;
    private final CustoAdicionalRepository custoAdicionalRepository;

    public RelatorioPdfService(AnaliseFinanceiraService analiseFinanceiraService,
                               ProjetoRepository projetoRepository,
                               SprintRepository sprintRepository,
                               ChangeRequestRepository changeRequestRepository,
                               TimesheetRepository timesheetRepository,
                               CustoCloudRepository custoCloudRepository,
                               CustoApiRepository custoApiRepository,
                               CustoAdicionalRepository custoAdicionalRepository) {
        this.analiseFinanceiraService = analiseFinanceiraService;
        this.projetoRepository = projetoRepository;
        this.sprintRepository = sprintRepository;
        this.changeRequestRepository = changeRequestRepository;
        this.timesheetRepository = timesheetRepository;
        this.custoCloudRepository = custoCloudRepository;
        this.custoApiRepository = custoApiRepository;
        this.custoAdicionalRepository = custoAdicionalRepository;
    }

    private static class RelatorioPageEvent extends PdfPageEventHelper {
        private final Font fontHeader;
        private final Font fontFooter;
        private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        private final String dataGeracao;

        public RelatorioPageEvent() {
            this.fontHeader = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 7, new BaseColor(156, 163, 175)); // Gray-400
            this.fontFooter = FontFactory.getFont(FontFactory.HELVETICA, 7, new BaseColor(156, 163, 175));
            this.dataGeracao = LocalDateTime.now().format(formatter);
        }

        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfContentByte cb = writer.getDirectContent();
            
            // 1. Linha decorativa roxa superior
            cb.saveState();
            cb.setColorStroke(new BaseColor(79, 70, 229)); // Indigo
            cb.setLineWidth(3f);
            cb.moveTo(document.leftMargin(), document.getPageSize().getTop() - 25);
            cb.lineTo(document.getPageSize().getRight() - document.rightMargin(), document.getPageSize().getTop() - 25);
            cb.stroke();
            cb.restoreState();

            // 2. Cabeçalho (exibido a partir da página 2)
            if (writer.getPageNumber() > 1) {
                Phrase headerPhrase = new Phrase("DEVFLOW SOLUTIONS | PROJECT CLOSEOUT REPORT", fontHeader);
                ColumnText.showTextAligned(cb, Element.ALIGN_LEFT, headerPhrase,
                        document.leftMargin(), document.getPageSize().getTop() - 20, 0);
            }

            // 3. Rodapé em todas as páginas
            Phrase dataPhrase = new Phrase("Gerado em: " + dataGeracao + " | DevFlow Solutions", fontFooter);
            ColumnText.showTextAligned(cb, Element.ALIGN_LEFT, dataPhrase,
                    document.leftMargin(), document.bottom() - 20, 0);

            Phrase pagPhrase = new Phrase("Página " + writer.getPageNumber(), fontFooter);
            ColumnText.showTextAligned(cb, Element.ALIGN_RIGHT, pagPhrase,
                    document.getPageSize().getRight() - document.rightMargin(), document.bottom() - 20, 0);
        }
    }

    @Transactional(readOnly = true)
    public byte[] gerarProjectCloseoutPdf(Long projetoId) {
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + projetoId));

        AnaliseFinanceiraDto dre = analiseFinanceiraService.gerarDreProjeto(projetoId);
        List<Sprint> sprints = sprintRepository.findByProjetoId(projetoId);
        List<ChangeRequest> changeRequests = changeRequestRepository.findByProjetoId(projetoId);
        List<Timesheet> timesheets = timesheetRepository.findBySprintProjetoId(projetoId);
        List<CustoCloud> cloudCosts = custoCloudRepository.findByProjetoId(projetoId);
        List<CustoApi> apiCosts = custoApiRepository.findByProjetoId(projetoId);
        List<CustoAdicional> additionalCosts = custoAdicionalRepository.findByProjetoId(projetoId);

        Document document = new Document(PageSize.A4, 36, 36, 54, 45);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        NumberFormat formatoDinheiro = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));
        DateTimeFormatter formatterData = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        try {
            PdfWriter writer = PdfWriter.getInstance(document, out);
            writer.setPageEvent(new RelatorioPageEvent());
            document.open();

            // Fontes corporativas premium
            Font fontEmpresa = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.GRAY);
            Font fontTitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, new BaseColor(79, 70, 229));
            Font fontSubTitulo = FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.LIGHT_GRAY);
            Font fontSecao = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, new BaseColor(55, 48, 163));
            Font fontHeaderTabela = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, BaseColor.WHITE);
            Font fontCorpoTabela = FontFactory.getFont(FontFactory.HELVETICA, 9, BaseColor.BLACK);
            Font fontNormal = FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.DARK_GRAY);
            Font fontLucro = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, new BaseColor(16, 185, 129));
            Font fontPrejuizo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, new BaseColor(239, 68, 68));

            Font fontKpiTitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 7, new BaseColor(107, 114, 128));
            Font fontKpiValor = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new BaseColor(17, 24, 39));
            Font fontKpiStatus = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 7, BaseColor.GRAY);

            // Marca d'água/Nome no cabeçalho
            Paragraph pEmpresa = new Paragraph("DEVFLOW SOLUTIONS", fontEmpresa);
            pEmpresa.setAlignment(Element.ALIGN_RIGHT);
            document.add(pEmpresa);

            // Título Principal
            Paragraph titulo = new Paragraph("PROJECT CLOSEOUT REPORT", fontTitulo);
            titulo.setSpacingBefore(10f);
            titulo.setSpacingAfter(4f);
            document.add(titulo);

            String dataGeracao = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
            Paragraph pData = new Paragraph("Relatório Executivo Consolidado - Gerado em: " + dataGeracao, fontSubTitulo);
            pData.setSpacingAfter(25f);
            document.add(pData);

            // ==========================================
            // SEÇÃO 1: INFORMAÇÕES GERAIS E METADADOS
            // ==========================================
            document.add(new Paragraph("1. Visão Geral do Empreendimento", fontSecao));
            
            PdfPTable tableMeta = new PdfPTable(2);
            tableMeta.setWidthPercentage(100);
            tableMeta.setSpacingBefore(8f);
            tableMeta.setSpacingAfter(15f);
            tableMeta.setWidths(new float[]{30f, 70f});

            adicionarCelulaMeta(tableMeta, "Nome do Projeto", projeto.getNome(), fontCorpoTabela);
            adicionarCelulaMeta(tableMeta, "Cliente Parceiro", projeto.getCliente() != null ? projeto.getCliente().getRazaoSocial() : "Sem Cliente Vinculado", fontCorpoTabela);
            adicionarCelulaMeta(tableMeta, "Gestor Responsável", projeto.getGestorResponsavel() != null ? projeto.getGestorResponsavel().getNome() : "Sem Gestor Cadastrado", fontCorpoTabela);
            adicionarCelulaMeta(tableMeta, "Stack Tecnológica", projeto.getStackTecnologica() != null ? projeto.getStackTecnologica() : "—", fontCorpoTabela);
            
            String period = (projeto.getDataInicio() != null ? projeto.getDataInicio().format(formatterData) : "—") + " até " + 
                            (projeto.getDataPrevisaoEntrega() != null ? projeto.getDataPrevisaoEntrega().format(formatterData) : "—");
            adicionarCelulaMeta(tableMeta, "Período Estimado", period, fontCorpoTabela);
            
            adicionarCelulaMeta(tableMeta, "Status do Projeto", projeto.getStatus() != null ? projeto.getStatus().name() : "RASCUNHO", fontCorpoTabela);
            adicionarCelulaMeta(tableMeta, "Grau de Risco", projeto.getRiscoAtual() != null ? projeto.getRiscoAtual().name() : "NÃO AVALIADO", fontCorpoTabela);
            adicionarCelulaMeta(tableMeta, "Prioridade Executiva", projeto.getPrioridade() != null ? projeto.getPrioridade().name() : "MÉDIA", fontCorpoTabela);

            document.add(tableMeta);

            // Business Case Callout Block
            if (projeto.getDescricao() != null && !projeto.getDescricao().trim().isEmpty()) {
                PdfPTable tableDesc = new PdfPTable(1);
                tableDesc.setWidthPercentage(100);
                tableDesc.setSpacingAfter(20f);
                
                PdfPCell cellDesc = new PdfPCell();
                cellDesc.setBackgroundColor(new BaseColor(249, 250, 251)); // #F9FAFB
                cellDesc.setBorder(Rectangle.LEFT);
                cellDesc.setBorderWidthLeft(3f);
                cellDesc.setBorderColorLeft(new BaseColor(79, 70, 229)); // Indigo
                cellDesc.setPadding(10f);
                
                Paragraph pTitle = new Paragraph("BUSINESS CASE / DESCRIÇÃO DO PROJETO", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 7, new BaseColor(107, 114, 128)));
                pTitle.setSpacingAfter(4f);
                cellDesc.addElement(pTitle);
                
                Paragraph pContent = new Paragraph(projeto.getDescricao(), FontFactory.getFont(FontFactory.HELVETICA, 9, BaseColor.DARK_GRAY));
                cellDesc.addElement(pContent);
                
                tableDesc.addCell(cellDesc);
                document.add(tableDesc);
            }

            // ==========================================
            // SEÇÃO 2: PERFORMANCE FINANCEIRA CONSOLIDADA
            // ==========================================
            document.add(new Paragraph("2. Balanço Financeiro e Rentabilidade", fontSecao));

            // Grid de Cards Financeiros (Tabela com fundo especial e bordas)
            PdfPTable tableFinGrid = new PdfPTable(4);
            tableFinGrid.setWidthPercentage(100);
            tableFinGrid.setSpacingBefore(8f);
            tableFinGrid.setSpacingAfter(15f);
            tableFinGrid.setWidths(new float[]{25f, 25f, 25f, 25f});

            BigDecimal totalBudget = dre.getBudgetTotal() != null ? dre.getBudgetTotal() : BigDecimal.ZERO;
            BigDecimal totalCusto = dre.getCustoAtual() != null ? dre.getCustoAtual() : BigDecimal.ZERO;
            double burnRate = dre.getBurnRatePercentual() != null ? dre.getBurnRatePercentual() : 0.0;
            BigDecimal saldoRestante = totalBudget.subtract(totalCusto);

            // Card 1: Orçamento Aprovado
            adicionarCardKpi(tableFinGrid, "Orçamento Aprovado", formatoDinheiro.format(totalBudget), "Budget Total", BaseColor.GRAY, fontKpiTitulo, fontKpiValor, fontKpiStatus);
            
            // Card 2: Custo Consumido
            adicionarCardKpi(tableFinGrid, "Custo Acumulado", formatoDinheiro.format(totalCusto), "Realizado", BaseColor.GRAY, fontKpiTitulo, fontKpiValor, fontKpiStatus);
            
            // Card 3: Burn Rate (%)
            String burnStatus = burnRate >= 100 ? "Estouro de Budget" : (burnRate >= 80 ? "Risco de Alerta" : "Dentro do Limite");
            BaseColor burnColor = burnRate >= 100 ? new BaseColor(239, 68, 68) : (burnRate >= 80 ? new BaseColor(245, 158, 11) : new BaseColor(16, 185, 129));
            adicionarCardKpi(tableFinGrid, "Burn Rate", String.format(Locale.US, "%.1f%%", burnRate), burnStatus, burnColor, fontKpiTitulo, fontKpiValor, fontKpiStatus);
            
            // Card 4: Saldo Disponível
            String saldoStatus = saldoRestante.compareTo(BigDecimal.ZERO) >= 0 ? "Saldo Disponível" : "Saldo Negativo";
            BaseColor saldoColor = saldoRestante.compareTo(BigDecimal.ZERO) >= 0 ? new BaseColor(16, 185, 129) : new BaseColor(239, 68, 68);
            adicionarCardKpi(tableFinGrid, "Saldo Restante", formatoDinheiro.format(saldoRestante), saldoStatus, saldoColor, fontKpiTitulo, fontKpiValor, fontKpiStatus);

            document.add(tableFinGrid);

            // Veredito Financeiro
            Paragraph pVeredito = new Paragraph("Veredito Financeiro Consolidado: ", fontNormal);
            BigDecimal margem = dre.getMargemLucroBruta() != null ? dre.getMargemLucroBruta() : BigDecimal.ZERO;
            Double margemPct = dre.getMargemLucroPercentual() != null ? dre.getMargemLucroPercentual() : 0.0;
            if (margem.compareTo(BigDecimal.ZERO) >= 0) {
                pVeredito.add(new Chunk("PROJETO LUCRATIVO (" + formatoDinheiro.format(margem) + " / " + String.format(Locale.US, "%.1f%%", margemPct) + " de Margem)", fontLucro));
            } else {
                pVeredito.add(new Chunk("PROJETO EM PREJUÍZO (" + formatoDinheiro.format(margem) + " / " + String.format(Locale.US, "%.1f%%", margemPct) + " de Margem)", fontPrejuizo));
            }
            pVeredito.setSpacingAfter(20f);
            document.add(pVeredito);

            // ==========================================
            // SEÇÃO 3: ESFORÇO E ALOCAÇÃO DE EQUIPE
            // ==========================================
            document.add(new Paragraph("3. Alocação e Apropriação de Esforço da Equipe", fontSecao));

            PdfPTable tableEquipe = new PdfPTable(5);
            tableEquipe.setWidthPercentage(100);
            tableEquipe.setSpacingBefore(8f);
            tableEquipe.setSpacingAfter(15f);
            tableEquipe.setWidths(new float[]{30f, 15f, 15f, 15f, 25f});

            adicionarHeaderCelula(tableEquipe, "Colaborador", fontHeaderTabela);
            adicionarHeaderCelula(tableEquipe, "Senioridade", fontHeaderTabela);
            adicionarHeaderCelula(tableEquipe, "Horas Reg.", fontHeaderTabela);
            adicionarHeaderCelula(tableEquipe, "Horas Extras", fontHeaderTabela);
            adicionarHeaderCelula(tableEquipe, "Custo Operacional", fontHeaderTabela);

            List<Desenvolvedor> desenvolvedores = projeto.getDesenvolvedores();
            if (desenvolvedores == null || desenvolvedores.isEmpty()) {
                PdfPCell empty = new PdfPCell(new Phrase("Nenhum desenvolvedor alocado neste projeto.", fontCorpoTabela));
                empty.setColspan(5);
                empty.setPadding(8);
                empty.setHorizontalAlignment(Element.ALIGN_CENTER);
                tableEquipe.addCell(empty);
            } else {
                for (Desenvolvedor d : desenvolvedores) {
                    List<Timesheet> dTimesheets = timesheets.stream().filter(t -> t.getDesenvolvedor() != null && t.getDesenvolvedor().getId().equals(d.getId())).toList();
                    double hReg = dTimesheets.stream().mapToDouble(t -> t.getHorasTrabalhadas() != null ? t.getHorasTrabalhadas() : 0).sum();
                    double hExt = dTimesheets.stream().mapToDouble(t -> t.getHorasExtras() != null ? t.getHorasExtras() : 0).sum();
                    
                    BigDecimal custoGerado = BigDecimal.valueOf(hReg).multiply(d.getValorHoraCusto())
                            .add(BigDecimal.valueOf(hExt).multiply(d.getValorHoraExtra()));

                    adicionarCelulaCorpo(tableEquipe, d.getNome(), fontCorpoTabela);
                    adicionarCelulaCorpo(tableEquipe, d.getSenioridade() != null ? d.getSenioridade().name() : "—", fontCorpoTabela);
                    adicionarCelulaCorpo(tableEquipe, hReg + "h", fontCorpoTabela);
                    adicionarCelulaCorpo(tableEquipe, hExt + "h", fontCorpoTabela);
                    adicionarCelulaCorpo(tableEquipe, formatoDinheiro.format(custoGerado), fontCorpoTabela);
                }
            }
            document.add(tableEquipe);

            // Análise de Horas Billable vs Non-Billable
            if (dre.getTotalHorasBillable() != null || dre.getTotalHorasNonBillable() != null) {
                double totalBillable = dre.getTotalHorasBillable() != null ? dre.getTotalHorasBillable() : 0.0;
                double totalNonBillable = dre.getTotalHorasNonBillable() != null ? dre.getTotalHorasNonBillable() : 0.0;
                BigDecimal custoNonBillable = dre.getCustoNonBillable() != null ? dre.getCustoNonBillable() : BigDecimal.ZERO;
                double somaHoras = totalBillable + totalNonBillable;
                double pctBillable = somaHoras > 0 ? (totalBillable / somaHoras) * 100 : 0.0;

                PdfPTable tableHours = new PdfPTable(4);
                tableHours.setWidthPercentage(100);
                tableHours.setSpacingAfter(20f);
                tableHours.setWidths(new float[]{25f, 25f, 25f, 25f});

                adicionarHeaderCelula(tableHours, "Horas Faturáveis (Billable)", fontHeaderTabela);
                adicionarHeaderCelula(tableHours, "Horas Não-Faturáveis", fontHeaderTabela);
                adicionarHeaderCelula(tableHours, "Percentual Faturável", fontHeaderTabela);
                adicionarHeaderCelula(tableHours, "Custo Não-Faturável (Retrabalho)", fontHeaderTabela);

                adicionarCelulaCorpo(tableHours, totalBillable + "h", fontCorpoTabela);
                adicionarCelulaCorpo(tableHours, totalNonBillable + "h", fontCorpoTabela);
                adicionarCelulaCorpo(tableHours, String.format(Locale.US, "%.1f%%", pctBillable), fontCorpoTabela);
                adicionarCelulaCorpo(tableHours, formatoDinheiro.format(custoNonBillable), fontCorpoTabela);

                document.add(tableHours);
            }

            // ==========================================
            // SEÇÃO 4: CRONOGRAMA DE SPRINTS
            // ==========================================
            document.add(new Paragraph("4. Linha do Tempo e Execução de Sprints", fontSecao));

            PdfPTable tableSprints = new PdfPTable(5);
            tableSprints.setWidthPercentage(100);
            tableSprints.setSpacingBefore(8f);
            tableSprints.setSpacingAfter(20f);
            tableSprints.setWidths(new float[]{25f, 20f, 15f, 15f, 25f});

            adicionarHeaderCelula(tableSprints, "Sprint / Fase", fontHeaderTabela);
            adicionarHeaderCelula(tableSprints, "Início", fontHeaderTabela);
            adicionarHeaderCelula(tableSprints, "Entrega", fontHeaderTabela);
            adicionarHeaderCelula(tableSprints, "Estimado", fontHeaderTabela);
            adicionarHeaderCelula(tableSprints, "Status", fontHeaderTabela);

            if (sprints == null || sprints.isEmpty()) {
                PdfPCell empty = new PdfPCell(new Phrase("Nenhuma sprint cadastrada para este projeto.", fontCorpoTabela));
                empty.setColspan(5);
                empty.setPadding(8);
                empty.setHorizontalAlignment(Element.ALIGN_CENTER);
                tableSprints.addCell(empty);
            } else {
                for (Sprint s : sprints) {
                    adicionarCelulaCorpo(tableSprints, s.getNomeFase() != null ? s.getNomeFase().name() : "—", fontCorpoTabela);
                    adicionarCelulaCorpo(tableSprints, s.getDataInicio() != null ? s.getDataInicio().format(formatterData) : "—", fontCorpoTabela);
                    adicionarCelulaCorpo(tableSprints, s.getDataFim() != null ? s.getDataFim().format(formatterData) : "—", fontCorpoTabela);
                    adicionarCelulaCorpo(tableSprints, (s.getHorasEstimadas() != null ? s.getHorasEstimadas() : 0) + "h", fontCorpoTabela);
                    adicionarCelulaCorpo(tableSprints, s.getStatus() != null ? s.getStatus().name() : "—", fontCorpoTabela);
                    
                    // Exibir objetivos e observações de forma elegante abaixo da sprint se houver
                    if ((s.getObjetivo() != null && !s.getObjetivo().trim().isEmpty()) || 
                        (s.getObservacoes() != null && !s.getObservacoes().trim().isEmpty())) {
                        
                        StringBuilder sb = new StringBuilder();
                        if (s.getObjetivo() != null && !s.getObjetivo().trim().isEmpty()) {
                            sb.append("Objetivo: ").append(s.getObjetivo());
                        }
                        if (s.getObservacoes() != null && !s.getObservacoes().trim().isEmpty()) {
                            if (sb.length() > 0) sb.append(" | ");
                            sb.append("Observações: ").append(s.getObservacoes());
                        }
                        
                        PdfPCell detailCell = new PdfPCell(new Phrase(sb.toString(), FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8, BaseColor.GRAY)));
                        detailCell.setColspan(5);
                        detailCell.setPaddingLeft(12f);
                        detailCell.setPaddingRight(6f);
                        detailCell.setPaddingTop(4f);
                        detailCell.setPaddingBottom(4f);
                        detailCell.setBackgroundColor(new BaseColor(250, 250, 251));
                        detailCell.setBorderColor(new BaseColor(0, 0, 0, 15));
                        tableSprints.addCell(detailCell);
                    }
                }
            }
            document.add(tableSprints);

            // ==========================================
            // SEÇÃO 5: HISTÓRICO DETALHADO DE TIMESHEETS
            // ==========================================
            document.add(new Paragraph("5. Histórico Detalhado de Lançamentos de Horas (Timesheets)", fontSecao));

            PdfPTable tableTs = new PdfPTable(6);
            tableTs.setWidthPercentage(100);
            tableTs.setSpacingBefore(8f);
            tableTs.setSpacingAfter(20f);
            tableTs.setWidths(new float[]{12f, 20f, 38f, 10f, 10f, 10f});
            tableTs.setHeaderRows(1);

            adicionarHeaderCelula(tableTs, "Data", fontHeaderTabela);
            adicionarHeaderCelula(tableTs, "Colaborador", fontHeaderTabela);
            adicionarHeaderCelula(tableTs, "Atividade / Descrição da Tarefa", fontHeaderTabela);
            adicionarHeaderCelula(tableTs, "H. Reg.", fontHeaderTabela);
            adicionarHeaderCelula(tableTs, "H. Ext.", fontHeaderTabela);
            adicionarHeaderCelula(tableTs, "Faturável", fontHeaderTabela);

            if (timesheets == null || timesheets.isEmpty()) {
                PdfPCell empty = new PdfPCell(new Phrase("Nenhum lançamento de horas registrado para este projeto.", fontCorpoTabela));
                empty.setColspan(6);
                empty.setPadding(8);
                empty.setHorizontalAlignment(Element.ALIGN_CENTER);
                tableTs.addCell(empty);
            } else {
                List<Timesheet> sortedTs = timesheets.stream()
                        .sorted((t1, t2) -> t1.getDataRegistro().compareTo(t2.getDataRegistro()))
                        .toList();

                for (Timesheet t : sortedTs) {
                    String dataStr = t.getDataRegistro() != null ? t.getDataRegistro().format(formatterData) : "—";
                    String devNome = t.getDesenvolvedor() != null ? t.getDesenvolvedor().getNome() : "—";
                    String descStr = t.getDescricaoTarefa() != null ? t.getDescricaoTarefa() : "—";
                    String hRegStr = (t.getHorasTrabalhadas() != null ? t.getHorasTrabalhadas() : 0.0) + "h";
                    String hExtStr = (t.getHorasExtras() != null ? t.getHorasExtras() : 0.0) + "h";
                    String billStr = t.getBillable() != null && t.getBillable() ? "Sim" : "Não";

                    adicionarCelulaCorpo(tableTs, dataStr, fontCorpoTabela);
                    adicionarCelulaCorpo(tableTs, devNome, fontCorpoTabela);
                    adicionarCelulaCorpo(tableTs, descStr, fontCorpoTabela);
                    adicionarCelulaCorpo(tableTs, hRegStr, fontCorpoTabela);
                    adicionarCelulaCorpo(tableTs, hExtStr, fontCorpoTabela);
                    adicionarCelulaCorpo(tableTs, billStr, fontCorpoTabela);
                }
            }
            document.add(tableTs);

            // ==========================================
            // SEÇÃO 6: CHANGE REQUESTS (ADITIVOS)
            // ==========================================
            document.add(new Paragraph("6. Histórico de Mudanças e Aditivos de Escopo (Change Requests)", fontSecao));

            PdfPTable tableCrs = new PdfPTable(4);
            tableCrs.setWidthPercentage(100);
            tableCrs.setSpacingBefore(8f);
            tableCrs.setSpacingAfter(20f);
            tableCrs.setWidths(new float[]{40f, 20f, 20f, 20f});

            adicionarHeaderCelula(tableCrs, "Descrição da Mudança", fontHeaderTabela);
            adicionarHeaderCelula(tableCrs, "Solicitante", fontHeaderTabela);
            adicionarHeaderCelula(tableCrs, "Valor Adicional", fontHeaderTabela);
            adicionarHeaderCelula(tableCrs, "Status", fontHeaderTabela);

            if (changeRequests == null || changeRequests.isEmpty()) {
                PdfPCell empty = new PdfPCell(new Phrase("Nenhuma alteração de escopo registrada.", fontCorpoTabela));
                empty.setColspan(4);
                empty.setPadding(8);
                empty.setHorizontalAlignment(Element.ALIGN_CENTER);
                tableCrs.addCell(empty);
            } else {
                for (ChangeRequest cr : changeRequests) {
                    adicionarCelulaCorpo(tableCrs, cr.getDescricaoMudanca(), fontCorpoTabela);
                    adicionarCelulaCorpo(tableCrs, cr.getSolicitante() != null ? cr.getSolicitante() : "—", fontCorpoTabela);
                    adicionarCelulaCorpo(tableCrs, formatoDinheiro.format(cr.getValorAdicional() != null ? cr.getValorAdicional() : BigDecimal.ZERO), fontCorpoTabela);
                    adicionarCelulaCorpo(tableCrs, cr.getStatus() != null ? cr.getStatus().name() : "—", fontCorpoTabela);
                }
            }
            document.add(tableCrs);

            // ==========================================
            // SEÇÃO 7: DETALHAMENTO DE CUSTOS NÃO-OPERACIONAIS
            // ==========================================
            document.add(new Paragraph("7. Gastos Não-Operacionais Detalhados", fontSecao));

            PdfPTable tableCustos = new PdfPTable(3);
            tableCustos.setWidthPercentage(100);
            tableCustos.setSpacingBefore(8f);
            tableCustos.setSpacingAfter(25f);
            tableCustos.setWidths(new float[]{45f, 30f, 25f});

            adicionarHeaderCelula(tableCustos, "Item / Origem do Gasto", fontHeaderTabela);
            adicionarHeaderCelula(tableCustos, "Categoria", fontHeaderTabela);
            adicionarHeaderCelula(tableCustos, "Valor Lançado", fontHeaderTabela);

            boolean temGastos = false;
            DateTimeFormatter formatterMes = DateTimeFormatter.ofPattern("MM/yyyy");

            // Mapeando Custos Cloud
            if (cloudCosts != null && !cloudCosts.isEmpty()) {
                temGastos = true;
                for (CustoCloud c : cloudCosts) {
                    String mesStr = c.getMesReferencia() != null ? c.getMesReferencia().format(formatterMes) : "—";
                    adicionarCelulaCorpo(tableCustos, "Infraestrutura Nuvem (" + c.getProvedor() + ") - Ref: " + mesStr, fontCorpoTabela);
                    adicionarCelulaCorpo(tableCustos, "Cloud / Hospedagem", fontCorpoTabela);
                    adicionarCelulaCorpo(tableCustos, formatoDinheiro.format(c.getValorFatura()), fontCorpoTabela);
                }
            }

            // Mapeando APIs
            if (apiCosts != null && !apiCosts.isEmpty()) {
                temGastos = true;
                for (CustoApi a : apiCosts) {
                    adicionarCelulaCorpo(tableCustos, "Licenciamento de API (" + a.getNomeFerramenta() + ")", fontCorpoTabela);
                    adicionarCelulaCorpo(tableCustos, "APIs & Ferramentas IA", fontCorpoTabela);
                    adicionarCelulaCorpo(tableCustos, formatoDinheiro.format(a.getValorLicenca()), fontCorpoTabela);
                }
            }

            // Mapeando Custos Adicionais
            if (additionalCosts != null && !additionalCosts.isEmpty()) {
                temGastos = true;
                for (CustoAdicional ad : additionalCosts) {
                    adicionarCelulaCorpo(tableCustos, ad.getDescricao(), fontCorpoTabela);
                    adicionarCelulaCorpo(tableCustos, "Custo Adicional Extra", fontCorpoTabela);
                    adicionarCelulaCorpo(tableCustos, formatoDinheiro.format(ad.getValorAdicional()), fontCorpoTabela);
                }
            }

            if (!temGastos) {
                PdfPCell empty = new PdfPCell(new Phrase("Nenhum custo não-operacional registrado para este projeto.", fontCorpoTabela));
                empty.setColspan(3);
                empty.setPadding(8);
                empty.setHorizontalAlignment(Element.ALIGN_CENTER);
                tableCustos.addCell(empty);
            }

            document.add(tableCustos);

            // ==========================================
            // SEÇÃO 8: TERMO DE ENCERRAMENTO E SIGN-OFF
            // ==========================================
            document.add(new Paragraph("8. Termo de Encerramento e Aceite Técnico (Sign-Off)", fontSecao));
            
            Paragraph pTermo = new Paragraph(
                "Por meio deste instrumento, as partes declaram que o projeto foi executado e concluído " +
                "conforme o escopo acordado e aditivos celebrados. O cliente atesta o recebimento dos entregáveis " +
                "e dá plena quitação das obrigações técnicas e financeiras descritas neste relatório executivo.",
                FontFactory.getFont(FontFactory.HELVETICA, 8, BaseColor.DARK_GRAY)
            );
            pTermo.setSpacingBefore(6f);
            pTermo.setSpacingAfter(25f);
            pTermo.setLeading(12f);
            document.add(pTermo);

            // Tabela de assinaturas
            PdfPTable tableSign = new PdfPTable(2);
            tableSign.setWidthPercentage(100);
            tableSign.setWidths(new float[]{50f, 50f});
            
            PdfPCell cellSignDev = new PdfPCell();
            cellSignDev.setBorder(Rectangle.NO_BORDER);
            cellSignDev.setPadding(10f);
            Paragraph lineDev = new Paragraph("_________________________________________", fontCorpoTabela);
            lineDev.setAlignment(Element.ALIGN_CENTER);
            cellSignDev.addElement(lineDev);
            String gestorNome = projeto.getGestorResponsavel() != null ? projeto.getGestorResponsavel().getNome() : "Gestor Responsável";
            Paragraph textDev = new Paragraph(gestorNome + "\nRepresentante - DevFlow Solutions", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, BaseColor.DARK_GRAY));
            textDev.setAlignment(Element.ALIGN_CENTER);
            cellSignDev.addElement(textDev);

            PdfPCell cellSignCli = new PdfPCell();
            cellSignCli.setBorder(Rectangle.NO_BORDER);
            cellSignCli.setPadding(10f);
            Paragraph lineCli = new Paragraph("_________________________________________", fontCorpoTabela);
            lineCli.setAlignment(Element.ALIGN_CENTER);
            cellSignCli.addElement(lineCli);
            String clienteNome = projeto.getCliente() != null ? projeto.getCliente().getRazaoSocial() : "Representante Legal";
            Paragraph textCli = new Paragraph(clienteNome + "\nRepresentante do Cliente", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, BaseColor.DARK_GRAY));
            textCli.setAlignment(Element.ALIGN_CENTER);
            cellSignCli.addElement(textCli);

            tableSign.addCell(cellSignDev);
            tableSign.addCell(cellSignCli);
            document.add(tableSign);

            document.close();

        } catch (DocumentException ex) {
            throw new RuntimeException("Erro ao gerar PDF enriquecido de Closeout: " + ex.getMessage());
        }

        return out.toByteArray();
    }

    private void adicionarHeaderCelula(PdfPTable table, String texto, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(texto, font));
        cell.setBackgroundColor(new BaseColor(79, 70, 229)); // Cor Roxo Índigo
        cell.setPadding(6);
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        cell.setBorderColor(new BaseColor(255, 255, 255, 30));
        table.addCell(cell);
    }

    private void adicionarCelulaCorpo(PdfPTable table, String texto, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(texto, font));
        cell.setPadding(6);
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        cell.setBorderColor(new BaseColor(0, 0, 0, 15));
        table.addCell(cell);
    }

    private void adicionarCelulaMeta(PdfPTable table, String campo, String valor, Font font) {
        PdfPCell cellCampo = new PdfPCell(new Phrase(campo, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, BaseColor.DARK_GRAY)));
        cellCampo.setBackgroundColor(new BaseColor(245, 245, 245));
        cellCampo.setPadding(6);
        cellCampo.setBorderColor(new BaseColor(0, 0, 0, 15));

        PdfPCell cellValor = new PdfPCell(new Phrase(valor, font));
        cellValor.setPadding(6);
        cellValor.setBorderColor(new BaseColor(0, 0, 0, 15));

        table.addCell(cellCampo);
        table.addCell(cellValor);
    }

    private void adicionarCardKpi(PdfPTable table, String titulo, String valor, String statusText, BaseColor colorText, Font fontTitulo, Font fontValor, Font fontStatus) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(new BaseColor(249, 250, 251)); // #F9FAFB
        cell.setPadding(10f);
        cell.setBorderColor(new BaseColor(229, 231, 235)); // #E5E7EB
        cell.setBorderWidth(1f);
        
        Paragraph pTitulo = new Paragraph(titulo.toUpperCase(), fontTitulo);
        pTitulo.setSpacingAfter(4f);
        cell.addElement(pTitulo);
        
        Paragraph pValor = new Paragraph(valor, fontValor);
        pValor.setSpacingAfter(4f);
        cell.addElement(pValor);
        
        if (statusText != null && !statusText.isEmpty()) {
            Font fontS = new Font(fontStatus);
            fontS.setColor(colorText);
            Paragraph pStatus = new Paragraph(statusText, fontS);
            cell.addElement(pStatus);
        } else {
            cell.addElement(new Paragraph(" ", fontStatus));
        }
        
        table.addCell(cell);
    }
}
