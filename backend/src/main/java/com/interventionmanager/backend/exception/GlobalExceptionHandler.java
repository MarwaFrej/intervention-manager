package com.interventionmanager.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.Map;

import java.util.HashMap;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUserAlreadyExists(UserAlreadyExistsException ex) {

        ErrorResponse response = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.CONFLICT.value(),
            ex.getMessage()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {

        ErrorResponse response = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationErrors(
        
        MethodArgumentNotValidException ex) {

            Map<String, String> errors = new HashMap<>();

            ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                    errors.put(
                        error.getField(),
                        error.getDefaultMessage()
                    )
                );


            ValidationErrorResponse response =
                new ValidationErrorResponse(
                    LocalDateTime.now(),
                    HttpStatus.BAD_REQUEST.value(),
                    errors
                );


            return ResponseEntity
                .badRequest()
                .body(response);
        }
}