package com.interventionmanager.backend.mapper;

import com.interventionmanager.backend.dto.response.InterventionResponse;
import com.interventionmanager.backend.dto.request.CreateInterventionRequest;
import com.interventionmanager.backend.entity.Intervention;
import org.springframework.stereotype.Component;

@Component
public class InterventionMapper {


    public Intervention toEntity(CreateInterventionRequest request) {

        return Intervention.builder()
                .title(request.title())
                .description(request.description())
                .priority(request.priority())
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
}