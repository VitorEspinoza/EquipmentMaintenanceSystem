package br.com.backend.backend.ExternalServices.Report;

import br.com.backend.backend.DTOs.MaintenanceRequest.RevenueReportDTO;
import br.com.backend.backend.ExternalServices.Report.Interfaces.DataInterface;
import br.com.backend.backend.ExternalServices.Report.Interfaces.PdfReportBuilder;
import br.com.backend.backend.ExternalServices.Report.Interfaces.ReportTemplate;
import br.com.backend.backend.ExternalServices.Report.Models.RevenueReportTemplate;
import br.com.backend.backend.Repositories.MaintenanceRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RevenueService {
    private final MaintenanceRequestRepository maintenanceRequestRepository;

    public byte[] getRevenueReport() throws IOException {
        List<DataInterface> data = maintenanceRequestRepository.getRevenueReport();
        ReportTemplate template = new RevenueReportTemplate(data);
        PdfReportBuilder pdfBuilder = new PdfReportBuilderImpl(template);
        return pdfBuilder.build();
    }
}
