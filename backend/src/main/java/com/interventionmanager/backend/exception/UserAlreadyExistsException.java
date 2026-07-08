package com.interventionmanager.backend.exception;

public class UserAlreadyExistsException extends RuntimeException {

    public UserAlreadyExistsException(String email) {
        super("User with email '" + email + "' already exists.");
    }
}