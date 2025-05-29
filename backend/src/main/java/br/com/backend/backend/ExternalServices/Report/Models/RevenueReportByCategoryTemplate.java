package br.com.backend.backend.ExternalServices.Report.Models;

import br.com.backend.backend.ExternalServices.Report.Interfaces.ReportTemplate;
import br.com.backend.backend.ExternalServices.Report.Interfaces.RevenueReportByCategoryProjection;
import br.com.backend.backend.ExternalServices.Report.Interfaces.RevenueReportProjection;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class RevenueReportByCategoryTemplate implements ReportTemplate {
    private final List<RevenueReportByCategoryProjection> data;

    public RevenueReportByCategoryTemplate(List<RevenueReportByCategoryProjection> data) {
        this.data = data;
    }

    @Override
    public byte[] render() throws IOException {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                // Título
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 18);
                contentStream.newLineAtOffset(50, 750);
                contentStream.showText("Relatorio de Receita por Categoria");
                contentStream.endText();

                // Cabeçalho
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                contentStream.newLineAtOffset(50, 720);
                contentStream.showText("Categoria");
                contentStream.newLineAtOffset(100, 0);
                contentStream.showText("Manutenções feitas");
                contentStream.newLineAtOffset(100, 0);
                contentStream.showText("Total");
                contentStream.endText();
            }

            // Escreve os dados da tabela
            writeTableRows(document, page);

            try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                document.save(baos);
                return baos.toByteArray();
            }
        }
    }

    private void writeTableRows(PDDocument document, PDPage page) throws IOException {
        float yPosition = 700;
        PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true);

        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);

        for (RevenueReportByCategoryProjection row : data) {
            contentStream.beginText();
            contentStream.newLineAtOffset(50, yPosition);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            String equipmentString = row.getEquipmentCategory();
            String quantityStr = row.getQuantity() != null ? String.valueOf(row.getQuantity()) : "0";
            String totalStr = row.getTotal() != null ? String.format("R$%.2f", row.getTotal()) : "R$0.00";

            contentStream.showText(equipmentString);
            contentStream.newLineAtOffset(100, 0);
            contentStream.showText(quantityStr);
            contentStream.newLineAtOffset(100, 0);
            contentStream.showText(totalStr);
            contentStream.endText();

            yPosition -= 20;

            if (yPosition < 50) {
                contentStream.close();
                page = new PDPage();
                document.addPage(page);
                contentStream = new PDPageContentStream(document, page); // reabre stream
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                yPosition = 750;
            }
        }

        contentStream.close();
    }
}
