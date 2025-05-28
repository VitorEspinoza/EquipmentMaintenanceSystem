package br.com.backend.backend.DTOs.MaintenanceRequest;

import br.com.backend.backend.ExternalServices.Report.Interfaces.DataInterface;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class RevenueReportDTO implements DataInterface {
    private LocalDate date;
    private Double revenue;
    private Double total;

    @Override
    public LocalDate getRevenueDate() {
        return null;
    }

    @Override
    public Double getQuantity() {
        return 0.0;
    }

    @Override
    public Double getTotal() {
        return 0.0;
    }
}
