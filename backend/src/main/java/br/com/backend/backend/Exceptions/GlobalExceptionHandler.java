package br.com.backend.backend.Exceptions;

import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Exceptions.Custom.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ClientCreationInvalidException.class)
    public ResponseEntity<ResultViewModel<Void>> ClientCreationInvalidException(
            ClientCreationInvalidException ex
    ) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ResultViewModel.error(
                        ex.getErrors()
                ));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ResultViewModel<Void>> handleBadCredentialsException(
            BadCredentialsException ex
    ) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ResultViewModel.error(
                        List.of("Invalid credentials.")
                ));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ResultViewModel<Void>> handleResourceNotFound(
            ResourceNotFoundException ex
    ) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ResultViewModel.error(List.of(ex.getMessage())));
    }

    @ExceptionHandler(invalidRedirectException.class)
    public ResponseEntity<ResultViewModel<Void>> handleInvalidFilter(
            invalidRedirectException ex
    ) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ResultViewModel.error(List.of(ex.getMessage())));
    }
    @ExceptionHandler(InvalidFilterException.class)
    public ResponseEntity<ResultViewModel<Void>> handleInvalidFilter(
            InvalidFilterException ex
    ) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
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

    @ExceptionHandler(AccountAlreadyExists.class)
    public ResponseEntity<ResultViewModel<Void>> handleAccountAlreadyExists(
            AccountAlreadyExists ex
    ) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ResultViewModel.error(List.of(ex.getMessage())));
    }

    @ExceptionHandler(InvalidStateTransitionException.class)
    public ResponseEntity<ResultViewModel<Void>> handleCategoryAlreadyExists(
            InvalidStateTransitionException ex
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