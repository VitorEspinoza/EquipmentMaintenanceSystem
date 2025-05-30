package br.com.backend.backend.ExternalServices.Pdf.Interfaces;

import java.io.IOException;

public interface IPdf {
    void createTitle(String title) throws IOException;
    byte[] generate() throws IOException;
}
