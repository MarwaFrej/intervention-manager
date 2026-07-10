package com.interventionmanager.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.interventionmanager.backend.entity.enums.Role;

public record CreateUserRequest(

    @NotBlank(message = "Le prénom est obligatoire")
    String firstName,

    @NotBlank(message = "Le nom est obligatoire")
    String lastName,

    @Email(message = "Email invalide")
    @NotBlank(message = "L'email est obligatoire")
    String email,

    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    String password,

    @NotBlank(message = "Le rôle est obligatoire")
    Role role

) {}