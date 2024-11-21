import React, { useEffect, useState } from "react";
import { useLocalState } from "../hooks/useLocalStorage";
import { JWT_KEY } from "../hooks/useLocalStorage";
import { customFetch } from "../utils/customFetch";
import CourseCard from "./cards/CourseCard";

const ViewMajorsCourses = () => {
  const [jwt] = useLocalState("", JWT_KEY);
  const [majors, setMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState(""); //Used for getting the Id of the majors
  const [courses, setCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch the list of majors when the component loads
  useEffect(() => {
    if (jwt) {
      const fetchMajors = async () => {
        const params = {
          url: `http://localhost:8000/api/v1/majors`,
          method: "GET",
          jwt,
        };

        const response = await customFetch(params);

        if (response.error) {
          setErrorMessage(response.error);
          return;
        }

        setMajors(response.majors || []);
      };

      fetchMajors();
    }
  }, [jwt]);

  // Fetch courses when a major is selected
  useEffect(() => {
    if (selectedMajor) {
      const fetchCourses = async () => {
        const params = {
          url: `http://localhost:8000/api/v1/majors/${selectedMajor}/courses`,
          method: "GET",
          jwt,
        };

        const response = await customFetch(params);

        if (response.error) {
          setErrorMessage(response.error);
          return;
        }
        console.log("API Response:", response.courses);
        setCourses(response.courses || []);
      };

      fetchCourses();
    }
  }, [selectedMajor, jwt]);

  const activeCourses = courses.filter((course) => course.status === "ACTIVE");
  const inactiveCourses = courses.filter(
    (course) => course.status === "INACTIVE",
  );

  return (
    <div>
      <h1>Majors and Courses</h1>
      {errorMessage && <p>{errorMessage}</p>}

      {/* Major Selection Dropdown */}
      <div>
        <label htmlFor="majors">Select a Major:</label>
        <select
          id="majors"
          value={selectedMajor}
          onChange={(e) => setSelectedMajor(e.target.value)}
        >
          <option value="">-- Choose a Major --</option>
          {majors.map((major) => (
            <option key={major.id} value={major.id}>
              {major.name}
            </option>
          ))}
        </select>
      </div>

      {/* Display Courses */}
      {selectedMajor && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            marginTop: "20px",
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
      )}
    </div>
  );
};

export default ViewMajorsCourses;
