package com.interventionmanager.backend.service;
import com.interventionmanager.backend.dto.response.DashboardResponse;
import com.interventionmanager.backend.entity.enums.InterventionStatus;
import com.interventionmanager.backend.repository.ClientRepository;
import com.interventionmanager.backend.repository.InterventionRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final InterventionRepository interventionRepository;
    private final ClientRepository clientRepository;

        public DashboardService(InterventionRepository interventionRepository, ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
        this.interventionRepository = interventionRepository;
    }

public DashboardResponse getDashboard() {

    return DashboardResponse.builder()
            .totalClients(clientRepository.count())
            .totalInterventions(interventionRepository.count())
            .newInterventions(
                    interventionRepository.countByStatus(InterventionStatus.NEW))
            .inProgressInterventions(
                    interventionRepository.countByStatus(InterventionStatus.IN_PROGRESS))
            .completedInterventions(
                    interventionRepository.countByStatus(InterventionStatus.COMPLETED))
            .cancelledInterventions(
                    interventionRepository.countByStatus(InterventionStatus.CANCELED))
            .build();
}
}