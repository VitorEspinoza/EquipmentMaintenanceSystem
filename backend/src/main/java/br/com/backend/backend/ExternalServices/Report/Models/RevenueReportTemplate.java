package br.com.backend.backend.ExternalServices.Report.Models;

import br.com.backend.backend.ExternalServices.Pdf.Interfaces.IData;
import br.com.backend.backend.ExternalServices.Pdf.Interfaces.IPdfReportBuilder;
import br.com.backend.backend.ExternalServices.Report.Interfaces.ReportTemplate;
import br.com.backend.backend.ExternalServices.Report.Interfaces.RevenueReportProjection;

import java.io.IOException;
import java.util.List;

public class RevenueReportTemplate implements ReportTemplate {

    private final List<RevenueReportProjection> data;
    private final IPdfReportBuilder<IData<RevenueReportProjection>> pdf;
    private final IData<RevenueReportProjection> dataExtractor;

    public RevenueReportTemplate(List<RevenueReportProjection> data, IPdfReportBuilder<IData<RevenueReportProjection>> pdf, IData<RevenueReportProjection> dataExtractor) {
        this.data = data;
        this.pdf = pdf;
        this.dataExtractor = dataExtractor;
    }

    @Override
    public byte[] render() throws IOException {
        pdf.createTitle("Relatório de Receita por dia");
        pdf.createHeader(List.of("Dia", "Quantidade", "Total"));
        pdf.fillRows(dataExtractor, data);
        return pdf.generate();
    }
}
