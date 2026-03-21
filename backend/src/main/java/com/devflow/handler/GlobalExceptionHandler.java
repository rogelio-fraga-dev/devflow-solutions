package com.devflow.handler;

import com.devflow.exception.BusinessRuleException;
import com.devflow.exception.ConflictException;
import com.devflow.exception.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, "NOT_FOUND", ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<Map<String, Object>> handleConflict(ConflictException ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.CONFLICT, "CONFLICT", ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<Map<String, Object>> handleBusinessRule(BusinessRuleException ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "BAD_REQUEST", ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        // Captura o primeiro erro de validação para a mensagem
        String message = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", message, request.getRequestURI());
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(HttpStatus status, String error, String message, String path) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("timestamp", LocalDateTime.now().toString());
        payload.put("status", status.value());
        payload.put("error", error);
        payload.put("message", message);
        payload.put("path", path);
        return new ResponseEntity<>(payload, status);
    }
}
