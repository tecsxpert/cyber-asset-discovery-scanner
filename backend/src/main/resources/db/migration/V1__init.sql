CREATE TABLE IF NOT EXISTS asset (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(255),
    ip_address VARCHAR(255),
    status VARCHAR(50),
    risk_score INTEGER
);

CREATE INDEX IF NOT EXISTS idx_asset_name ON asset(name);
CREATE INDEX IF NOT EXISTS idx_asset_type ON asset(type);
CREATE INDEX IF NOT EXISTS idx_asset_status ON asset(status);