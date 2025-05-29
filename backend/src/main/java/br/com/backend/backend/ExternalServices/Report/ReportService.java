package br.com.backend.backend.ExternalServices.Report;

import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.ExternalServices.Report.Interfaces.*;
import br.com.backend.backend.Repositories.MaintenanceRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final MaintenanceRequestRepository maintenanceRequestRepository;

    public ResultViewModel<byte[]> getRevenueReport() throws IOException {
        List<RevenueReportProjection> data = maintenanceRequestRepository.getRevenueReport();
        ReportTemplateFactory<RevenueReportProjection> templateFactory= new RevenueReportTemplateFactory();
        PdfReportBuilder<RevenueReportProjection> pdfBuilder = new PdfReportBuilderImpl(templateFactory);
        return ResultViewModel.success(pdfBuilder.build(data));
    }
}
