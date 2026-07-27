package com.interventionmanager.backend.dto.response;

import lombok.Builder;

@Builder
public record DashboardResponse(

        long totalClients,
        long totalInterventions,
        long newInterventions,
        long inProgressInterventions,
        long completedInterventions,
        long cancelledInterventions

) {}