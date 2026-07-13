package com.interventionmanager.backend.repository;

import com.interventionmanager.backend.entity.Intervention;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InterventionRepository extends JpaRepository<Intervention, Long> {
}