package br.com.backend.backend.ExternalServices.Report.Interfaces;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface RevenueReportProjection extends DataInterface{
    LocalDate getRevenueDate();
    Integer getQuantity();
    Double getTotal();
}
