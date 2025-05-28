package br.com.backend.backend.ExternalServices.Report.Interfaces;

import lombok.Getter;

import java.time.LocalDate;

public interface DataInterface {

    LocalDate getRevenueDate();
    Double getQuantity();
    Double getTotal();

}
