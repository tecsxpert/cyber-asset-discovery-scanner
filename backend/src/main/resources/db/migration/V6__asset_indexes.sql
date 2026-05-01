ALTER TABLE asset ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;

UPDATE asset
SET created_at = CURRENT_TIMESTAMP
WHERE created_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_asset_status ON asset(status);
CREATE INDEX IF NOT EXISTS idx_asset_name ON asset(name);
CREATE INDEX IF NOT EXISTS idx_asset_ip ON asset(ip_address);
CREATE INDEX IF NOT EXISTS idx_asset_created ON asset(created_at);