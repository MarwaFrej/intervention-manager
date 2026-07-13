package com.interventionmanager.backend.mapper;

import com.interventionmanager.backend.dto.response.ClientResponse;
import com.interventionmanager.backend.dto.request.CreateClientRequest;
import com.interventionmanager.backend.entity.Client;
import org.springframework.stereotype.Component;

@Component
public class ClientMapper {

    public Client toEntity(CreateClientRequest request) {
        return Client.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .build();
    }


    public ClientResponse toResponse(Client client) {
        return ClientResponse.builder()
                .id(client.getId())
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .email(client.getEmail())
                .build();
    }
}