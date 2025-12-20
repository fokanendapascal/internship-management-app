package com.techsolution.ima_backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class InvalidAgreementStateException extends RuntimeException {
    public InvalidAgreementStateException(String message) {
        super(message);
    }
}
