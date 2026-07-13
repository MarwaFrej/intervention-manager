package com.interventionmanager.backend.dto.request;

import com.interventionmanager.backend.entity.enums.InterventionPriority;
import com.interventionmanager.backend.entity.enums.InterventionStatus;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record UpdateInterventionRequest(
        @Size(max = 255, message = "Le titre ne peut pas dépasser 255 caractères")
        String title,
        String description,
        InterventionStatus status,
        InterventionPriority priority,
        LocalDateTime scheduledAt,
        Long clientId
) {
}