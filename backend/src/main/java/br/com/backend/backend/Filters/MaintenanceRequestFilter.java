package br.com.backend.backend.Filters;

import br.com.backend.backend.Enums.EnMaintenanceRequestState;
import br.com.backend.backend.Enums.EnDateFilter;
import br.com.backend.backend.Exceptions.Custom.InvalidFilterException;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Builder
@Getter
@Setter
public class MaintenanceRequestFilter {

    private EnDateFilter dateFilter = EnDateFilter.ALL;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate from;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate to;

    private EnMaintenanceRequestState state;

    private Integer employeeId;
    
    private Integer clientId;

    public void validate() {
        if (dateFilter == EnDateFilter.DATE_RANGE && (from == null || to == null)) {
            throw new InvalidFilterException("To filter by period, both the ‘from’ and ‘to’ dates must be entered");
        }
        if (dateFilter == EnDateFilter.DATE_RANGE && from.isAfter(to)) {
            throw new InvalidFilterException("The ‘from’ date cannot be later than the ‘to’ date");
        }
    }
}