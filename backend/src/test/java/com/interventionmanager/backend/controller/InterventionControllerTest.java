package com.interventionmanager.backend.controller;

import com.interventionmanager.backend.security.JwtService;
import com.interventionmanager.backend.service.InterventionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import com.interventionmanager.backend.dto.response.InterventionResponse;
import com.interventionmanager.backend.entity.enums.InterventionPriority;
import com.interventionmanager.backend.entity.enums.InterventionStatus;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;

import org.springframework.security.test.context.support.WithMockUser;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import org.springframework.http.MediaType;
import com.interventionmanager.backend.dto.request.CreateInterventionRequest;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import com.interventionmanager.backend.dto.request.UpdateInterventionRequest;

@WebMvcTest(InterventionController.class)
@AutoConfigureMockMvc(addFilters = false)
class InterventionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InterventionService interventionService;

    @MockBean
    private JwtService jwtService;

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnInterventionById() throws Exception {

        InterventionResponse response =
					InterventionResponse.builder()
						.id(1L)
						.title("Panne imprimante")
						.description("Ne fonctionne plus")
						.status(InterventionStatus.NEW)
						.priority(InterventionPriority.HIGH)
						.scheduledAt(LocalDateTime.now())
						.clientId(1L)
						.build();

        when(interventionService.getInterventionById(1L))
						.thenReturn(response);

        mockMvc.perform(
						get("/api/interventions/1")
        )
						.andExpect(status().isOk())
						.andExpect(jsonPath("$.id").value(1))
						.andExpect(jsonPath("$.title").value("Panne imprimante"))
						.andExpect(jsonPath("$.clientId").value(1));

        verify(interventionService).getInterventionById(1L);
    }

		@Test
		@WithMockUser(roles = "ADMIN")
		void shouldCreateIntervention() throws Exception {

				InterventionResponse response =
					InterventionResponse.builder()
						.id(1L)
						.title("Panne imprimante")
						.description("Ne fonctionne plus")
						.status(InterventionStatus.NEW)
						.priority(InterventionPriority.HIGH)
						.scheduledAt(LocalDateTime.of(2026, 7, 20, 10, 0))
						.clientId(1L)
						.build();

				when(interventionService.createIntervention(any(CreateInterventionRequest.class)))
						.thenReturn(response);

				mockMvc.perform(
					post("/api/interventions")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
							{
								"title": "Panne imprimante",
								"description": "Ne fonctionne plus",
								"priority": "HIGH",
								"scheduledAt": "2026-07-20T10:00:00",
								"clientId": 1
							}
							""")
				)
						.andExpect(status().isCreated())
						.andExpect(jsonPath("$.id").value(1))
						.andExpect(jsonPath("$.title").value("Panne imprimante"))
						.andExpect(jsonPath("$.status").value("NEW"))
						.andExpect(jsonPath("$.clientId").value(1));

				verify(interventionService).createIntervention(any(CreateInterventionRequest.class));
		}

		@Test
		@WithMockUser(roles = "ADMIN")
		void shouldUpdateIntervention() throws Exception {

			InterventionResponse response =
				InterventionResponse.builder()
					.id(1L)
					.title("Nouveau titre")
					.description("Nouvelle description")
					.status(InterventionStatus.IN_PROGRESS)
					.priority(InterventionPriority.HIGH)
					.scheduledAt(LocalDateTime.of(2026, 7, 20, 10, 0))
					.clientId(1L)
					.build();

				when(interventionService.updateIntervention(
					eq(1L),
					any(UpdateInterventionRequest.class)
				)).thenReturn(response);

				mockMvc.perform(
					put("/api/interventions/1")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
									"title":"Nouveau titre",
									"description":"Nouvelle description",
									"status":"IN_PROGRESS",
									"priority":"HIGH",
									"scheduledAt":"2026-07-20T10:00:00",
									"clientId":1
								}
								""")
				)
						.andExpect(status().isOk())
						.andExpect(jsonPath("$.title").value("Nouveau titre"))
						.andExpect(jsonPath("$.status").value("IN_PROGRESS"));

				verify(interventionService)
						.updateIntervention(eq(1L), any(UpdateInterventionRequest.class));
		}

}