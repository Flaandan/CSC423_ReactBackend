CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

CREATE TYPE course_status AS ENUM ('ACTIVE', 'INACTIVE');

CREATE TYPE registration_status AS ENUM ('ENROLLED', 'UNENROLLED');

CREATE TYPE semester AS ENUM ('FALL', 'WINTER', 'SPRING', 'SUMMER');

CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL CHECK (length(first_name) > 0),
    last_name VARCHAR(100) NOT NULL CHECK (length(last_name) > 0),
    username VARCHAR(25) NOT NULL UNIQUE CHECK (length(username) > 0),
    password_hash TEXT NOT NULL,
    role user_role DEFAULT 'STUDENT',
    phone_number VARCHAR(15) NOT NULL CHECK (length(phone_number) > 0),
    office VARCHAR(100) DEFAULT 'Student Lounge',
    last_login TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE majors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE CHECK (length(name) > 0),
    description VARCHAR(255) NOT NULL CHECK (length(description) > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    course_discipline VARCHAR(10) NOT NULL CHECK (length(course_discipline) > 0),
    course_number INT NOT NULL CHECK (course_number >= 100 AND course_number <= 999),
    description VARCHAR(255) NOT NULL CHECK (length(description) > 0),
    max_capacity INT NOT NULL DEFAULT 35 CHECK (max_capacity >= 0 AND max_capacity <= 35),
    current_enrollment INT DEFAULT 0,
    status course_status DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_course UNIQUE (course_discipline, course_number)
);

CREATE TABLE major_courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    major_id UUID NOT NULL REFERENCES majors(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_major_course UNIQUE (major_id, course_id)
);

CREATE TABLE user_majors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    major_id UUID NOT NULL REFERENCES majors(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_major UNIQUE (student_id, major_id)
);

CREATE TABLE registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status registration_status DEFAULT 'ENROLLED',
    semester_taken semester NOT NULL,
    year_taken INT NOT NULL CHECK (year_taken >= 2024 AND year_taken <= 2150),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_registration UNIQUE (student_id, course_id, semester_taken, year_taken)
);

-- CREATE TABLE dropped (
--     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
--     registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
--     date_dropped TIMESTAMPTZ DEFAULT NOW()
-- );
-- 
-- CREATE OR REPLACE FUNCTION insert_registration_into_dropped() 
-- RETURNS TRIGGER AS $$
-- BEGIN
-- IF NEW.status = 'DROPPED' AND OLD.status <> 'DROPPED' THEN
-- INSERT INTO dropped (registration_id)
-- VALUES (NEW.id);
--   END IF;
-- 
-- RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
-- 
-- 
-- CREATE TRIGGER after_status_change_to_dropped
-- AFTER UPDATE OF status
-- ON registrations
-- FOR EACH ROW
-- WHEN (NEW.status = 'DROPPED' AND OLD.status <> 'DROPPED')
-- EXECUTE FUNCTION insert_into_dropped();


CREATE INDEX idx_user_majors_student_id ON user_majors(student_id);

CREATE INDEX idx_registrations_student_id_course_id ON registrations(student_id, course_id);

-- Trigger function to update current_enrollment in courses table
CREATE OR REPLACE FUNCTION update_current_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.status = 'ENROLLED') THEN
    UPDATE courses
    SET current_enrollment = current_enrollment + 1
    WHERE id = NEW.course_id;
  ELSIF (OLD.status = 'ENROLLED') THEN
    UPDATE courses
    SET current_enrollment = current_enrollment - 1
    WHERE id = OLD.course_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for insert (enrollment) and update (status change)
CREATE TRIGGER enrollment_trigger
AFTER INSERT OR UPDATE ON registrations
FOR EACH ROW
EXECUTE FUNCTION update_current_enrollment();

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_courses_timestamp_before_update
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_registrations_timestamp_before_update
    BEFORE UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- CREATE VIEW enrolled_students_per_course AS
-- SELECT
--     c.id AS course_id,
--     c.course_discipline,
--     c.course_number,
--     COUNT(r.student_id) AS enrolled_students_count
-- FROM
-- courses c
-- JOIN
-- registrations r ON r.course_id = c.id
-- WHERE
-- r.status = 'ENROLLED'
-- GROUP BY
-- c.id;
-- 
-- CREATE VIEW unenrolled_or_dropped_students_per_course AS
-- SELECT
--     c.id AS course_id,
--     c.course_discipline,
--     c.course_number,
--     COUNT(r.student_id) AS unenrolled_or_dropped_students_count
-- FROM
-- courses c
-- JOIN
-- registrations r ON r.course_id = c.id
-- WHERE
-- r.status IN ('UNENROLLED', 'DROPPED')
-- GROUP BY
-- c.id;
