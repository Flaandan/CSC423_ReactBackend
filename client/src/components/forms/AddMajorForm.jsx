import { useEffect, useState } from "react";
import { customFetch } from "../../utils/customFetch";

const AddMajor = ({ jwt, setIsOpen }) => {
  const [description, setDiscription] = useState("");
  const [majorName, setMajorName] = useState("");

  const resetFields = () => {
    setMajorName("");
    setDiscription("");
  };

  const handleAddMajor = async (event) => {
    event.preventDefault();
    if (!jwt) {
      alert("Authentication token is missing.");
      return;
    }

    if (!majorName.trim() || !description.trim()) {
      alert("Major name and description are required.");
      return;
    }

    const params = {
      url: `http://localhost:8000/api/v1/majors`,
      method: "POST",
      jwt,
      requestBody: {
        name: majorName,
        description,
      },
    };

    const response = await customFetch(params);

    if (response.error) {
      alert(`Error: ${response.error}`);
      return;
    }

    alert(`Success: ${response.success}`);
    resetFields();
  };

  return (
    <div style={{ width: "70%" }}>
      <h1>Add Major</h1>
      <form onSubmit={handleAddMajor} className="course-form">
        <div className="form-group">
          <label htmlFor="majorName">Major Name</label>
          <input
            type="text"
            id="majorName"
            value={majorName}
            onChange={(e) => setMajorName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Major Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDiscription(e.target.value)}
            required
          />
        </div>

        <div className="form-actions">
          <button
            className="form-button"
            type="button"
            onClick={() => resetFields()}
          >
            Clear
          </button>

          <button
            className="form-button"
            type="submit"
            style={{ backgroundColor: "#4D9078", color: "white" }}
          >
            Add Major
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMajor;
