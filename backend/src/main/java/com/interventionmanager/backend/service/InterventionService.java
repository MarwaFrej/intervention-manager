package com.interventionmanager.backend.service;

import com.interventionmanager.backend.dto.request.CreateInterventionRequest;
import com.interventionmanager.backend.dto.request.UpdateInterventionRequest;
import com.interventionmanager.backend.dto.response.InterventionResponse;
import com.interventionmanager.backend.entity.Client;
import com.interventionmanager.backend.entity.Intervention;
import com.interventionmanager.backend.entity.enums.InterventionStatus;
import com.interventionmanager.backend.exception.ClientNotFoundException;
import com.interventionmanager.backend.mapper.InterventionMapper;
import com.interventionmanager.backend.repository.ClientRepository;
import com.interventionmanager.backend.repository.InterventionRepository;
import org.springframework.stereotype.Service;
import com.interventionmanager.backend.exception.InterventionNotFoundException;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.interventionmanager.backend.dto.request.InterventionFilterRequest;
import com.interventionmanager.backend.specification.InterventionSpecification;
import com.interventionmanager.backend.entity.User;
import com.interventionmanager.backend.repository.UserRepository;
import com.interventionmanager.backend.exception.UserNotFoundException;
import com.interventionmanager.backend.entity.enums.Role;
import com.interventionmanager.backend.exception.InvalidTechnicianException;
import com.interventionmanager.backend.dto.request.InterventionSearchRequest;
import com.interventionmanager.backend.dto.request.UpdateInterventionStatusRequest;
import com.interventionmanager.backend.entity.InterventionHistory;
import com.interventionmanager.backend.entity.enums.InterventionStatus;
import com.interventionmanager.backend.repository.InterventionHistoryRepository;
import com.interventionmanager.backend.dto.response.InterventionHistoryResponse;

@Service
public class InterventionService {

    private final InterventionRepository interventionRepository;
    private final ClientRepository clientRepository;
    private final InterventionMapper interventionMapper;
    private final UserRepository userRepository;
		private final InterventionHistoryRepository historyRepository;


    public InterventionService(
            InterventionRepository interventionRepository,
            ClientRepository clientRepository,
            InterventionMapper interventionMapper,
            UserRepository userRepository,
						InterventionHistoryRepository historyRepository
    ) {
        this.interventionRepository = interventionRepository;
        this.clientRepository = clientRepository;
        this.interventionMapper = interventionMapper;
        this.userRepository = userRepository;
				this.historyRepository = historyRepository;
    }


    public List<InterventionResponse> getAllInterventions() {

        return interventionRepository.findAll()
                .stream()
                .map(interventionMapper::toResponse)
                .toList();
    }


    public InterventionResponse createIntervention(CreateInterventionRequest request) {

        Client client = clientRepository.findById(request.clientId())
                .orElseThrow(() -> new ClientNotFoundException(request.clientId()));


        Intervention intervention = interventionMapper.toEntity(request);

        intervention.setClient(client);

        // règle métier :
        // une nouvelle intervention commence toujours par NEW
        intervention.setStatus(InterventionStatus.NEW);


        Intervention savedIntervention =
                interventionRepository.save(intervention);


        return interventionMapper.toResponse(savedIntervention);
    }


    public InterventionResponse getInterventionById(Long id) {

        Intervention intervention = interventionRepository.findById(id)
                .orElseThrow(() -> new InterventionNotFoundException(id));

        return interventionMapper.toResponse(intervention);
    }


    public void deleteIntervention(Long id) {

        Intervention intervention = interventionRepository.findById(id)
                .orElseThrow(() -> new InterventionNotFoundException(id));


        interventionRepository.delete(intervention);
    }


    public InterventionResponse updateIntervention(
            Long id,
            UpdateInterventionRequest request
    ) {

        Intervention intervention = interventionRepository.findById(id)
                .orElseThrow(() -> new ClientNotFoundException(id));


        if (request.title() != null) {
            intervention.setTitle(request.title());
        }


        if (request.description() != null) {
            intervention.setDescription(request.description());
        }


        if (request.priority() != null) {
            intervention.setPriority(request.priority());
        }

        if (request.status() != null) {
            intervention.setStatus(request.status());
        }

        if (request.scheduledAt() != null) {
            intervention.setScheduledAt(request.scheduledAt());
        }


        if (request.clientId() != null) {

            Client client = clientRepository.findById(request.clientId())
                    .orElseThrow(() ->
                            new ClientNotFoundException(request.clientId())
                    );

            intervention.setClient(client);
        }


        Intervention updatedIntervention =
                interventionRepository.save(intervention);


        return interventionMapper.toResponse(updatedIntervention);
    }

    public Page<InterventionResponse> getAllInterventions(
        InterventionFilterRequest filter,
        Pageable pageable
    ) {

        return interventionRepository
            .findAll(
                InterventionSpecification.filter(filter),
                pageable
            )
            .map(interventionMapper::toResponse);
    }

    public InterventionResponse assignTechnicianToIntervention(
        Long interventionId,
        Long technicianId
    ) {

        Intervention intervention = interventionRepository.findById(interventionId)
            .orElseThrow(() -> new InterventionNotFoundException(interventionId));

        User technician = userRepository.findById(technicianId)
            .orElseThrow(() -> new UserNotFoundException(technicianId));

        if (technician.getRole() != Role.TECHNICIAN) {
            throw new InvalidTechnicianException(technicianId);
        }

        intervention.setTechnician(technician);

        Intervention updatedIntervention =
                interventionRepository.save(intervention);

        return interventionMapper.toResponse(updatedIntervention);
    }

    public Page<InterventionResponse> searchInterventions(
        InterventionSearchRequest request,
        Pageable pageable
    ) {

        Page<Intervention> interventions =
            interventionRepository.findAll(
                InterventionSpecification.withFilters(request),
                pageable
            );

        return interventions.map(
            interventionMapper::toResponse
        );
    }

    public InterventionResponse updateStatus(
			Long interventionId,
			UpdateInterventionStatusRequest request
		) {

				Intervention intervention = interventionRepository.findById(interventionId)
        .orElseThrow(() -> new InterventionNotFoundException(interventionId));

				InterventionStatus previousStatus = intervention.getStatus();

				intervention.setStatus(request.status());

				Intervention saved = interventionRepository.save(intervention);

				if (previousStatus != saved.getStatus()) {
						historyRepository.save(
								InterventionHistory.builder()
												.intervention(saved)
												.oldStatus(previousStatus)
												.newStatus(saved.getStatus())
												.build()
						);
				}

			return interventionMapper.toResponse(saved);
		}

		private void validateStatusTransition(
			InterventionStatus current,
			InterventionStatus next
		) {

				if(current == InterventionStatus.COMPLETED) {

						throw new IllegalStateException(
								"Une intervention terminée ne peut pas être modifiée"
						);
				}

				if(current == InterventionStatus.CANCELED) {

						throw new IllegalStateException(
								"Une intervention annulée ne peut pas être modifiée"
						);
				}

				if(current == InterventionStatus.NEW
								&& next == InterventionStatus.COMPLETED) {

						throw new IllegalStateException(
								"Une intervention doit être prise en charge avant d'être terminée"
						);
				}

		}

		public List<InterventionHistoryResponse> getHistory(Long interventionId) {

			return historyRepository
				.findByInterventionIdOrderByChangedAtDesc(interventionId)
				.stream()
				.map(interventionMapper::toHistoryResponse)
				.toList();
		}

}