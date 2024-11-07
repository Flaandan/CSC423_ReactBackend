CREATE TYPE user_role AS ENUM ('STUDENT', 'ADMIN', 'INSTRUCTOR');
CREATE TYPE registration_status AS ENUM ('ENROLLED', 'UNENROLLED', 'DROPPED', 'INSTRUCTING');
CREATE TYPE semester AS ENUM ('FALL', 'WINTER', 'SPRING', 'SUMMER');

CREATE TABLE major (
    name VARCHAR(255) PRIMARY KEY,
    description TEXT NOT NULL
);

CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'STUDENT',
    phone_number VARCHAR(14) NOT NULL,
    office VARCHAR(255) DEFAULT 'Student Lounge',
    last_login TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE course (
    discipline VARCHAR(50) NOT NULL,
    course_number INT NOT NULL,
    description TEXT NOT NULL,
    max_capacity INT NOT NULL,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (discipline, course_number)
);

CREATE TABLE major_courses (
    major_name VARCHAR(255),
    course_discipline VARCHAR(10),
    course_number INT,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (major_name, course_discipline, course_number),
    FOREIGN KEY (major_name) 
        REFERENCES major(name) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,  -- If the major name changes, update it in the child table
    FOREIGN KEY (course_discipline, course_number) 
        REFERENCES course(discipline, course_number) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE   -- If the course discipline/number changes, update it in the child table
);

CREATE TABLE user_majors (
    username VARCHAR(255),
    major_name VARCHAR(255),
    PRIMARY KEY (username, major_name),
    FOREIGN KEY (username) 
        REFERENCES users(username) 
        ON DELETE CASCADE, 
    FOREIGN KEY (major_name) 
        REFERENCES major(name) 
        ON DELETE SET NULL   -- If the major is deleted, set the foreign key to NULL (user may have no major now)
        ON UPDATE CASCADE    -- If the major name changes, update it in the child table
);

CREATE TABLE registration (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255),
    course_discipline VARCHAR(10),
    course_number INT,
    status registration_status NOT NULL DEFAULT 'ENROLLED',
    semester_taken semester NOT NULL,
    year_taken INT NOT NULL,
    FOREIGN KEY (username) 
        REFERENCES users(username) 
        ON DELETE CASCADE,   -- If the user is deleted, remove the registration
    FOREIGN KEY (course_discipline, course_number) 
        REFERENCES course(discipline, course_number) 
        ON DELETE CASCADE   -- If the course is deleted, remove the registration
        ON UPDATE CASCADE   -- If the course discipline/number changes, update it in the child table
);

CREATE TABLE dropped (
    registration_id BIGINT,
    date_dropped TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (registration_id),
    FOREIGN KEY (registration_id) 
        REFERENCES registration(id) 
        ON DELETE CASCADE   -- If a registration is deleted, drop record should also be deleted
        ON UPDATE CASCADE    -- If the registration ID changes, update it in the child table
);

-- For when registration_status is changed to DROPPED, insert registration_id in dropped table
CREATE OR REPLACE FUNCTION insert_into_dropped() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'DROPPED' AND OLD.status <> 'DROPPED' THEN
    INSERT INTO dropped (registration_id)
    VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER after_status_change_to_dropped
AFTER UPDATE OF status
ON registration
FOR EACH ROW
WHEN (NEW.status = 'DROPPED' AND OLD.status <> 'DROPPED')
EXECUTE FUNCTION insert_into_dropped();
