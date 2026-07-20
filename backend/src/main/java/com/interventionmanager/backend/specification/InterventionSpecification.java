package com.interventionmanager.backend.specification;

import com.interventionmanager.backend.dto.request.InterventionFilterRequest;
import com.interventionmanager.backend.entity.Intervention;

import org.springframework.data.jpa.domain.Specification;
import com.interventionmanager.backend.entity.enums.InterventionPriority;
import com.interventionmanager.backend.entity.enums.InterventionStatus;


public class InterventionSpecification {


    public static Specification<Intervention> filter(
            InterventionFilterRequest request
    ) {

        return Specification
                .where(hasStatus(request.status()))
                .and(hasPriority(request.priority()))
                .and(hasClient(request.clientId()));
    }


    private static Specification<Intervention> hasStatus(
            InterventionStatus status
    ) {

        return (root, query, cb) -> {

            if (status == null) {
                return null;
            }

            return cb.equal(
                    root.get("status"),
                    status
            );
        };
    }


    private static Specification<Intervention> hasPriority(
            InterventionPriority priority
    ) {

        return (root, query, cb) -> {

            if (priority == null) {
                return null;
            }

            return cb.equal(
                    root.get("priority"),
                    priority
            );
        };
    }


    private static Specification<Intervention> hasClient(
            Long clientId
    ) {

        return (root, query, cb) -> {

            if (clientId == null) {
                return null;
            }

            return cb.equal(
                    root.get("client").get("id"),
                    clientId
            );
        };
    }
}