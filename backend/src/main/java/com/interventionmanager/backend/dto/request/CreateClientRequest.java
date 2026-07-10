package com.interventionmanager.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateClientRequest(

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(
        max = 100,
        message = "Le prénom ne doit pas dépasser 100 caractères"
    )
    String firstName

    @NotBlank(message = "Le nom est obligatoire")
    @Size(
        max = 100,
        message = "Le prénom ne doit pas dépasser 100 caractères"
    )
    String lastName,

    @Email(message = "Email invalide")
    @NotBlank(message = "L'email est obligatoire")
    String email
) {}