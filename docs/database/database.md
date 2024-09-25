# Database Schema

```sql
CREATE TABLE major (
    name VARCHAR(255) PRIMARY KEY,
    description TEXT NOT NULL
);
```

```sql
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
```

```sql
CREATE TABLE course (
    discipline VARCHAR(10) NOT NULL,
    course_number INT NOT NULL,
    description TEXT NOT NULL,
    max_capacity INT NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (discipline, course_number)
);
```

```sql
CREATE TABLE major_courses (
    major_name VARCHAR(255),
    course_discipline VARCHAR(10),
    course_number INT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (major_name, course_discipline, course_number),
    FOREIGN KEY (major_name) REFERENCES major(name),
    FOREIGN KEY (course_discipline, course_number) REFERENCES course(discipline, course_number)
);
```

```sql
CREATE TABLE user_majors (
    username VARCHAR(255),
    major_name VARCHAR(255),
    PRIMARY KEY (username, major_name),
    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (major_name) REFERENCES major(name)
);
```

```sql
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
```

```sql
CREATE TABLE dropped (
    registration_id BIGINT UNSIGNED,
    date_dropped TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (registration_id),
    FOREIGN KEY (registration_id) REFERENCES registration(id)
);
```
