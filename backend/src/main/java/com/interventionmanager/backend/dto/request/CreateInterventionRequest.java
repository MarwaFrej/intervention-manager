package com.interventionmanager.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.interventionmanager.backend.entity.enums.InterventionPriority;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record CreateInterventionRequest(

    @NotBlank(message = "Le titre est obligatoire")
    String title,

    @NotBlank(message = "La description est obligatoire")
    String description,

    @NotNull(message = "La priorité est obligatoire")
    InterventionPriority priority,

    @NotNull(message = "La date de planification est obligatoire")
    LocalDateTime scheduledAt,

    @NotNull(message = "Le client est obligatoire")
    Long clientId

) {}