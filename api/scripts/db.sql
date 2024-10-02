CREATE TABLE major (
    name VARCHAR(255) PRIMARY KEY,
    description TEXT NOT NULL
);

CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    role ENUM('STUDENT', 'ADMIN', 'INSTRUCTOR') NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    office VARCHAR(255) DEFAULT 'Student Lounge',
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE course (
    discipline VARCHAR(10) NOT NULL,
    course_number INT NOT NULL,
    description TEXT NOT NULL,
    max_capacity INT NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (discipline, course_number)
);

CREATE TABLE major_courses (
    major_name VARCHAR(255),
    course_discipline VARCHAR(10),
    course_number INT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    course_discipline VARCHAR(10),
    course_number INT,
    status ENUM('ENROLLED', 'UNENROLLED', 'DROPPED', 'INSTRUCTING') NOT NULL,
    semester_taken ENUM('FALL', 'WINTER', 'SPRING', 'SUMMER') NOT NULL,
    year_taken INT NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (course_discipline, course_number) REFERENCES course(discipline, course_number)
);

CREATE TABLE dropped (
    registration_id BIGINT UNSIGNED,
    date_dropped TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (registration_id),
    FOREIGN KEY (registration_id) REFERENCES registration(id)
);

-------------------------------------------------------------------------------------------------


INSERT INTO major (name, description) VALUES
('Computer Science', 'Study of computation and computer systems.'),
('Mathematics', 'Study of numbers, shapes, and patterns.'),
('Physics', 'Study of matter, energy, and the universe.'),
('Biology', 'Study of living organisms and life processes.');


INSERT INTO users (username, first_name, last_name, password_hash, role, phone_number, office, last_login) VALUES
('john_doe', 'John', 'Doe', 'hashed_password_1', 'STUDENT', '123-456-7890', 'Student Lounge', NOW()),
('jane_smith', 'Jane', 'Smith', 'hashed_password_2', 'INSTRUCTOR', '234-567-8901', 'Room 101', NOW()),
('admin_user', 'Admin', 'User', 'hashed_password_3', 'ADMIN', '345-678-9012', 'Admin Office', NOW());


INSERT INTO course (discipline, course_number, description, max_capacity) VALUES
('CS', 101, 'Introduction to Computer Science', 30),
('CS', 102, 'Data Structures', 30),
('MATH', 201, 'Calculus I', 40),
('PHYS', 101, 'General Physics', 35),
('BIO', 101, 'Introduction to Biology', 40);


INSERT INTO major_courses (major_name, course_discipline, course_number, last_updated) VALUES
('Computer Science', 'CS', 101, NOW()),
('Computer Science', 'CS', 102, NOW()),
('Mathematics', 'MATH', 201, NOW()),
('Physics', 'PHYS', 101, NOW()),
('Biology', 'BIO', 101, NOW());


INSERT INTO user_majors (username, major_name) VALUES
('john_doe', 'Computer Science'),
('jane_smith', 'Physics'),
('john_doe', 'Mathematics');


INSERT INTO registration (username, course_discipline, course_number, status, semester_taken, year_taken) VALUES
('john_doe', 'CS', 101, 'ENROLLED', 'FALL', 2023),
('john_doe', 'MATH', 201, 'ENROLLED', 'FALL', 2023),
('jane_smith', 'PHYS', 101, 'INSTRUCTING', 'SPRING', 2023),
('john_doe', 'BIO', 101, 'UNENROLLED', 'WINTER', 2023);

INSERT INTO dropped (registration_id, date_dropped) VALUES
(4, NOW());
