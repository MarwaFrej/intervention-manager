package com.interventionmanager.backend.entity;

import com.interventionmanager.backend.entity.enums.InterventionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "intervention_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterventionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "intervention_id")
    private Intervention intervention;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterventionStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterventionStatus newStatus;

    @Column(nullable = false)
    private LocalDateTime changedAt;

    @PrePersist
    void onCreate() {
        changedAt = LocalDateTime.now();
    }
}