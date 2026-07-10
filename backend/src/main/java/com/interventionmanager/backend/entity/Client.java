package com.interventionmanager.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "clients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false, length = 100)
    private String firstName;


    @Column(nullable = false, length = 100)
    private String lastName;


    @Column(nullable = false, unique = true, length = 255)
    private String email;


    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;


    @Column(nullable = false, updatable = false)
    private LocalDateTime updatedAt;


    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }


    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}