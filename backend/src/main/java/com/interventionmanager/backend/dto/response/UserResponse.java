package com.interventionmanager.backend.dto.response;

import com.interventionmanager.backend.entity.enums.Role;
import lombok.Builder;

@Builder
public record UserResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        Role role
) {
}