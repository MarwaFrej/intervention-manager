package com.interventionmanager.backend.dto.response;

import com.interventionmanager.backend.entity.enums.InterventionStatus;
import com.interventionmanager.backend.entity.enums.InterventionPriority;
import java.time.LocalDateTime;
import com.interventionmanager.backend.dto.response.ClientResponse;
import lombok.Builder;

@Builder
public record InterventionResponse(
        Long id,
        String title,
        String description,
        InterventionStatus status,
        InterventionPriority priority,
        LocalDateTime scheduledAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Long clientId,
        Long technicianId,
        String technicianName
) {
}