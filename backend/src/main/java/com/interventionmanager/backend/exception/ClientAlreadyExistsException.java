package com.interventionmanager.backend.exception;

public class ClientAlreadyExistsException extends RuntimeException {

    public ClientAlreadyExistsException(String email) {
        super("Client with email '" + email + "' already exists.");
    }
}