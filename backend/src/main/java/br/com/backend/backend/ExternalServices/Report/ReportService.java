package br.com.backend.backend.ExternalServices.Report;

import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Exceptions.Custom.InvalidFilterException;
import br.com.backend.backend.ExternalServices.Pdf.Interfaces.IPdfReportBuilder;
import br.com.backend.backend.ExternalServices.Pdf.Models.PdfReportBuilder;
import br.com.backend.backend.ExternalServices.Pdf.Interfaces.IData;
import br.com.backend.backend.ExternalServices.Pdf.Models.RevenueReportByCategoryDataExtractor;
import br.com.backend.backend.ExternalServices.Pdf.Models.RevenueReportDataExtractor;
import br.com.backend.backend.ExternalServices.Report.Interfaces.*;
import br.com.backend.backend.ExternalServices.Report.Models.*;
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

        IData<RevenueReportProjection> dataExtractor = new RevenueReportDataExtractor();
        IPdfReportBuilder<IData<RevenueReportProjection>> pdfBuilder = new PdfReportBuilder<>();
        ReportTemplate template = new RevenueReportTemplate(data, pdfBuilder, dataExtractor);
        return ResultViewModel.success(template.render());
    }

    public ResultViewModel<byte[]> getRevenueByEquipmentCategoryReport() throws IOException {
        List<RevenueReportByCategoryProjection> data = maintenanceRequestRepository.getRevenueByCategoryReport();

        if (data.isEmpty()) {
            throw new InvalidFilterException("No data found for the selected category");
        }

        IData<RevenueReportByCategoryProjection> dataExtractor = new RevenueReportByCategoryDataExtractor();
        IPdfReportBuilder<IData<RevenueReportByCategoryProjection>> pdfBuilder = new PdfReportBuilder<>();
        ReportTemplate template = new RevenueReportByCategoryTemplate(data, pdfBuilder, dataExtractor);
        return ResultViewModel.success(template.render());
    }

    private List<RevenueReportProjection> fetchRevenueData(LocalDate from, LocalDate to) {
        return (from == null || to == null)
                ? maintenanceRequestRepository.getRevenueReport()
                : maintenanceRequestRepository.getRevenueReport(from, to);
    }
}
