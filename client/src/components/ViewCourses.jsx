import React, { useEffect, useState } from "react";
import { useLocalState } from "../hooks/useLocalStorage";
import { JWT_KEY } from "../hooks/useLocalStorage";
import { customFetch } from "../utils/customFetch";
import { decodeJWT } from "../utils/decodeJWT";
import CourseCard from "./CourseCard";

const ViewCourses = () => {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
  const [errorMessage, setErrorMessage] = useState("");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (jwt) {
      // Get user ID from JWT
      const userId = decodeJWT(jwt).user_id;

      setErrorMessage("");

      const getCourses = async () => {
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

        setCourses(response.courses);
      };

      getCourses();
    }
  }, [jwt]);

  const activeCourses = courses.filter((course) => course.status === "ACTIVE");
  const inactiveCourses = courses.filter(
    (course) => course.status === "INACTIVE",
  );

  return (
    <div>
      <h1>My Courses</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div style={{ width: "48%" }}>
          <h2>Active Courses</h2>
          {activeCourses.length > 0 ? (
            activeCourses.map((course) => (
              <CourseCard key={course.id} course={course} jwt={jwt} />
            ))
          ) : (
            <p>No active courses available</p>
          )}
        </div>

        <div style={{ width: "48%" }}>
          <h2>Inactive Courses</h2>
          {inactiveCourses.length > 0 ? (
            inactiveCourses.map((course) => (
              <CourseCard key={course.id} course={course} jwt={jwt} />
            ))
          ) : (
            <p>No inactive courses available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCourses;
