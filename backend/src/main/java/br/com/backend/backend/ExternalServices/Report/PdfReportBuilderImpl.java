package br.com.backend.backend.ExternalServices.Report;

import br.com.backend.backend.ExternalServices.Report.Interfaces.PdfReportBuilder;
import br.com.backend.backend.ExternalServices.Report.Interfaces.ReportTemplate;
import br.com.backend.backend.ExternalServices.Report.Interfaces.ReportTemplateFactory;
import br.com.backend.backend.ExternalServices.Report.Interfaces.RevenueReportProjection;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
public class PdfReportBuilderImpl  implements PdfReportBuilder<RevenueReportProjection>{

    private final ReportTemplateFactory<RevenueReportProjection> templateFactory;

    public PdfReportBuilderImpl(ReportTemplateFactory<RevenueReportProjection>  templateFactory) {
        this.templateFactory = templateFactory;
    }

    public byte[] build(List<RevenueReportProjection> data) throws IOException {
        ReportTemplate template = templateFactory.create(data);
        return template.render();
    }
}

