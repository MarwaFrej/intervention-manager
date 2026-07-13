package com.interventionmanager.backend.controller;

import com.interventionmanager.backend.dto.request.CreateInterventionRequest;
import com.interventionmanager.backend.dto.response.InterventionResponse;
import com.interventionmanager.backend.service.InterventionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/interventions")
public class InterventionController {


    private final InterventionService interventionService;


    public InterventionController(InterventionService interventionService) {
        this.interventionService = interventionService;
    }


    @GetMapping
    public List<InterventionResponse> getAllInterventions() {

        return interventionService.getAllInterventions();
    }


    @PostMapping
    public ResponseEntity<InterventionResponse> createIntervention(
            @Valid @RequestBody CreateInterventionRequest request
    ) {

        InterventionResponse response =
                interventionService.createIntervention(request);


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    @GetMapping("/{id}")
    public ResponseEntity<InterventionResponse> getInterventionById(
            @PathVariable Long id
    ) {

        InterventionResponse response =
                interventionService.getInterventionById(id);


        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIntervention(
            @PathVariable Long id
    ) {

        interventionService.deleteIntervention(id);

        return ResponseEntity.noContent().build();
    }
}