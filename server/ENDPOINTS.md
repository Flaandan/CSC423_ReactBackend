# API Endpoints

## Table of Contents
1. [Authentication](#authentication)
    - [POST /api/v1/auth/login](#post-apiv1authlogin)
    - [GET /api/v1/auth/check](#get-apiv1authcheck)
    - [POST /api/v1/auth/change-password](#post-apiv1authchangepassword)
2. [Courses](#courses)
    - [GET /api/v1/courses](#get-apiv1courses)
    - [POST /api/v1/courses](#post-apiv1courses)
    - [GET /api/v1/courses/:courseDiscipline/:courseNumber](#get-apiv1coursescoursedisciplinecourseNumber)
    - [PATCH /api/v1/courses/:courseDiscipline/:courseNumber](#patch-apiv1coursescoursedisciplinecourseNumber)
    - [DELETE /api/v1/courses/:courseDiscipline/:courseNumber](#delete-apiv1coursescoursedisciplinecourseNumber)
    - [GET /api/v1/courses/:courseDiscipline/:courseNumber/users](#get-apiv1coursescoursedisciplinecourseNumberusers)
3. [Majors](#majors)
    - [GET /api/v1/majors](#get-apiv1majors)
    - [POST /api/v1/majors](#post-apiv1majors)
    - [GET /api/v1/majors/:majorName](#get-apiv1majorsmajorName)
    - [PATCH /api/v1/majors/:majorName](#patch-apiv1majorsmajorName)
    - [DELETE /api/v1/majors/:majorName](#delete-apiv1majorsmajorName)
    - [POST /api/v1/majors/:majorName/courses](#post-apiv1majorsmajorNamecourses)
    - [DELETE /api/v1/majors/:majorName/courses/:courseDiscipline/:courseNumber](#delete-apiv1majorsmajorNamecoursescourseDisciplinecourseNumber)
    - [GET /api/v1/majors/:majorName/courses](#get-apiv1majorsmajorNamecourses)
4. [Users](#users)
    - [GET /api/v1/users](#get-apiv1users)
    - [POST /api/v1/users](#post-apiv1users)
    - [GET /api/v1/users/:username](#get-apiv1usersusername)
    - [PATCH /api/v1/users/:username](#patch-apiv1usersusername)
    - [DELETE /api/v1/users/:username](#delete-apiv1usersusername)
---

## Authentication <a name="authentication"></a>

### `POST /api/v1/auth/login` <a name="post-apiv1authlogin"></a>
- **Description**: Log in with username and password
- **Request Body**:
  ```json 
  {
    "username": "devin716",
    "password": "password456"
  }
  ```

### `GET /api/v1/auth/check` <a name="get-apiv1authcheck"></a>
- **Description**: Check the validity of the provided JWT token through Authorization Header

### `POST /api/v1/auth/change-password` <a name="post-apiv1authchangepassword"></a>
- **Description**: Change the password of the logged-in user
- **Request Body**:
  ```json
  {  
    "current_password": "oldpassword",  
    "new_password": "newsecurepassword"  
  }
  ```

---

## Courses <a name="courses"></a>

### `GET /api/v1/courses` <a name="get-apiv1courses"></a>
- **Description**: Get a list of all courses

### `POST /api/v1/courses` <a name="post-apiv1courses"></a>
- **Description**: Create a new course
- **Request Body**:
  ```json
  {
    "discipline": "CIS",
    "course_number": 442,
    "description": "test description",
    "max_capacity": 10
  }
  ```

### `GET /api/v1/courses/:courseDiscipline/:courseNumber` <a name="get-apiv1coursescoursedisciplinecourseNumber"></a>
- **Description**: Get details of a specific course by discipline and course number
- **Path Parameters**:  
  - `courseDiscipline`: "CS"  
  - `courseNumber`: 101

### `PATCH /api/v1/courses/:courseDiscipline/:courseNumber` <a name="patch-apiv1coursescoursedisciplinecourseNumber"></a>
- **Description**: Update the details of a specific course
- **Path Parameters**:  
  - `courseDiscipline`: "CS"  
  - `courseNumber`: 101  
- **Request Body**:
  ```json 
  {  
    "description": "Updated Intro to Computer Science", (optional)
    "max_capacity": 150 (optional)
  }
  ```

### `DELETE /api/v1/courses/:courseDiscipline/:courseNumber` <a name="delete-apiv1coursescoursedisciplinecourseNumber"></a>
- **Description**: Delete a specific course
- **Path Parameters**:  
  - `courseDiscipline`: "CS"  
  - `courseNumber`: 101

### `GET /api/v1/courses/:courseDiscipline/:courseNumber/users` <a name="get-apiv1coursescoursedisciplinecourseNumberusers"></a>
- **Description**: Get a list of users registered for a specific course
- **Path Parameters**:  
  - `courseDiscipline`: "CS"  
  - `courseNumber`: 101

---

## Majors <a name="majors"></a>

### `GET /api/v1/majors` <a name="get-apiv1majors"></a>
- **Description**: Get a list of all majors

### `POST /api/v1/majors` <a name="post-apiv1majors"></a>
- **Description**: Create a new major
- **Request Body**:
  ```json
  {  
    "name": "Mechanical Engineering",  
    "description": "Study of mechanical systems, thermodynamics, and material science."  
  }
  ```

### `GET /api/v1/majors/:majorName` <a name="get-apiv1majorsmajorName"></a>
- **Description**: Get details of a specific major by name
- **Path Parameters**:  
  - `majorName`: "Computer Science"

### `PATCH /api/v1/majors/:majorName` <a name="patch-apiv1majorsmajorName"></a>
- **Description**: Update the details of a specific major
- **Path Parameters**:  
  - `majorName`: "Computer Science"  
- **Request Body**:
  ```json
  {  
    "name": "Computer Science (Updated)", (optional)
    "description": "Study of advanced computing, algorithms, and software engineering." (optional)
  }
  ```

### `DELETE /api/v1/majors/:majorName` <a name="delete-apiv1majorsmajorName"></a>
- **Description**: Delete a specific major
- **Path Parameters**:  
  - `majorName`: "Computer%20Science"

### `POST /api/v1/majors/:majorName/courses` <a name="post-apiv1majorsmajorNamecourses"></a>
- **Description**: Add a course to a major
- **Path Parameters**:
  - `majorName`: "Computer Science"  
- **Request Body**:
  ```json
  {  
    "discipline": "CS",  
    "course_number": 101  
  }
  ```

### `DELETE /api/v1/majors/:majorName/courses/:courseDiscipline/:courseNumber` <a name="delete-apiv1majorsmajorNamecoursescourseDisciplinecourseNumber"></a>
- **Description**: Remove a course from a major
- **Path Parameters**:  
  - `majorName`: "Computer Science"  
  - `courseDiscipline`: "CS"  
  - `courseNumber`: 101

### `GET /api/v1/majors/:majorName/courses` <a name="get-apiv1majorsmajorNamecourses"></a>
- **Description**: Get all courses for a specific major
- **Path Parameters**:  
  - `majorName`: "Computer Science"

---

## Users <a name="users"></a>

### `GET /api/v1/users` <a name="get-apiv1users"></a>
- **Description**: Get a list of all users

### `POST /api/v1/users` <a name="post-apiv1users"></a>
- **Description**: Create a new user
- **Request Body**:
  ```json
  {  
    "username": "janedoe",  
    "first_name": "Jane",  
    "last_name": "Doe",  
    "password": "janepassword",  
    "role": "STUDENT",  
    "phone_number": "123-456-7890",
    "office": "Student Lounge" (optional)
  }
  ```

### `GET /api/v1/users/:username` <a name="get-apiv1usersusername"></a>
- **Description**: Get details of a specific user by username
- **Path Parameters**:  
  - `username`: "janedoe"

### `PATCH /api/v1/users/:username` <a name="patch-apiv1usersusername"></a>
- **Description**: Update details of a specific user by username
- **Path Parameters**:  
  - `username`: "janedoe"  
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

### `DELETE /api/v1/users/:username` <a name="delete-apiv1usersusername"></a>
- **Description**: Delete a specific user by username
- **Path Parameters**:  
  - `username`: "janedoe"

### `POST /api/v1/users/:username/majors` <a name="post-apiv1usersusernamemajors"></a>
- **Description**: Assign a major to a user
- **Path Parameters**:  
  - `username`: "janedoe"  
- **Request Body**:
  ```json
  {  
    "major_name": "Computer Science"  
  }
  ```

### `DELETE /api/v1/users/:username/majors/:majorName` <a name="delete-apiv1usersusernamemajorsmajorName"></a>
- **Description**: Remove a major from a user
- **Path Parameters**:  
  - `username`: "janedoe"  
  - `majorName`: "Computer Science"

### `GET /api/v1/users/:username/majors` <a name="get-apiv1usersusernamemajors"></a>
- **Description**: Get all majors assigned to a specific user
- **Path Parameters**:  
  - `username`: "janedoe"

### `POST /api/v1/users/:username/courses` <a name="post-apiv1usersusernamecourses"></a>
- **Description**: Register a user for a course
- **Path Parameters**:  
  - `username`: "janedoe"  
- **Request Body**:
  ```json
  {  
    "course_discipline": "CS",  
    "course_number": 101,  
    "semester_taken": "FALL",  
    "year_taken": 2024  
  }
  ```

### `DELETE /api/v1/users/:username/courses/:courseDiscipline/:courseNumber` <a name="delete-apiv1usersusernamecoursescourseDisciplinecourseNumber"></a>
- **Description**: Unregister a user from a course
- **Path Parameters**:  
  - `username`: "janedoe"  
  - `courseDiscipline`: "CS"  
  - `courseNumber`: 101

### `GET /api/v1/users/:username/courses` <a name="get-apiv1usersusernamecourses"></a>
- **Description**: Get all courses a specific user is registered for
- **Path Parameters**:  
  - `username`: "janedoe"

---

## Health Check <a name="health-check"></a>

### `GET /api/v1/health` <a name="get-apiv1health"></a>
- **Description**: Get the health status of the API
