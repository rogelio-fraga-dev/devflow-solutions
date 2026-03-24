package com.devflow.service;

import com.devflow.dto.AnaliseFinanceiraDto;
import com.devflow.exception.ResourceNotFoundException;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class RelatorioPdfService {

    private final AnaliseFinanceiraService analiseFinanceiraService;

    public RelatorioPdfService(AnaliseFinanceiraService analiseFinanceiraService) {
        this.analiseFinanceiraService = analiseFinanceiraService;
    }

    public byte[] gerarProjectCloseoutPdf(Long projetoId) {
        // Aproveitando o Cérebro Inteligente criado na Parte 3
        AnaliseFinanceiraDto dre = analiseFinanceiraService.gerarDreProjeto(projetoId);

        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font fontTitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, BaseColor.DARK_GRAY);
            Font fontSubTitulo = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.GRAY);
            Font fontNormal = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.BLACK);
            Font fontLucro = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new BaseColor(0, 150, 0));
            Font fontPrejuizo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, BaseColor.RED);

            // Cabeçalho
            Paragraph titulo = new Paragraph("DevFlow Solutions - Project Closeout", fontTitulo);
            titulo.setAlignment(Element.ALIGN_CENTER);
            document.add(titulo);

            String dataGeracao = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
            Paragraph pData = new Paragraph("Gerado em: " + dataGeracao, fontSubTitulo);
            pData.setAlignment(Element.ALIGN_CENTER);
            pData.setSpacingAfter(30);
            document.add(pData);

            // Resumo Executivo
            document.add(new Paragraph("Projeto: " + dre.getNomeProjeto(), fontNormal));
            document.add(new Paragraph("Status Atual: " + dre.getStatusAtual(), fontNormal));
            document.add(new Paragraph(" ", fontNormal));

            // Tabela Financeira
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(20f);

            NumberFormat formatoDinheiro = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));

            adicionarCelula(table, "Orçamento Inicial (Budget)", formatoDinheiro.format(dre.getBudgetTotal()));
            adicionarCelula(table, "Custo Total (Consolidado)", formatoDinheiro.format(dre.getCustoAtual()));
            adicionarCelula(table, "Burn Rate", dre.getBurnRatePercentual() + "%");
            adicionarCelula(table, "Margem Percentual", dre.getMargemLucroPercentual() + "%");

            document.add(table);

            // Resultado Final Analítico
            document.add(new Paragraph("Veredito Financeiro:", fontTitulo));
            
            if (dre.getMargemLucroBruta().compareTo(BigDecimal.ZERO) >= 0) {
                Paragraph lucro = new Paragraph("PROJETO LUCRATIVO (+ " + formatoDinheiro.format(dre.getMargemLucroBruta()) + ")", fontLucro);
                lucro.setSpacingBefore(10);
                document.add(lucro);
            } else {
                Paragraph prejuizo = new Paragraph("PROJETO EM PREJUÍZO (" + formatoDinheiro.format(dre.getMargemLucroBruta()) + ")", fontPrejuizo);
                prejuizo.setSpacingBefore(10);
                document.add(prejuizo);
            }

            document.close();

        } catch (DocumentException ex) {
            throw new RuntimeException("Erro ao gerar PDF de Closeout: " + ex.getMessage());
        }

        return out.toByteArray();
    }

    private void adicionarCelula(PdfPTable table, String titulo, String valor) {
        PdfPCell cellCabecalho = new PdfPCell(new Phrase(titulo));
        cellCabecalho.setBackgroundColor(BaseColor.LIGHT_GRAY);
        cellCabecalho.setPadding(8);
        
        PdfPCell cellValor = new PdfPCell(new Phrase(valor));
        cellValor.setPadding(8);

        table.addCell(cellCabecalho);
        table.addCell(cellValor);
    }
}
