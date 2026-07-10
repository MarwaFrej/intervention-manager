package com.interventionmanager.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateClientRequest(

        @Size(max = 100, message = "Le prénom ne doit pas dépasser 100 caractères")
        String firstName,

        @Size(max = 100, message = "Le nom ne doit pas dépasser 100 caractères")
        String lastName,

        @Email(message = "Email invalide")
        String email

) {}