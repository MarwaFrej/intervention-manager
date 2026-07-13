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

import java.util.List;

@Service
public class InterventionService {

    private final InterventionRepository interventionRepository;
    private final ClientRepository clientRepository;
    private final InterventionMapper interventionMapper;


    public InterventionService(
            InterventionRepository interventionRepository,
            ClientRepository clientRepository,
            InterventionMapper interventionMapper
    ) {
        this.interventionRepository = interventionRepository;
        this.clientRepository = clientRepository;
        this.interventionMapper = interventionMapper;
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
                .orElseThrow(() -> new ClientNotFoundException(id));


        return interventionMapper.toResponse(intervention);
    }


    public void deleteIntervention(Long id) {

        Intervention intervention = interventionRepository.findById(id)
                .orElseThrow(() -> new ClientNotFoundException(id));


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
}