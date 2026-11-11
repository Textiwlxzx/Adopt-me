-- =============================================================================
-- Adopt-Me Database Schema
-- =============================================================================

-- 1. Create ENUM Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('adopter', 'caretaker', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE animal_species AS ENUM ('dog', 'cat', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE animal_gender AS ENUM ('male', 'female');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE animal_status AS ENUM ('street', 'fostered', 'adopted');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('submitted', 'reviewing', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE follow_up_status AS ENUM ('good', 'needs_attention');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. User Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'adopter',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    address VARCHAR(255)
);

-- 3. Animals Table
CREATE TABLE IF NOT EXISTS animals (
    id SERIAL PRIMARY KEY,
    caretaker_id INT REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    species animal_species NOT NULL,
    breed VARCHAR(100),
    age INT,
    gender animal_gender,
    health_condition TEXT,
    personality_note TEXT,
    photo_url VARCHAR(255),
    location_found VARCHAR(255),
    status animal_status NOT NULL DEFAULT 'street',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Adoption Applications Table
CREATE TABLE IF NOT EXISTS adoption_applications (
    id SERIAL PRIMARY KEY,
    animal_id INT NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
    applicant_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT,
    home_environment TEXT,
    status application_status NOT NULL DEFAULT 'submitted',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Follow-ups Table
CREATE TABLE IF NOT EXISTS follow_ups (
    id SERIAL PRIMARY KEY,
    application_id INT NOT NULL REFERENCES adoption_applications(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL,
    note TEXT,
    status follow_up_status NOT NULL DEFAULT 'good',
    created_by INT REFERENCES users(id) ON DELETE SET NULL
);
