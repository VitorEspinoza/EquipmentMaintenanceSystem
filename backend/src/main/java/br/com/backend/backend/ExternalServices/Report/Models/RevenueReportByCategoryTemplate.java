package br.com.backend.backend.ExternalServices.Report.Models;

import br.com.backend.backend.ExternalServices.Pdf.Interfaces.IData;
import br.com.backend.backend.ExternalServices.Pdf.Interfaces.IPdfReportBuilder;
import br.com.backend.backend.ExternalServices.Report.Interfaces.ReportTemplate;
import br.com.backend.backend.ExternalServices.Report.Interfaces.RevenueReportByCategoryProjection;
import java.io.IOException;
import java.util.List;

public class RevenueReportByCategoryTemplate implements ReportTemplate{
    private final List<RevenueReportByCategoryProjection> data;
    private final IPdfReportBuilder<IData<RevenueReportByCategoryProjection>> pdf;
    private final IData<RevenueReportByCategoryProjection> dataExtractor;

    public RevenueReportByCategoryTemplate(List<RevenueReportByCategoryProjection> data,
                                           IPdfReportBuilder<IData<RevenueReportByCategoryProjection>> pdf,
                                           IData<RevenueReportByCategoryProjection> dataExtractor) {
        this.data = data;
        this.pdf = pdf;
        this.dataExtractor = dataExtractor;
    }

    @Override
    public byte[] render() throws IOException {
        pdf.createTitle("Relatório de Receita por categoria");
        pdf.createHeader(List.of("Equipamento", "Quantidade", "Total"));
        pdf.fillRows(dataExtractor, data);
        return pdf.generate();
    }
}

