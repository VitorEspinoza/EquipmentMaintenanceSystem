package br.com.backend.backend.ExternalServices.Report.Interfaces;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

public abstract class PdfReportBuilder {
    protected final ReportTemplate template;

    protected PdfReportBuilder(ReportTemplate template) {
        this.template = template;
    }

    abstract public byte[] build()throws IOException;
}
