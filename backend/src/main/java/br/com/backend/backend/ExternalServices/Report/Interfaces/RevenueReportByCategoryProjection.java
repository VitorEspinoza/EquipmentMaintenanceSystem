package br.com.backend.backend.ExternalServices.Report.Interfaces;

import java.time.LocalDate;

public interface RevenueReportByCategoryProjection {
    String getEquipmentCategory();
    Integer getQuantity();
    Double getTotal();
}
