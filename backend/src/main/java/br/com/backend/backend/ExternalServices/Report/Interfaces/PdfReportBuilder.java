package br.com.backend.backend.ExternalServices.Report.Interfaces;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
public interface PdfReportBuilder<T> {
    byte[] build(List<T> data)throws IOException;
}
