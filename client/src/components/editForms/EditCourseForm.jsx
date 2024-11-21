import { useEffect, useState } from "react";
import { customFetch } from "../../utils/customFetch";

const EditCourse = ({ jwt, setIsOpen, course }) => {
  const [courseDiscipline, setCourseDiscipline] = useState(
    course.course_discipline,
  );
  const [courseNumber, setCourseNumber] = useState(course.course_number);
  const [description, setDescription] = useState(course.description);
  const [maxCapacity, setMaxCapacity] = useState(course.max_capacity);
  const [courseStatus, setCourseStatus] = useState(course.status);

  const intialStatus = course.status;

  const handleEditCourse = async (event) => {
    event.preventDefault();

    const params = {
      url: `http://localhost:8000/api/v1/courses/${course.id}`,
      method: "PATCH",
      jwt: jwt,
      requestBody: {
        course_discipline: courseDiscipline,
        course_number: Number(courseNumber),
        description,
        max_capacity: Number(maxCapacity),
        status: courseStatus,
      },
    };

    const response = await customFetch(params);

    if (response.error) {
      alert(`${response.error}`);
      return;
    }

    setCourseDiscipline("");
    setCourseNumber("");
    setDescription("");
    setMaxCapacity("");
    setCourseStatus("");
    setIsOpen(false);

    alert(`${response.success}`);
    location.reload();
  };

  return (
    <form onSubmit={handleEditCourse} className="course-form">
      <div className="form-group">
        <label htmlFor="courseDiscipline">Course Discipline</label>
        <input
          type="text"
          id="courseDiscipline"
          value={courseDiscipline}
          onChange={(e) => setCourseDiscipline(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="courseNumber">Course Number</label>
        <input
          type="number"
          id="courseNumber"
          value={courseNumber}
          onChange={(e) => setCourseNumber(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="maxCapacity">Max Capacity</label>
        <input
          type="number"
          id="maxCapacity"
          value={maxCapacity}
          onChange={(e) => setMaxCapacity(e.target.value)}
          required
        />
      </div>
      {intialStatus === "INACTIVE" ? (
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            name="status"
            id="status"
            value={courseStatus}
            onChange={(e) => setCourseStatus(e.target.value)}
            style={{
              padding: "8px",
              marginBottom: "15px",
              fontSize: "16px",
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value={courseStatus}>{courseStatus}</option>
            <option value={courseStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE"}>
              {courseStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE"}
            </option>
          </select>
        </div>
      ) : (
        <></>
      )}

      <div className="form-actions">
        <button
          className="form-button"
          type="button"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </button>

        <button className="form-button" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default EditCourse;
