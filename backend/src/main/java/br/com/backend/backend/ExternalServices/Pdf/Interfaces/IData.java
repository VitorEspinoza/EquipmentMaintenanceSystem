package br.com.backend.backend.ExternalServices.Pdf.Interfaces;

import java.util.List;
import java.util.Map;

public interface IData<T> {
    List<Map<String, String>> getData(List<T> data);
}

