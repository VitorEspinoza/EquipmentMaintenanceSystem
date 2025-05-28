package br.com.backend.backend.ExternalServices.Report.Models;

import br.com.backend.backend.DTOs.MaintenanceRequest.RevenueReportDTO;
import br.com.backend.backend.ExternalServices.Report.Interfaces.DataInterface;
import br.com.backend.backend.ExternalServices.Report.Interfaces.ReportTemplate;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class RevenueReportTemplate implements ReportTemplate {
    private List<DataInterface> data;

    public RevenueReportTemplate(List<DataInterface> data) {
        this.data = data;
    }

    @Override
    public byte[] render() throws IOException {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(
                       new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD),
                        18
                );
                contentStream.newLineAtOffset(50, 750);
                contentStream.showText("Relatorio de Receita");
                contentStream.endText();

                // Cabeçalho da tabela
                contentStream.beginText();
                contentStream.setFont(
                        new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD),
                        12
                );
                contentStream.newLineAtOffset(50, 720);
                contentStream.showText("Data");
                contentStream.newLineAtOffset(100, 0);
                contentStream.showText("Quantidade");
                contentStream.newLineAtOffset(100, 0);
                contentStream.showText("Total");
                contentStream.endText();

                float yPosition = 700;

                contentStream.setFont(
                        new PDType1Font(Standard14Fonts.FontName.HELVETICA),
                        12
                );
                for (DataInterface row : data) {
                    contentStream.beginText();
                    contentStream.newLineAtOffset(50, yPosition);
                    contentStream.showText(row.getRevenueDate().toString());
                    contentStream.newLineAtOffset(100, 0);
                    contentStream.showText(String.valueOf(row.getQuantity()));
                    contentStream.newLineAtOffset(100, 0);
                    contentStream.showText(String.format("%.2f", row.getTotal()));
                    contentStream.endText();

                    yPosition -= 20;
                    if (yPosition < 50) {
                        contentStream.close();
                        page = new PDPage();
                        document.addPage(page);
                        yPosition = 750;
                        // Cria novo content stream para nova página
                        // Nota: precisa fechar o anterior para abrir um novo
                        // Aqui simplificado, mas para paginação real precisa lógica extra
                    }
                }
            }

            try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                document.save(baos);
                return baos.toByteArray();
            }
        }
    }
}
