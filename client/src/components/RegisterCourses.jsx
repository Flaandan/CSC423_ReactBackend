import { useEffect, useState } from "react";
import { useLocalState } from "../hooks/useLocalStorage";
import { JWT_KEY } from "../hooks/useLocalStorage";
import { customFetch } from "../utils/customFetch";
import { decodeJWT } from "../utils/decodeJWT";

const RegisterCourses = () => {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
  const [errorMessage, setErrorMessage] = useState("");
  const [availableCourses, setAvailableCourses] = useState([]);
 

  useEffect(() => {
    if (jwt) {
      setErrorMessage("");

      const fetchAvailableCourses = async () => {
        const userId = decodeJWT(jwt).user_id;

        // Get user's majors
        const params1 = {
          url: `http://localhost:8000/api/v1/users/${userId}/majors`,
          method: "GET",
          jwt,
        };

        const response1 = await customFetch(params1);
        console.log("User's majors:", response1.majors);

        // Fetch courses for all majors
        let allCourses = [];
        
        // Use Promise.all to fetch courses for all majors simultaneously
        const coursesPromises = response1.majors.map(async (major) => {
          const params = {
            url: `http://localhost:8000/api/v1/majors/${major.id}/courses`,
            method: "GET",
            jwt,
          };
          const response = await customFetch(params);
          return response.courses;
        });

        try {
          const coursesArrays = await Promise.all(coursesPromises);
          // Combine all courses and remove duplicates based on course ID
          allCourses = [...new Map(
            coursesArrays.flat().map(course => [course.id, course])
          ).values()];

          console.log("All available courses:", allCourses);
          
          if (Array.isArray(allCourses)) {
            setAvailableCourses(allCourses);
          } else {
            console.error("Unexpected response format:", allCourses);
            setErrorMessage("Invalid data format received from server");
            setAvailableCourses([]);
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
          setErrorMessage("Error fetching available courses");
          setAvailableCourses([]);
        }
      };

      fetchAvailableCourses();
    }
  }, [jwt]);

  const handleRegister = async (course) => {
    try {
      const userId = decodeJWT(jwt).user_id;

      const params = {
        url: `http://localhost:8000/api/v1/users/${userId}/courses/${course.id}`,
        method: "POST",
        jwt,
        requestBody: {
          semester_taken: "FALL",
          year_taken: new Date().getFullYear()
        }
      };

      const response = await customFetch(params);

      if (response.error) {
        setErrorMessage(response.error);
        return;
      }

      alert("Successfully registered for course!");
      
      
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Error registering for course");
    }
  };

  return (
    <div>
      <h1>Available Courses</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      
      <div className="courses-grid">
        {!Array.isArray(availableCourses) || availableCourses.length === 0 ? (
          <p>No courses available for registration at this time.</p>
        ) : (
          availableCourses.map((course) => (
            <div
              key={`${course.course_discipline}-${course.course_number}`}
              className="course-card"
            >
              <h3 className="course-title">
                {course.course_discipline} {course.course_number}
              </h3>
              
              <div className="course-content">
                <p className="course-description">{course.description}</p>
                <p className="course-capacity">
                  <strong>Capacity:</strong> {course.current_enrollment || 0}/{course.max_capacity}
                </p>
              </div>
              <button
                onClick={() => handleRegister(course)}
                className="form-button"
                disabled={course.current_enrollment >= course.max_capacity}
              >
                Register for Course
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RegisterCourses;