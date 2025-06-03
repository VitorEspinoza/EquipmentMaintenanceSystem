package br.com.backend.backend.Controllers;

import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.ExternalServices.Report.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/revenue")
    public ResponseEntity<byte[]> getRevenue(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) throws IOException {
        ResultViewModel<byte[]> pdfBytes = reportService.getRevenueReport(from, to);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte-receita.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes.getData());
    }

    @GetMapping("/revenue-by-category")
    public ResponseEntity<byte[]> getRevenueByCategory() throws IOException {
        ResultViewModel<byte[]> pdfBytes = reportService.getRevenueByEquipmentCategoryReport();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte-receita.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes.getData());
    }
}
