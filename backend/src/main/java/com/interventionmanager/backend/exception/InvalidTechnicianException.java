package com.interventionmanager.backend.exception;

public class InvalidTechnicianException extends RuntimeException {

    public InvalidTechnicianException(Long id) {
        super("User with id " + id + " is not a technician.");
    }
}