package com.interventionmanager.backend.controller;


import com.interventionmanager.backend.dto.request.CreateInterventionRequest;
import com.interventionmanager.backend.dto.request.UpdateInterventionRequest;
import com.interventionmanager.backend.dto.response.InterventionResponse;
import com.interventionmanager.backend.entity.enums.InterventionPriority;
import com.interventionmanager.backend.entity.enums.InterventionStatus;
import com.interventionmanager.backend.security.JwtService;
import com.interventionmanager.backend.service.InterventionService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;

import org.springframework.test.web.servlet.MockMvc;

import org.springframework.security.test.context.support.WithMockUser;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(InterventionController.class)
@AutoConfigureMockMvc(addFilters = true)
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
        .andExpect(jsonPath("$.title").value("Panne imprimante"));


        verify(interventionService)
                .getInterventionById(1L);
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
                        .scheduledAt(LocalDateTime.of(2026,7,20,10,0))
                        .clientId(1L)
                        .build();


        when(interventionService.createIntervention(
                any(CreateInterventionRequest.class)
        ))
        .thenReturn(response);



        mockMvc.perform(
                post("/api/interventions")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                          "title":"Panne imprimante",
                          "description":"Ne fonctionne plus",
                          "priority":"HIGH",
                          "scheduledAt":"2026-07-20T10:00:00",
                          "clientId":1
                        }
                        """)
        )
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.status").value("NEW"));


        verify(interventionService)
                .createIntervention(any(CreateInterventionRequest.class));
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
                        .scheduledAt(LocalDateTime.of(2026,7,20,10,0))
                        .clientId(1L)
                        .build();



        when(interventionService.updateIntervention(
                eq(1L),
                any(UpdateInterventionRequest.class)
        ))
        .thenReturn(response);



        mockMvc.perform(
                put("/api/interventions/1")
                        .with(csrf())
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
        .andExpect(jsonPath("$.status").value("IN_PROGRESS"));


        verify(interventionService)
                .updateIntervention(
                        eq(1L),
                        any(UpdateInterventionRequest.class)
                );
    }




    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldDeleteIntervention() throws Exception {


        doNothing()
                .when(interventionService)
                .deleteIntervention(1L);



        mockMvc.perform(
                delete("/api/interventions/1")
                        .with(csrf())
        )
        .andExpect(status().isNoContent());



        verify(interventionService)
                .deleteIntervention(1L);
    }





    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldRejectInvalidIntervention() throws Exception {


        mockMvc.perform(
                post("/api/interventions")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                          "title":"",
                          "description":"",
                          "priority":null,
                          "scheduledAt":null,
                          "clientId":null
                        }
                        """)
        )
        .andExpect(status().isBadRequest());



        verify(
                interventionService,
                never()
        )
        .createIntervention(any());
    }






    @Test
    @WithMockUser(roles = "MANAGER")
    void shouldAssignTechnicianToIntervention() throws Exception {



        InterventionResponse response =
                InterventionResponse.builder()
                        .id(1L)
                        .technicianId(2L)
                        .technicianName("Ahmed Ben Ali")
                        .build();



        when(interventionService.assignTechnicianToIntervention(
                1L,
                2L
        ))
        .thenReturn(response);



        mockMvc.perform(
                patch("/api/interventions/1/assign/2")
                        .with(csrf())
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.technicianId").value(2))
        .andExpect(jsonPath("$.technicianName")
                .value("Ahmed Ben Ali"));



        verify(interventionService)
                .assignTechnicianToIntervention(1L,2L);
    }






    @Test
    @WithMockUser(
            username="technician",
            roles="TECHNICIAN"
    )
    void shouldNotAllowTechnicianToAssignIntervention() throws Exception {



        mockMvc.perform(
                patch("/api/interventions/1/assign/2")
                        .with(csrf())
        )
        .andExpect(status().isForbidden());

    }

}