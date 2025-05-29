package br.com.backend.backend.ExternalServices.Report;

import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Exceptions.Custom.InvalidFilterException;
import br.com.backend.backend.ExternalServices.Report.Interfaces.*;
import br.com.backend.backend.ExternalServices.Report.Models.RevenueReportByCategoryTemplate;
import br.com.backend.backend.ExternalServices.Report.Models.RevenueReportTemplate;
import br.com.backend.backend.Repositories.MaintenanceRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {
    private final MaintenanceRequestRepository maintenanceRequestRepository;

    public ResultViewModel<byte[]> getRevenueReport(LocalDate from, LocalDate to) throws IOException {
        if (from != null && to != null && from.isAfter(to)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }

        List<RevenueReportProjection> data = fetchRevenueData(from, to);

        if (data.isEmpty()) {
            throw new InvalidFilterException("No data found for the selected date");
        }

        PdfReportBuilder pdfBuilder = new PdfReportBuilderImpl(new RevenueReportTemplate(data));
        return ResultViewModel.success(pdfBuilder.build());
    }

    private List<RevenueReportProjection> fetchRevenueData(LocalDate from, LocalDate to) {
        return (from == null || to == null)
                ? maintenanceRequestRepository.getRevenueReport()
                : maintenanceRequestRepository.getRevenueReport(from, to);
    }

    public ResultViewModel<byte[]> getRevenueByEquipmentCategoryReport() throws IOException {
        List<RevenueReportByCategoryProjection> data = maintenanceRequestRepository.getRevenueByCategoryReport();
        PdfReportBuilder pdfBuilder = new PdfReportBuilderImpl(new RevenueReportByCategoryTemplate(data));
        return ResultViewModel.success(pdfBuilder.build());
    }
}
