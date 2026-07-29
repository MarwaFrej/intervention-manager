package com.interventionmanager.backend.dto.response;
import com.interventionmanager.backend.entity.enums.InterventionStatus;
import java.time.LocalDateTime;

import lombok.Builder;


@Builder
public record InterventionHistoryResponse(

        Long id,

        InterventionStatus oldStatus,

        InterventionStatus newStatus,

        LocalDateTime changedAt

) {
}