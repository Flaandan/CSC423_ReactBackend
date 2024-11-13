import { useEffect, useState } from "react";
import { customFetch } from "../../utils/customFetch";

const AddCourse = ({ jwt, setIsOpen }) => {
  const [courseDiscipline, setCourseDiscipline] = useState("");
  const [courseNumber, setCourseNumber] = useState("");
  const [description, setDescription] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [majors, setMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState("");

  useEffect(() => {
    if (jwt) {
      const getMajors = async () => {
        const params = {
          url: "http://localhost:8000/api/v1/majors",
          method: "GET",
          jwt: jwt,
        };

        const response = await customFetch(params);

        if (response.error) {
          alert(`${response.error}`);
          return;
        }

        setMajors(response.majors);
      };

      getMajors();
    }
  }, [jwt]);

  const handleMajorChange = (event) => {
    setSelectedMajor(event.target.value);
  };

  const handleAddCourse = async (event) => {
    event.preventDefault();

    const params = {
      url: `http://localhost:8000/api/v1/courses/majors/${selectedMajor}`,
      method: "POST",
      jwt: jwt,
      requestBody: {
        course_discipline: courseDiscipline,
        course_number: Number(courseNumber),
        description,
        max_capacity: Number(maxCapacity),
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
    setSelectedMajor("");

    alert(`${response.success}`);
  };

  return (
    <div style={{ width: "70%" }}>
      <h1>Add Course</h1>
      <form onSubmit={handleAddCourse} className="course-form">
        <div className="form-group">
          <label htmlFor="major">Major</label>
          <select
            name="major"
            id="major"
            value={selectedMajor}
            onChange={handleMajorChange}
            style={{
              padding: "8px",
              marginBottom: "15px",
              fontSize: "16px",
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="" disabled>
              Select a Major
            </option>
            {majors.map((major) => (
              <option key={major.id} value={major.id}>
                {major.name}
              </option>
            ))}
          </select>
        </div>

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

        <div className="form-actions">
          <button
            className="form-button"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>

          <button
            className="form-button"
            type="submit"
            style={{ backgroundColor: "#4D9078", color: "white" }}
          >
            Add Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;
