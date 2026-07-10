package com.interventionmanager.backend.dto.response;

import lombok.Builder;

@Builder
public record ClientResponse(
        Long id,
        String firstName,
        String lastName,
        String email
) {
}