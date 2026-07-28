package com.interventionmanager.backend.dto.request;

import com.interventionmanager.backend.entity.enums.InterventionPriority;
import com.interventionmanager.backend.entity.enums.InterventionStatus;

public record InterventionSearchRequest(

        String title,

        InterventionStatus status,

        InterventionPriority priority,

        Long clientId,

        Long technicianId

) {
}