package br.com.backend.backend.Controllers;

import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.ExternalServices.Report.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/revenue")
    public ResponseEntity<byte[]> getRevenue() throws IOException {
        ResultViewModel<byte[]> pdfBytes = reportService.getRevenueReport();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte-receita.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes.getData());
    }
}
