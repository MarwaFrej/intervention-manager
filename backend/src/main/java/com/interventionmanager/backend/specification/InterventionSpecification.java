package com.interventionmanager.backend.specification;

import com.interventionmanager.backend.dto.request.InterventionFilterRequest;
import com.interventionmanager.backend.entity.Intervention;

import org.springframework.data.jpa.domain.Specification;
import com.interventionmanager.backend.entity.enums.InterventionPriority;
import com.interventionmanager.backend.entity.enums.InterventionStatus;
import com.interventionmanager.backend.dto.request.InterventionSearchRequest;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;


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

    public static Specification<Intervention> withFilters(
            InterventionSearchRequest request
    ) {

        return (root, query, criteriaBuilder) -> {


            List<Predicate> predicates = new ArrayList<>();


            if(request.title() != null 
                    && !request.title().isBlank()) {

                predicates.add(
                    criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("title")),
                        "%" + request.title().toLowerCase() + "%"
                    )
                );
            }


            if(request.status() != null) {

                predicates.add(
                    criteriaBuilder.equal(
                        root.get("status"),
                        request.status()
                    )
                );
            }


            if(request.priority() != null) {

                predicates.add(
                    criteriaBuilder.equal(
                        root.get("priority"),
                        request.priority()
                    )
                );
            }


            if(request.clientId() != null) {

                predicates.add(
                    criteriaBuilder.equal(
                        root.get("client").get("id"),
                        request.clientId()
                    )
                );
            }


            if(request.technicianId() != null) {

                predicates.add(
                    criteriaBuilder.equal(
                        root.get("technician").get("id"),
                        request.technicianId()
                    )
                );
            }


            return criteriaBuilder.and(
                    predicates.toArray(new Predicate[0])
            );
        };
    }
}