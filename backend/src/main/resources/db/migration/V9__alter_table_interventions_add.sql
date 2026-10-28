ALTER TABLE interventions
    ADD COLUMN street VARCHAR(255),
    ADD COLUMN city VARCHAR(255),
    ADD COLUMN postal_code VARCHAR(5),
    ADD COLUMN country VARCHAR(255);