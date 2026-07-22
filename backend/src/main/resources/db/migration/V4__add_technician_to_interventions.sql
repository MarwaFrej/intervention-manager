ALTER TABLE interventions
ADD COLUMN technician_id BIGINT;

ALTER TABLE interventions
ADD CONSTRAINT fk_intervention_technician
FOREIGN KEY (technician_id)
REFERENCES users(id);