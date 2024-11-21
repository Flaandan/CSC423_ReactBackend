import { useEffect, useState } from "react";
import { customFetch } from "../utils/customFetch";
import { decodeJWT } from "../utils/decodeJWT";
import SimpleCourseCard from "./cards/SimpleCourseCard";

const EnrolledCourses = ({ jwt }) => {
  const [courses, setCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
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

        // Filter out inactive courses
        const activeEnrolledCourses = response.courses.filter(
          (course) => course.status === "ACTIVE" && course.registration_status === "ENROLLED"
        );

        setCourses(activeEnrolledCourses);
      }
    };

    fetchEnrolledCourses();
  }, [jwt]);

  return (
    <div>
      <h2>Enrolled Courses</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="courses-grid">
        {courses.length === 0 ? (
          <p>No enrolled courses found.</p>
        ) : (
          courses.map((course) => (
            <SimpleCourseCard key={course.id} course={course} jwt={jwt} />
          ))
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses; 