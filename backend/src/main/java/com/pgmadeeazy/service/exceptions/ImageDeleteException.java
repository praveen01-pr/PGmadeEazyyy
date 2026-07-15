package com.pgmadeeazy.service.exceptions;

public class ImageDeleteException extends PropertyServiceException {
    public ImageDeleteException(String message) {
        super(message);
    }

    public ImageDeleteException(String message, Throwable cause) {
        super(message, cause);
    }
}
