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
    discipline VARCHAR(10) NOT NULL,
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
    FOREIGN KEY (major_name) REFERENCES major(name),
    FOREIGN KEY (course_discipline, course_number) REFERENCES course(discipline, course_number)
);

CREATE TABLE user_majors (
    username VARCHAR(255),
    major_name VARCHAR(255),
    PRIMARY KEY (username, major_name),
    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (major_name) REFERENCES major(name)
);

CREATE TABLE registration (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255),
    course_discipline VARCHAR(10),
    course_number INT,
    status registration_status NOT NULL,
    semester_taken semester NOT NULL,
    year_taken INT NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (course_discipline, course_number) REFERENCES course(discipline, course_number)
);

CREATE TABLE dropped (
    registration_id BIGINT,
    date_dropped TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (registration_id),
    FOREIGN KEY (registration_id) REFERENCES registration(id)
);
