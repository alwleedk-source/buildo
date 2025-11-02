-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  role VARCHAR DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  reset_token VARCHAR,
  reset_token_expiry TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert default admin user if not exists
INSERT INTO users (email, password, first_name, last_name, role, is_active)
SELECT 
  'waleed.qodami@gmail.com',
  '$2a$10$placeholder',  -- This will be replaced on first login
  'Admin',
  'User',
  'admin',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'waleed.qodami@gmail.com'
);
