package br.com.backend.backend.ExternalServices.Report;

import br.com.backend.backend.ExternalServices.Report.Interfaces.PdfReportBuilder;
import br.com.backend.backend.ExternalServices.Report.Interfaces.ReportTemplate;
import org.springframework.stereotype.Component;

import java.io.IOException;

public class PdfReportBuilderImpl extends PdfReportBuilder {

    public PdfReportBuilderImpl(ReportTemplate template) {
        super(template);
    }

    public byte[] build() throws IOException {
        return template.render();
    }
}

