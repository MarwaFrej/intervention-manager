package com.interventionmanager.backend.mapper;

import com.interventionmanager.backend.dto.response.InterventionResponse;
import com.interventionmanager.backend.dto.request.CreateInterventionRequest;
import com.interventionmanager.backend.entity.Intervention;
import org.springframework.stereotype.Component;
import com.interventionmanager.backend.dto.response.InterventionHistoryResponse;
import com.interventionmanager.backend.entity.InterventionHistory;

@Component
public class InterventionMapper {


    public Intervention toEntity(CreateInterventionRequest request) {

        return Intervention.builder()
                .title(request.title())
                .description(request.description())
                .priority(request.priority())
                .address(request.address())
                .street(request.street())
                .city(request.city())
                .postalCode(request.postalCode())
                .country(request.country())
                .scheduledAt(request.scheduledAt())
                .build();
    }


    public InterventionResponse toResponse(Intervention intervention) {

        return InterventionResponse.builder()
                .id(intervention.getId())
                .title(intervention.getTitle())
                .description(intervention.getDescription())
                .status(intervention.getStatus())
                .priority(intervention.getPriority())
                .address(intervention.getAddress())
                .street(intervention.getStreet())
                .city(intervention.getCity())
                .postalCode(intervention.getPostalCode())
                .country(intervention.getCountry())
                .clientId(intervention.getClient().getId())
                .scheduledAt(intervention.getScheduledAt())
                .createdAt(intervention.getCreatedAt())
                .updatedAt(intervention.getUpdatedAt())
                .technicianId(
                    intervention.getTechnician() != null
                        ? intervention.getTechnician().getId()
                        : null
                )
                .technicianName(
                    intervention.getTechnician() != null
                        ? intervention.getTechnician().getFirstName()
                        + " "
                        + intervention.getTechnician().getLastName()
                        : null
                )
                .build();
    }

    public InterventionHistoryResponse toHistoryResponse(
        InterventionHistory history
    ) {

        return InterventionHistoryResponse.builder()
            .id(history.getId())
            .oldStatus(history.getOldStatus())
            .newStatus(history.getNewStatus())
            .changedAt(history.getChangedAt())
            .build();
    }
}