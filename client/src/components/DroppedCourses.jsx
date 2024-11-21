import { useEffect, useState } from "react";
// Import your API functions as needed
import { customFetch } from "../utils/customFetch";
import { decodeJWT } from "../utils/decodeJWT";

const DroppedCourses = ({ jwt }) => {
  const [courses, setCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDroppedCourses = async () => {
        if (jwt) {
          const userId = decodeJWT(jwt).user_id;
          setErrorMessage("");
  
          const params = {
            url: `http://localhost:8000/api/v1/users/${userId}/courses`,
            method: "GET",
            jwt,
          };
  
          const response = await customFetch(params);
  
          if (response.error) {
            setErrorMessage(response.error);
            return;
          }

          console.log(response.courses);
          
  
          // Filter out inactive courses
          const activeEnrolledCourses = response.courses.filter(
            (course) => course.registration_status === "UNENROLLED"
          );
  

          console.log(activeEnrolledCourses);

          setCourses(activeEnrolledCourses);
        }
    };

    fetchDroppedCourses();
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
      
      location.reload();
      
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Error registering for course");
    }
  };

  return (
    <div>
      <h2>Dropped Courses</h2>
      <div className="courses-grid">
        {courses.length === 0 ? (
          <p>No dropped courses found.</p>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="course-card">
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
                Re-enroll in Course
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DroppedCourses;