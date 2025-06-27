package br.com.backend.backend.ExternalServices.Pdf.Models;

import br.com.backend.backend.ExternalServices.Pdf.Interfaces.IData;
import br.com.backend.backend.ExternalServices.Report.Interfaces.RevenueReportProjection;

import java.util.*;

public class RevenueReportDataExtractor implements IData<RevenueReportProjection> {
    @Override
    public List<Map<String, String>> getData(List<RevenueReportProjection> data) {
        List<Map<String, String>> rows = new ArrayList<>();
        for (RevenueReportProjection row : data) {
            Map<String, String> map = new LinkedHashMap<>();
            map.put("Dia", row.getRevenueDate().toString());
            map.put("Quantidade", row.getQuantity() != null ? String.valueOf(row.getQuantity()) : "0");
            map.put("Total", row.getTotal() != null ? String.format("R$%.2f", row.getTotal()) : "R$0.00");
            rows.add(map);
        }
        return rows;
    }
}
