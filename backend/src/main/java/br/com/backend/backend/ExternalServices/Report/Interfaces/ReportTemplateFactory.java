package br.com.backend.backend.ExternalServices.Report.Interfaces;

import java.util.List;

@FunctionalInterface
public interface ReportTemplateFactory<T> {
    ReportTemplate create(List<T> data);
}

