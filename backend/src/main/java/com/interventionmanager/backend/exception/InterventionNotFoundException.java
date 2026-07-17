package com.interventionmanager.backend.exception;

public class InterventionNotFoundException extends RuntimeException {

    public InterventionNotFoundException(Long id) {
        super("Intervention with id " + id + " was not found.");
    }
}