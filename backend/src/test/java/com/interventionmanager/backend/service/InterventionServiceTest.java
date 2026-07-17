package com.interventionmanager.backend.service;

import com.interventionmanager.backend.mapper.InterventionMapper;
import com.interventionmanager.backend.repository.ClientRepository;
import com.interventionmanager.backend.repository.InterventionRepository;
import com.interventionmanager.backend.dto.request.CreateInterventionRequest;
import com.interventionmanager.backend.dto.response.InterventionResponse;
import com.interventionmanager.backend.entity.Client;
import com.interventionmanager.backend.entity.Intervention;
import com.interventionmanager.backend.entity.enums.InterventionPriority;
import com.interventionmanager.backend.entity.enums.InterventionStatus;
import com.interventionmanager.backend.exception.ClientNotFoundException;
import com.interventionmanager.backend.exception.InterventionNotFoundException;
import com.interventionmanager.backend.service.InterventionService;
import java.time.LocalDateTime;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyLong;

@ExtendWith(MockitoExtension.class)
class InterventionServiceTest {

    @Mock
    private InterventionRepository interventionRepository;

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private InterventionMapper interventionMapper;

    @InjectMocks
    private InterventionService interventionService;


    @Test
    void shouldCreateInterventionSuccessfully() {

        // GIVEN

        CreateInterventionRequest request =
            new CreateInterventionRequest(
                    "Panne imprimante",
                    "Ne fonctionne plus",
                    InterventionPriority.HIGH,
                    LocalDateTime.now().plusDays(1),
                    1L
            );

        Client client = Client.builder()
                .id(1L)
                .firstName("Marwa")
                .lastName("Test")
                .email("marwa@test.com")
                .build();

        Intervention intervention = Intervention.builder()
                .title(request.title())
                .description(request.description())
                .priority(request.priority())
                .scheduledAt(request.scheduledAt())
                .build();

        Intervention savedIntervention = Intervention.builder()
                .id(1L)
                .title(request.title())
                .description(request.description())
                .priority(request.priority())
                .status(InterventionStatus.NEW)
                .scheduledAt(request.scheduledAt())
                .client(client)
                .build();

        InterventionResponse response =
                InterventionResponse.builder()
                        .id(1L)
                        .title(request.title())
                        .description(request.description())
                        .priority(request.priority())
                        .status(InterventionStatus.NEW)
                        .clientId(1L)
                        .scheduledAt(request.scheduledAt())
                        .build();


        when(clientRepository.findById(1L))
                .thenReturn(Optional.of(client));

        when(interventionMapper.toEntity(request))
                .thenReturn(intervention);

        when(interventionRepository.save(intervention))
                .thenReturn(savedIntervention);

        when(interventionMapper.toResponse(savedIntervention))
                .thenReturn(response);

        // WHEN

        InterventionResponse result =
                interventionService.createIntervention(request);

        // THEN

        assertEquals(1L, result.id());
        assertEquals(InterventionStatus.NEW, result.status());

        verify(interventionRepository).save(intervention);
    }

    @Test
		void shouldThrowExceptionWhenClientNotFound() {

		// GIVEN
		CreateInterventionRequest request =
						new CreateInterventionRequest(
										"Panne imprimante",
										"Ne fonctionne plus",
										InterventionPriority.HIGH,
										LocalDateTime.now().plusDays(1),
										1L
						);

		when(clientRepository.findById(1L))
						.thenReturn(Optional.empty());

		// WHEN + THEN
		assertThrows(
						ClientNotFoundException.class,
						() -> interventionService.createIntervention(request)
		);

		// Le mapper ne doit jamais être appelé
		verify(interventionMapper, never()).toEntity(any());

		// La sauvegarde ne doit jamais être appelée
		verify(interventionRepository, never()).save(any());
		}

		@Test
		void shouldGetInterventionById() {

				// GIVEN

				Client client = Client.builder()
								.id(1L)
								.build();

				Intervention intervention = Intervention.builder()
								.id(1L)
								.title("Panne imprimante")
								.description("Ne fonctionne plus")
								.status(InterventionStatus.NEW)
								.priority(InterventionPriority.HIGH)
								.scheduledAt(LocalDateTime.now().plusDays(1))
								.client(client)
								.build();

				InterventionResponse response =
								InterventionResponse.builder()
												.id(1L)
												.title("Panne imprimante")
												.description("Ne fonctionne plus")
												.status(InterventionStatus.NEW)
												.priority(InterventionPriority.HIGH)
												.scheduledAt(intervention.getScheduledAt())
												.clientId(1L)
												.build();

				when(interventionRepository.findById(1L))
								.thenReturn(Optional.of(intervention));

				when(interventionMapper.toResponse(intervention))
								.thenReturn(response);

				// WHEN

				InterventionResponse result =
								interventionService.getInterventionById(1L);

				// THEN

				assertNotNull(result);
				assertEquals(1L, result.id());
				assertEquals("Panne imprimante", result.title());

				verify(interventionRepository).findById(1L);
				verify(interventionMapper).toResponse(intervention);
		}

		@Test
		void shouldThrowExceptionWhenInterventionNotFound() {

				// GIVEN

				when(interventionRepository.findById(1L))
								.thenReturn(Optional.empty());

				// WHEN + THEN

				assertThrows(
								InterventionNotFoundException.class,
								() -> interventionService.getInterventionById(1L)
				);

				verify(interventionRepository).findById(1L);
				verify(interventionMapper, never()).toResponse(any());
		}

		@Test
		void shouldDeleteIntervention() {

				// GIVEN

				Intervention intervention = Intervention.builder()
								.id(1L)
								.title("Panne imprimante")
								.build();


				when(interventionRepository.findById(1L))
								.thenReturn(Optional.of(intervention));


				// WHEN

				interventionService.deleteIntervention(1L);


				// THEN

				verify(interventionRepository)
								.delete(intervention);
		}

		@Test
		void shouldThrowExceptionWhenDeletingUnknownIntervention() {

				// GIVEN

				when(interventionRepository.findById(1L))
								.thenReturn(Optional.empty());


				// WHEN + THEN

				assertThrows(
								InterventionNotFoundException.class,
								() -> interventionService.deleteIntervention(1L)
				);


				verify(interventionRepository, never())
								.delete(any(Intervention.class));
		}
}