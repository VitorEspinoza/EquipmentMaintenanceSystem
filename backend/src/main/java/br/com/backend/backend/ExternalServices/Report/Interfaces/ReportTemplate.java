package br.com.backend.backend.ExternalServices.Report.Interfaces;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.io.IOException;

public interface ReportTemplate {
    byte[] render () throws IOException;
}
