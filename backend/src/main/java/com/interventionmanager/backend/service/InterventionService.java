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

@Service
public class InterventionService {

    private final InterventionRepository interventionRepository;
    private final ClientRepository clientRepository;
    private final InterventionMapper interventionMapper;
    private final UserRepository userRepository;


    public InterventionService(
            InterventionRepository interventionRepository,
            ClientRepository clientRepository,
            InterventionMapper interventionMapper,
            UserRepository userRepository
    ) {
        this.interventionRepository = interventionRepository;
        this.clientRepository = clientRepository;
        this.interventionMapper = interventionMapper;
        this.userRepository = userRepository;
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
}