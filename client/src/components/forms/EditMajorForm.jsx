import { useEffect, useState } from "react";
import { customFetch } from "../../utils/customFetch";

const EditMajor = ({ jwt, setIsOpen, major }) => {
  const [majorName, setMajorName] = useState(major.name);
  const [description, setDescription] = useState(major.description);

  const handleEditMajor = async (event) => {
    event.preventDefault();

    const params = {
      url: `http://localhost:8000/api/v1/majors/${major.id}`,
      method: "PATCH",
      jwt: jwt,
      requestBody: {
        major_name: majorName,
        description,
      },
    };

    const response = await customFetch(params);

    if (response.error) {
      alert(`${response.error}`);
      return;
    }

    setMajorName("");
    setDescription("");

    alert(`${response.success}`);
    location.reload();
  };

  return (
    <form onSubmit={handleEditMajor} className="course-form">
      <div className="form-group">
        <label htmlFor="majorName">Major Name</label>
        <input
          text="text"
          id="majorName"
          value={majorName}
          onChange={(e) => setMajorName(e.target.value)}
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

export default EditMajor;
