package br.com.backend.backend.ExternalServices.Report.Interfaces;

import java.io.IOException;

public interface ReportTemplate {
    byte[] render() throws IOException;
}

