CREATE TABLE interventions (
    id BIGSERIAL PRIMARY KEY,

    title VARCHAR(100) NOT NULL,

    description VARCHAR(250) NOT NULL,

    status VARCHAR(50) NOT NULL,

    priority VARCHAR(50) NOT NULL,

    scheduled_at TIMESTAMP NOT NULL,

    client_id BIGINT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_intervention_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE CASCADE
);