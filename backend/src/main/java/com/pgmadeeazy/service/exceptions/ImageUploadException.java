package com.pgmadeeazy.service.exceptions;

public class ImageUploadException extends PropertyServiceException {
    public ImageUploadException(String message) {
        super(message);
    }

    public ImageUploadException(String message, Throwable cause) {
        super(message, cause);
    }
}
