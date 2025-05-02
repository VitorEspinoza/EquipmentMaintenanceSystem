package br.com.backend.backend.DTOs;

import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Collections;

@Getter
public class ResultViewModel<T> {
    private final boolean isSuccess;
    private final List<String> errors;
    private final LocalDateTime timestamp;
    private final T data;

    public ResultViewModel(T data) {
        this(true, null, data);
    }

    public ResultViewModel(List<String> errors) {
        this(false, errors, null);
    }

    private ResultViewModel(boolean isSuccess, List<String> errors, T data) {
        this.isSuccess = isSuccess;
        this.errors = errors != null ? Collections.unmodifiableList(errors) : null;
        this.data = data;
        timestamp = LocalDateTime.now();
    }

    public static <T> ResultViewModel<T> success(T data) {
        return new ResultViewModel<>(data);
    }

    public static  ResultViewModel<Void> error(List<String> errors) {
        return new ResultViewModel<>(errors);
    }
}