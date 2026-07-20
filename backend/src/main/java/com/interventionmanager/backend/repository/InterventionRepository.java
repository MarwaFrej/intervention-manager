package com.interventionmanager.backend.repository;

import com.interventionmanager.backend.entity.Intervention;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface InterventionRepository 
        extends JpaRepository<Intervention, Long>,
                JpaSpecificationExecutor<Intervention> {

    Optional<Intervention> findByTitle(String title);

    boolean existsByTitle(String title);
}