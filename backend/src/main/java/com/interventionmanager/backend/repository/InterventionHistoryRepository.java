package com.interventionmanager.backend.repository;

import com.interventionmanager.backend.entity.InterventionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterventionHistoryRepository
        extends JpaRepository<InterventionHistory, Long> {

    List<InterventionHistory> findByInterventionIdOrderByChangedAtDesc(Long interventionId);

}