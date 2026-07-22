package com.interventionmanager.backend.controller;

import com.interventionmanager.backend.dto.request.CreateInterventionRequest;
import com.interventionmanager.backend.dto.response.InterventionResponse;
import com.interventionmanager.backend.service.InterventionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.interventionmanager.backend.dto.request.UpdateInterventionRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;

import com.interventionmanager.backend.dto.request.InterventionFilterRequest;
import com.interventionmanager.backend.dto.response.PageResponse;

import java.util.List;

@Tag(name = "Interventions", description = "Gestion des interventions")
@RestController
@RequestMapping("/api/interventions")
public class InterventionController {


    private final InterventionService interventionService;


    public InterventionController(InterventionService interventionService) {
        this.interventionService = interventionService;
    }

    @Operation(summary = "Obtenir toutes les interventions")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','TECHNICIAN')")
		public ResponseEntity<PageResponse<InterventionResponse>> getAllInterventions(
			InterventionFilterRequest filter,

			@PageableDefault(
				size = 10,
				sort = "createdAt",
				direction = Sort.Direction.DESC
			)
			Pageable pageable
		) {

			Page<InterventionResponse> page =
				interventionService.getAllInterventions(
								filter,
								pageable
				);

		PageResponse<InterventionResponse> response =
			PageResponse.<InterventionResponse>builder()
				.content(page.getContent())
				.page(page.getNumber())
				.size(page.getSize())
				.totalElements(page.getTotalElements())
				.totalPages(page.getTotalPages())
				.build();

		return ResponseEntity.ok(response);
		}

    @Operation(summary = "Créer une intervention")
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<InterventionResponse> createIntervention(
            @Valid @RequestBody CreateInterventionRequest request
    ) {

        InterventionResponse response =
                interventionService.createIntervention(request);


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @Operation(summary = "Obtenir une intervention par son ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<InterventionResponse> getInterventionById(
            @PathVariable Long id
    ) {

        InterventionResponse response =
                interventionService.getInterventionById(id);


        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Mettre à jour une intervention par son ID")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<InterventionResponse> updateIntervention(
            @PathVariable Long id,
            @Valid @RequestBody UpdateInterventionRequest request
    ) {
        
        InterventionResponse response =
                interventionService.updateIntervention(id, request);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Supprimer une intervention par son ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIntervention(
            @PathVariable Long id
    ) {

        interventionService.deleteIntervention(id);

        return ResponseEntity.noContent().build();
    }

		@Operation(summary = "Assigner une intervention à un technicien")
    @PatchMapping("/{interventionId}/assign/{technicianId}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
		public ResponseEntity<InterventionResponse> assignTechnicianToIntervention(
			@PathVariable Long interventionId,
			@PathVariable Long technicianId
    ) {
        
        InterventionResponse response =
				interventionService.assignTechnicianToIntervention(interventionId, technicianId);
        return ResponseEntity.ok(response);
    }
}