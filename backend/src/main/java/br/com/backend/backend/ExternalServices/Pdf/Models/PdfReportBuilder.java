package br.com.backend.backend.ExternalServices.Pdf.Models;

import br.com.backend.backend.ExternalServices.Pdf.Interfaces.IData;
import br.com.backend.backend.ExternalServices.Pdf.Interfaces.IPdfReportBuilder;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public class PdfReportBuilder<T> implements IPdfReportBuilder<IData<T>> {
    private final PDDocument document = new PDDocument();
    private PDPage page = new PDPage();

    public PdfReportBuilder() throws IOException {
        document.addPage(page);
    }

    @Override
    public void createTitle(String title) throws IOException {
        try (PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true)) {
            contentStream.beginText();
            contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 18);
            contentStream.newLineAtOffset(50, 750);
            contentStream.showText(title);
            contentStream.endText();
        }
    }

    @Override
    public void createHeader(List<String> columns) throws IOException {
        try (PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true)) {
            contentStream.beginText();
            contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
            contentStream.newLineAtOffset(50, 720);

            for (String column : columns) {
                contentStream.showText(column);
                contentStream.newLineAtOffset(100, 0);
            }

            contentStream.endText();
        }
    }


    @Override
    public void fillRows(IData<T> dataRows, List<?> rawData) throws IOException {
        @SuppressWarnings("unchecked")
        List<T> castedRawData = (List<T>) rawData;

        List<Map<String, String>> rows = dataRows.getData(castedRawData);

        float yPosition = 700;
        PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true);
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);

        for (Map<String, String> rowMap : rows) {
            contentStream.beginText();
            contentStream.newLineAtOffset(50, yPosition);

            for (String value : rowMap.values()) {
                contentStream.showText(value);
                contentStream.newLineAtOffset(100, 0);
            }

            contentStream.endText();
            yPosition -= 20;

            if (yPosition < 50) {
                contentStream.close();
                page = new PDPage();
                document.addPage(page);
                contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true);
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                yPosition = 750;
            }
        }

        contentStream.close();
    }

    @Override
    public byte[] generate() throws IOException {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            document.save(baos);
            return baos.toByteArray();
        } finally {
            document.close();
        }
    }
}

