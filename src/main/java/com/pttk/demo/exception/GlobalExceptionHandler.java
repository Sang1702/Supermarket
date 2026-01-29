package com.pttk.demo.exception;

import com.pttk.demo.dto.request.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler
{
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handlingAppException(AppException exception)
    {
        ErrorCode errorCode = exception.getErrorCode();
        ApiResponse apiResponse = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();

        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse> handlingValidation(MethodArgumentNotValidException exception)
    {
        var fieldError = exception.getFieldError();
        if (fieldError == null || fieldError.getDefaultMessage() == null) {
            ApiResponse apiResponse = ApiResponse.builder()
                    .code(400)
                    .message("Validation failed")
                    .build();
            return ResponseEntity.badRequest().body(apiResponse);
        }

        String enumKey = fieldError.getDefaultMessage();
        ErrorCode errorCode;
        try {
            errorCode = ErrorCode.valueOf(enumKey);
        } catch (IllegalArgumentException e) {
            ApiResponse apiResponse = ApiResponse.builder()
                    .code(400)
                    .message("Validation failed: " + enumKey)
                    .build();
            return ResponseEntity.badRequest().body(apiResponse);
        }

        ApiResponse apiResponse = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();

        return ResponseEntity.badRequest().body(apiResponse);
    }

}
