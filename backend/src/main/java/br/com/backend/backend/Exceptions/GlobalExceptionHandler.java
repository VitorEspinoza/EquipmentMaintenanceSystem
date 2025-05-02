package br.com.backend.backend.Exceptions;

import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Exceptions.Custom.CategoryAlreadyExists;
import br.com.backend.backend.Exceptions.Custom.EquipmentCategoryNotFoundException;
import br.com.backend.backend.Exceptions.Custom.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ResultViewModel<Void>> handleResourceNotFound(
            EquipmentCategoryNotFoundException ex
    ) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ResultViewModel.error(List.of(ex.getMessage())));
    }

    @ExceptionHandler(CategoryAlreadyExists.class)
    public ResponseEntity<ResultViewModel<Void>> handleCategoryAlreadyExists(
            CategoryAlreadyExists ex
    ) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ResultViewModel.error(List.of(ex.getMessage())));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResultViewModel<Void>> handleValidationException(
            MethodArgumentNotValidException ex
    ) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ResultViewModel.error(errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResultViewModel<Void>> handleGenericException(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ResultViewModel.error(
                        List.of("An unexpected error occurred.")
                ));
    }
}