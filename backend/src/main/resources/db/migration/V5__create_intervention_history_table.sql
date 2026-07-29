CREATE TABLE intervention_history (
    id BIGSERIAL PRIMARY KEY,
    intervention_id BIGINT NOT NULL,
    old_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    changed_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_intervention_history_intervention
        FOREIGN KEY (intervention_id)
        REFERENCES interventions(id)
);