package com.interventionmanager.backend.service;
import com.interventionmanager.backend.dto.response.DashboardResponse;
import com.interventionmanager.backend.entity.enums.InterventionStatus;
import com.interventionmanager.backend.repository.ClientRepository;
import com.interventionmanager.backend.repository.InterventionRepository;
import com.interventionmanager.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.interventionmanager.backend.entity.User;

@Service
public class DashboardService {

    private final InterventionRepository interventionRepository;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

        public DashboardService(InterventionRepository interventionRepository, ClientRepository clientRepository, UserRepository userRepository) {
        this.clientRepository = clientRepository;
        this.interventionRepository = interventionRepository;
        this.userRepository = userRepository;
        }

       private User getCurrentUser() {
                Authentication authentication =
                        SecurityContextHolder.getContext().getAuthentication();

                return userRepository.findByEmail(authentication.getName())
                        .orElseThrow(() -> new UsernameNotFoundException(
                                "Utilisateur connecté introuvable"));
        }

        public DashboardResponse getDashboard() {
                User user = getCurrentUser();

                return switch (user.getRole()) {
                        case ADMIN, MANAGER -> getAdminManagerDashboard();
                        case TECHNICIAN -> getTechnicianDashboard(user);
                        default -> throw new IllegalStateException(
                                "Rôle non pris en charge : " + user.getRole());
                };
        }

        private DashboardResponse getAdminManagerDashboard() {
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

       private DashboardResponse getTechnicianDashboard(User user) {
        Long technicianId = user.getId();

        return DashboardResponse.builder()
						.totalInterventions(
										interventionRepository
											.countByTechnician_Id(technicianId))
						.newInterventions(
										interventionRepository
											.countByTechnician_IdAndStatus(
													technicianId,
													InterventionStatus.NEW))
						.inProgressInterventions(
										interventionRepository
											.countByTechnician_IdAndStatus(
													technicianId,
													InterventionStatus.IN_PROGRESS))
						.completedInterventions(
										interventionRepository
											.countByTechnician_IdAndStatus(
													technicianId,
													InterventionStatus.COMPLETED))
						.cancelledInterventions(
										interventionRepository
											.countByTechnician_IdAndStatus(
													technicianId,
													InterventionStatus.CANCELED))
						.build();
        }
}