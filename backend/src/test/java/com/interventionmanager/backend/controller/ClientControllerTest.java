package com.interventionmanager.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interventionmanager.backend.dto.response.ClientResponse;
import com.interventionmanager.backend.service.ClientService;
import com.interventionmanager.backend.security.JwtService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.test.web.servlet.MockMvc;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import org.springframework.security.test.context.support.WithMockUser;

import com.interventionmanager.backend.dto.request.CreateClientRequest;

import org.springframework.http.MediaType;

import static org.mockito.ArgumentMatchers.any;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;


@WebMvcTest(ClientController.class)
@AutoConfigureMockMvc(addFilters = false)
class ClientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ClientService clientService;

		@MockBean
    private JwtService jwtService;

    @Test
		@WithMockUser(username = "marwa@test.com", roles = {"ADMIN"})
    void shouldReturnClientById() throws Exception {

        ClientResponse response =
					ClientResponse.builder()
							.id(1L)
							.firstName("Marwa")
							.lastName("Test")
							.email("marwa@test.com")
							.build();

        when(clientService.getClientById(1L))
					.thenReturn(response);

        mockMvc.perform(
                get("/api/clients/1")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.firstName").value("Marwa"))
        .andExpect(jsonPath("$.email").value("marwa@test.com"));
    }

		@Test
		@WithMockUser(username = "marwa@test.com", roles = {"ADMIN"})
		void shouldCreateClient() throws Exception {

				ClientResponse response =
					ClientResponse.builder()
						.id(1L)
						.firstName("Marwa")
						.lastName("Test")
						.email("marwa@test.com")
						.build();

				when(clientService.createClient(any(CreateClientRequest.class)))
						.thenReturn(response);

				mockMvc.perform(
					post("/api/clients")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
							{
								"firstName": "Marwa",
								"lastName": "Test",
								"email": "marwa@test.com"
							}
							""")
				)
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id").value(1))
				.andExpect(jsonPath("$.firstName").value("Marwa"))
				.andExpect(jsonPath("$.email").value("marwa@test.com"));
		}

		@Test
		@WithMockUser(username = "marwa@test.com", roles = {"ADMIN"})
		void shouldRejectInvalidClient() throws Exception {

				mockMvc.perform(
					post("/api/clients")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
									"firstName": "",
									"lastName": "",
									"email": "invalid-email"
								}
							""")
				)
				.andExpect(status().isBadRequest());

				verify(clientService, never())
					.createClient(any(CreateClientRequest.class));
		}
}