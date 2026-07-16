package com.interventionmanager.backend.service;


import com.interventionmanager.backend.dto.response.ClientResponse;
import com.interventionmanager.backend.entity.Client;
import com.interventionmanager.backend.mapper.ClientMapper;
import com.interventionmanager.backend.repository.ClientRepository;
import com.interventionmanager.backend.exception.ClientNotFoundException;
import com.interventionmanager.backend.dto.request.CreateClientRequest;
import com.interventionmanager.backend.exception.ClientAlreadyExistsException;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private ClientMapper clientMapper;

    @InjectMocks
    private ClientService clientService;

    @Test
    void shouldReturnClientById() {


        // GIVEN : préparation des données

        Client client = Client.builder()
                .id(1L)
                .firstName("Marwa")
                .lastName("Test")
                .email("marwa@test.com")
                .build();


        ClientResponse response = ClientResponse.builder()
                .id(1L)
                .firstName("Marwa")
                .lastName("Test")
                .email("marwa@test.com")
                .build();



        when(clientRepository.findById(1L))
                .thenReturn(Optional.of(client));


        when(clientMapper.toResponse(client))
                .thenReturn(response);



        // WHEN : appel de la méthode testée

        ClientResponse result =
                clientService.getClientById(1L);



        // THEN : vérification

        assertEquals(1L, result.id());
        assertEquals("Marwa", result.firstName());

    }

    @Test
    void shouldThrowExceptionWhenClientNotFound() {


        // GIVEN

        when(clientRepository.findById(99L))
                .thenReturn(Optional.empty());



        // WHEN + THEN

        assertThrows(
                ClientNotFoundException.class,
                () -> clientService.getClientById(99L)
        );
    }

    @Test
    void shouldCreateClientSuccessfully() {

    // GIVEN

    CreateClientRequest request =
        new CreateClientRequest(
            "Marwa",
            "Test",
            "marwa@test.com"
        );


    Client client = Client.builder()
        .firstName("Marwa")
        .lastName("Test")
        .email("marwa@test.com")
        .build();

    Client savedClient = Client.builder()
        .id(1L)
        .firstName("Marwa")
        .lastName("Test")
        .email("marwa@test.com")
        .build();

    ClientResponse response =
        ClientResponse.builder()
            .id(1L)
            .firstName("Marwa")
            .lastName("Test")
            .email("marwa@test.com")
            .build();

    when(clientRepository.existsByEmail(request.email()))
            .thenReturn(false);

    when(clientMapper.toEntity(request))
            .thenReturn(client);

    when(clientRepository.save(client))
            .thenReturn(savedClient);

    when(clientMapper.toResponse(savedClient))
    .thenReturn(response);

    // WHEN

    ClientResponse result =
        clientService.createClient(request);

    // THEN

    assertEquals("Marwa", result.firstName());
    assertEquals("marwa@test.com", result.email());

    verify(clientRepository).save(any(Client.class));
    }

    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {

        // GIVEN

        CreateClientRequest request =
            new CreateClientRequest(
                "Marwa",
                "Test",
                "marwa@test.com"
            );

        when(clientRepository.existsByEmail(request.email()))
            .thenReturn(true);

        // WHEN + THEN

        assertThrows(
            ClientAlreadyExistsException.class,
            () -> clientService.createClient(request)
        );

        // Vérifie que save() n'a jamais été appelé

        verify(clientRepository, never())
                .save(any(Client.class));
    }
}