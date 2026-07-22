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
import com.interventionmanager.backend.dto.request.UpdateInterventionRequest;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.domain.Specification;
import static org.mockito.ArgumentMatchers.eq;
import java.util.List;
import com.interventionmanager.backend.dto.request.InterventionFilterRequest;
import com.interventionmanager.backend.entity.User;
import com.interventionmanager.backend.entity.enums.Role;
import com.interventionmanager.backend.repository.UserRepository;
import com.interventionmanager.backend.exception.UserNotFoundException;
import com.interventionmanager.backend.exception.InvalidTechnicianException;

@ExtendWith(MockitoExtension.class)
class InterventionServiceTest {

    @Mock
    private InterventionRepository interventionRepository;

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private InterventionMapper interventionMapper;

	@Mock	
	private UserRepository userRepository;

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

		@Test
		void shouldUpdateInterventionSuccessfully() {

				// GIVEN

				Client client = Client.builder()
								.id(1L)
								.build();

				Intervention intervention = Intervention.builder()
								.id(1L)
								.title("Ancien titre")
								.description("Ancienne description")
								.status(InterventionStatus.NEW)
								.priority(InterventionPriority.LOW)
								.scheduledAt(LocalDateTime.now().plusDays(1))
								.client(client)
								.build();

				UpdateInterventionRequest request =
								new UpdateInterventionRequest(
												"Nouveau titre",
												"Nouvelle description",
												InterventionStatus.IN_PROGRESS,
												InterventionPriority.HIGH,
												LocalDateTime.now().plusDays(3),
												1L
								);

				InterventionResponse response =
								InterventionResponse.builder()
												.id(1L)
												.title("Nouveau titre")
												.description("Nouvelle description")
												.status(InterventionStatus.IN_PROGRESS)
												.priority(InterventionPriority.HIGH)
												.scheduledAt(request.scheduledAt())
												.clientId(1L)
												.build();

				when(interventionRepository.findById(1L))
								.thenReturn(Optional.of(intervention));

				when(clientRepository.findById(1L))
        				.thenReturn(Optional.of(client));

				when(interventionRepository.save(intervention))
								.thenReturn(intervention);

				when(interventionMapper.toResponse(intervention))
								.thenReturn(response);

				// WHEN

				InterventionResponse result =
								interventionService.updateIntervention(1L, request);

				// THEN

				assertEquals("Nouveau titre", intervention.getTitle());
				assertEquals("Nouvelle description", intervention.getDescription());
				assertEquals(InterventionStatus.IN_PROGRESS, intervention.getStatus());
				assertEquals(InterventionPriority.HIGH, intervention.getPriority());

				verify(interventionRepository).save(intervention);

				assertEquals("Nouveau titre", result.title());
		}

		@Test
		void shouldReturnPagedInterventions() {

			Pageable pageable = PageRequest.of(0, 5);

			Intervention intervention = Intervention.builder()
					.id(1L)
					.title("Réparation chaudière")
					.priority(InterventionPriority.HIGH)
					.status(InterventionStatus.NEW)
					.build();


			Page<Intervention> page =
					new PageImpl<>(List.of(intervention));


			when(interventionRepository.findAll(
					any(Specification.class),
					eq(pageable)
			))
			.thenReturn(page);


			InterventionResponse response =
					InterventionResponse.builder()
							.id(1L)
							.title("Réparation chaudière")
							.build();


			when(interventionMapper.toResponse(intervention))
					.thenReturn(response);



			Page<InterventionResponse> result =
					interventionService.getAllInterventions(
							new InterventionFilterRequest(
									InterventionStatus.NEW,
									InterventionPriority.HIGH,
									null
							),
							pageable
					);


			assertEquals(1, result.getTotalElements());
			assertEquals("Réparation chaudière",
					result.getContent().get(0).title());


			verify(interventionRepository)
					.findAll(any(Specification.class), eq(pageable));
		}

		@Test
		void shouldAssignTechnicianSuccessfully() {

			Intervention intervention = Intervention.builder()
					.id(1L)
					.title("Réparation chaudière")
					.build();


			User technician = User.builder()
					.id(2L)
					.firstName("Ahmed")
					.lastName("Ben Ali")
					.role(Role.TECHNICIAN)
					.build();


			when(interventionRepository.findById(1L))
					.thenReturn(Optional.of(intervention));


			when(userRepository.findById(2L))
					.thenReturn(Optional.of(technician));


			when(interventionRepository.save(intervention))
					.thenReturn(intervention);


			InterventionResponse response =
					InterventionResponse.builder()
							.id(1L)
							.technicianId(2L)
							.technicianName("Ahmed Ben Ali")
							.build();


			when(interventionMapper.toResponse(intervention))
					.thenReturn(response);


			InterventionResponse result =
					interventionService.assignTechnicianToIntervention(
							1L,
							2L
					);


			assertEquals(2L, result.technicianId());

			verify(interventionRepository)
					.save(intervention);
		}

		@Test
		void shouldThrowExceptionWhenAssigningUnknownIntervention() {

			when(interventionRepository.findById(99L))
					.thenReturn(Optional.empty());

			assertThrows(
					InterventionNotFoundException.class,
					() -> interventionService.assignTechnicianToIntervention(
							99L,
							2L
					)
			);

			verify(userRepository, never())
					.findById(any());
		}

		@Test
		void shouldThrowExceptionWhenTechnicianNotFound() {

			Intervention intervention = Intervention.builder()
					.id(1L)
					.build();

			when(interventionRepository.findById(1L))
					.thenReturn(Optional.of(intervention));

			when(userRepository.findById(99L))
					.thenReturn(Optional.empty());

			assertThrows(
					UserNotFoundException.class,
					() -> interventionService.assignTechnicianToIntervention(
							1L,
							99L
					)
			);
		}
}