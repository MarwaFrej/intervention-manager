package com.interventionmanager.backend.dto.request;

import com.interventionmanager.backend.entity.enums.InterventionStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateInterventionStatusRequest(

        @NotNull(message = "Le statut est obligatoire")
        InterventionStatus status

) {
}