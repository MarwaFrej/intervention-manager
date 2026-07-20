package com.interventionmanager.backend.dto.request;

import com.interventionmanager.backend.entity.enums.InterventionPriority;
import com.interventionmanager.backend.entity.enums.InterventionStatus;

public record InterventionFilterRequest(

        InterventionStatus status,

        InterventionPriority priority,

        Long clientId

) {
}