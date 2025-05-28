package br.com.backend.backend.ExternalServices.Report;

import br.com.backend.backend.ExternalServices.Report.Interfaces.PdfReportBuilder;
import br.com.backend.backend.ExternalServices.Report.Interfaces.ReportTemplate;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class PdfReportBuilderImpl implements PdfReportBuilder {
    private ReportTemplate reportTemplate;

    public PdfReportBuilderImpl(ReportTemplate reportTemplate) {
        this.reportTemplate = reportTemplate;
    }

    @Override
    public byte[] build() throws IOException {
        return this.reportTemplate.render();
    }
}
