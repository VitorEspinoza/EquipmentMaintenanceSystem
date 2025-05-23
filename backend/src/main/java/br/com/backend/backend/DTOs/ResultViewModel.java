package br.com.backend.backend.DTOs;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.util.List;
import java.util.Collections;

@Getter
public class ResultViewModel<T> {
    @JsonProperty("isSuccess")
    private final boolean isSuccess;

    private final List<String> errors;

    private final T data;

    public ResultViewModel(T data) {
        this(true, null, data);

    }

    public ResultViewModel(List<String> errors) {
        this(false, errors, null);
    }

    private ResultViewModel(boolean isSuccess, List<String> errors, T data) {
        this.isSuccess = isSuccess;
        this.errors = errors != null ? Collections.unmodifiableList(errors) : Collections.emptyList(); // Nunca retornar null
        this.data = data;
    }

    public static <T> ResultViewModel<T> success(T data) {
        return new ResultViewModel<>(data);
    }

    public static ResultViewModel<Void> error(List<String> errors) {
        return new ResultViewModel<>(errors);
    }

}