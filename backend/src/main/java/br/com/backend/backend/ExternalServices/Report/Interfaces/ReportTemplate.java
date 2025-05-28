package br.com.backend.backend.ExternalServices.Report.Interfaces;

import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public interface ReportTemplate {
    byte[] render () throws IOException;
}
