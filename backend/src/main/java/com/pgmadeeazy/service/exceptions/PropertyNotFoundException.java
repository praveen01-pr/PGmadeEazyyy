package com.pgmadeeazy.service.exceptions;

public class PropertyNotFoundException extends PropertyServiceException {
    public PropertyNotFoundException(String message) {
        super(message);
    }

    public PropertyNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
