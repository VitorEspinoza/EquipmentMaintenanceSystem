package br.com.backend.backend.ExternalServices.Pdf.Interfaces;

import java.io.IOException;
import java.util.List;

public interface IPdfReportBuilder<TData> extends IPdf{
    void createHeader(List<String> columns) throws IOException;
    void fillRows(TData data, List<?> rawData) throws IOException;
}
