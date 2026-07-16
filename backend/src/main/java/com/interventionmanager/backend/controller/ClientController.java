package com.interventionmanager.backend.controller;

import com.interventionmanager.backend.dto.response.ClientResponse;
import com.interventionmanager.backend.service.ClientService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import com.interventionmanager.backend.dto.request.CreateClientRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "Clients", description = "Gestion des clients")
@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }
    
    @Operation(summary = "Obtenir tous les clients")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','TECHNICIAN')")
    public List<ClientResponse> getAllClients() {
        return clientService.getAllClients();
    }

    @Operation(summary = "Créer un client")
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<ClientResponse> createClient(
            @Valid @RequestBody CreateClientRequest request
    ){
        ClientResponse response = clientService.createClient(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @Operation(summary = "Obtenir un client par son ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','TECHNICIAN')")
    public ResponseEntity<ClientResponse> getClientById(@PathVariable Long id) {
        ClientResponse clientResponse = clientService.getClientById(id);
        return ResponseEntity.ok(clientResponse);
    }

    @Operation(summary = "Supprimer un client par son ID")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}