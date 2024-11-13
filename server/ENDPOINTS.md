# API Endpoints

## Table of Contents
1. [Health Check](#health-check)
    - [GET /api/v1/health](#get-apiv1health)
2. [Authentication](#authentication)
    - [POST /api/v1/auth/login](#post-apiv1authlogin)
    - [GET /api/v1/auth/check](#get-apiv1authcheck)
    - [POST /api/v1/auth/change-password](#post-apiv1authchange-password)
3. [Courses](#courses)
    - [GET /api/v1/courses](#get-apiv1courses)
    - [POST /api/v1/courses/majors/:majorId](#post-apiv1coursesmajorsmajorid)
    - [GET /api/v1/courses/:courseId](#get-apiv1coursescourseid)
    - [PATCH /api/v1/courses/:courseId](#patch-apiv1coursescourseid)
    - [DELETE /api/v1/courses/:courseId](#delete-apiv1coursescourseid)
    - [GET /api/v1/courses/:courseId/users](#get-apiv1coursescourseidusers)
4. [Majors](#majors)
    - [GET /api/v1/majors](#get-apiv1majors)
    - [POST /api/v1/majors](#post-apiv1majors)
    - [GET /api/v1/majors/:majorId](#get-apiv1majorsmajorid)
    - [PATCH /api/v1/majors/:majorId](#patch-apiv1majorsmajorid)
    - [DELETE /api/v1/majors/:majorId](#delete-apiv1majorsmajorid)
    - [POST /api/v1/majors/:majorId/courses/:courseId](#post-apiv1majorsmajoridcoursescourseid)
    - [DELETE /api/v1/majors/:majorId/courses/:courseId](#delete-apiv1majorsmajoridcoursescourseid)
    - [GET /api/v1/majors/:majorId/courses](#get-apiv1majorsmajoridcourses)
5. [Users](#users)
    - [GET /api/v1/users](#get-apiv1users)
    - [POST /api/v1/users](#post-apiv1users)
    - [GET /api/v1/users/:userId](#get-apiv1usersuserid)
    - [PATCH /api/v1/users/:userId](#patch-apiv1usersuserid)
    - [DELETE /api/v1/users/:userId](#delete-apiv1usersuserid)


## Health Check

### `GET /api/v1/health`
- **Description**: Get the availability status of the API

## Authentication

### `POST /api/v1/auth/login`
- **Description**: Login with username and password

- **Request Body**:
  ```json 
  {
    "username": "devin716",
    "password": "password456"
  }
  ```

### `GET /api/v1/auth/check`
- **Description**: Check the validity of JWT token provided through Authorization Header

### `POST /api/v1/auth/change-password`
- **Description**: Change the password of the logged-in user

- **Request Body**:
  ```json
  {  
    "current_password": "oldpassword",  
    "new_password": "newsecurepassword"  
  }
  ```

## Courses

### `GET /api/v1/courses`
- **Description**: Get a list of all courses

### `POST /api/v1/courses/majors/:majorId`
- **Description**: Create a new course for given major

- **Path Parameters**:  
  - `majorId`

- **Request Body**:
  ```json
  {
    "course_discipline": "CIS",
    "course_number": 442,
    "description": "test description",
    "max_capacity": 10
  }
  ```

### `GET /api/v1/courses/:courseId`
- **Description**: Get details of a specific course using course's ID

- **Path Parameters**:  
  - `courseId`

### `PATCH /api/v1/courses/:courseId`
- **Description**: Update the details of a specific course using course's ID

- **Path Parameters**:  
  - `courseId`

- **Request Body**:
  ```json 
  {  
    "course_discipline": "CIS", (optional)
    "course_number": 442, (optional)
    "description": "Updated Intro to Computer Science", (optional)
    "max_capacity": 150, (optional)
    "status": "ACTIVE" (optional)  
  }
  ```

### `DELETE /api/v1/courses/:courseId`
- **Description**: Delete a specific course using course's ID

- **Path Parameters**:  
  - `courseId`

### `GET /api/v1/courses/:courseId/users`
- **Description**: Get a list of users in a specific course using course's ID

- **Path Parameters**:  
  - `courseId`


## Majors

### `GET /api/v1/majors`
- **Description**: Get a list of all majors

### `POST /api/v1/majors`
- **Description**: Create a new major

- **Request Body**:
  ```json
  {  
    "name": "Mechanical Engineering",  
    "description": "Study of mechanical systems, thermodynamics, and material science."  
  }
  ```

### `GET /api/v1/majors/:majorId`
- **Description**: Get details of a specific major using major's ID

- **Path Parameters**:  
  - `majorId`

### `PATCH /api/v1/majors/:majorId`
- **Description**: Update the details of a specific major using major's ID

- **Path Parameters**:  
  - `majorId`

- **Request Body**:
  ```json
  {  
    "name": "Computer Science (Updated)", (optional)
    "description": "Study of advanced computing, algorithms, and software engineering." (optional)
  }
  ```

### `DELETE /api/v1/majors/:majorId`
- **Description**: Delete a specific major using major's ID

- **Path Parameters**:  
  - `majorId`

### `POST /api/v1/majors/:majorId/courses/:courseId`
- **Description**: Add a course to a major using major's ID and course's ID

- **Path Parameters**:
  - `majorId`
  - `courseId`

### `DELETE /api/v1/majors/:majorId/courses/:courseId`
- **Description**: Remove a course from a major using major's ID and course's ID

- **Path Parameters**:
  - `majorId`
  - `courseId`

### `GET /api/v1/majors/:majorId/courses`
- **Description**: Get all courses for a specific major using major's ID

- **Path Parameters**:  
  - `majorId`


## Users

### `GET /api/v1/users`
- **Description**: Get a list of all users

### `POST /api/v1/users`
- **Description**: Create a new user

- **Request Body**:
  ```json
  {  
    "first_name": "Jane",  
    "last_name": "Doe",  
    "username": "janedoe",  
    "password": "janepassword",  
    "role": "STUDENT",  
    "phone_number": "123-456-7890",
    "office": "Student Lounge" (optional)
  }
  ```

### `GET /api/v1/users/:userId`
- **Description**: Get details of a specific user using user's ID

- **Path Parameters**:  
  - `userId`

### `PATCH /api/v1/users/:userId`
- **Description**: Update details of a specific user using user's ID

- **Path Parameters**:  
  - `userId`

- **Request Body**:
  ```json 
  {  
    "first_name": "Janet", (optional)
    "last_name": "Doe", (optional)
    "role": "INSTRUCTOR", (oprional)
    "phone_number": "987-654-3210", (optional)
    "office": "Room 117" (optional)
  }
  ```

### `DELETE /api/v1/users/:userId`
- **Description**: Delete a specific user using user's ID

- **Path Parameters**:  
  - `userId`

### `POST /api/v1/users/:userId/majors/:majorId`
- **Description**: Assign a major to a user using user's ID and major's ID

- **Path Parameters**:  
  - `userId`
  - `majorId`

### `DELETE /api/v1/users/:userId/majors/:majorId`
- **Description**: Remove a major from a user using user's ID and major's ID

- **Path Parameters**:  
  - `userId`
  - `majorId`

### `GET /api/v1/users/:userId/majors`
- **Description**: Get all majors assigned to a specific user using user's ID

- **Path Parameters**:  
  - `userId`

### `POST /api/v1/users/:userId/courses/:courseId`
- **Description**: Register a user for a course using user's ID and course's ID

- **Path Parameters**:  
  - `userId`
  - `courseId`

- **Request Body**:
  ```json 
  {  
    "semester_taken": "FALL", (optional)
    "year_taken": 2024 (optional)
  }
  ```

### `DELETE /api/v1/users/:userId/courses/:courseId`
- **Description**: Drop a user from a course using user's ID and course's ID

- **Path Parameters**:  
  - `userId`
  - `courseId`

### `GET /api/v1/users/:userId/courses`
- **Description**: Get all courses a specific user is registered for using user's ID

- **Path Parameters**:  
  - `userId`
