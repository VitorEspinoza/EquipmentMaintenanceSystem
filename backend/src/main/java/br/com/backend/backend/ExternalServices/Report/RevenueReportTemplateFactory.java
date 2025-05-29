package br.com.backend.backend.ExternalServices.Report;

import br.com.backend.backend.ExternalServices.Report.Interfaces.ReportTemplate;
import br.com.backend.backend.ExternalServices.Report.Interfaces.ReportTemplateFactory;
import br.com.backend.backend.ExternalServices.Report.Interfaces.RevenueReportProjection;
import br.com.backend.backend.ExternalServices.Report.Models.RevenueReportTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RevenueReportTemplateFactory implements ReportTemplateFactory<RevenueReportProjection> {
    @Override
    public ReportTemplate create(List<RevenueReportProjection> data) {
        return new RevenueReportTemplate(data);
    }
}
