package com.interventionmanager.backend.repository;

import com.interventionmanager.backend.entity.Intervention;
import org.springframework.data.jpa.repository.JpaRepository;
import com.interventionmanager.backend.entity.enums.InterventionStatus;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import java.util.List;

public interface InterventionRepository 
        extends JpaRepository<Intervention, Long>,
                JpaSpecificationExecutor<Intervention> {

    Optional<Intervention> findByTitle(String title);

    boolean existsByTitle(String title);
    long countByStatus(InterventionStatus status);
    long countByTechnician_Id(Long technicianId);
    long countByTechnician_IdAndStatus(Long technicianId, InterventionStatus status);
		Page<Intervention> findAllByTechnicianId(Long technicianId, Pageable pageable);
		List<Intervention>
			findByScheduledAtGreaterThanEqualAndScheduledAtLessThan(
							LocalDateTime start,
							LocalDateTime end
			);

			List<Intervention>
			findByTechnician_IdAndScheduledAtGreaterThanEqualAndScheduledAtLessThan(
							Long technicianId,
							LocalDateTime start,
							LocalDateTime end
			);
}