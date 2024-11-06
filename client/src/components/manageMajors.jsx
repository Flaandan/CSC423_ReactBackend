import { useEffect, useState } from "react";
/*import {
  apiFetchMajors,
  apiAddMajor,
  apiDeleteMajor,
  apiUpdateMajor,
} from "../lib/api";*/

const ManageMajorsSection = ({ handleCreateMajor }) => {
  const [majors, setMajors] = useState([]);
  const [newMajor, setNewMajor] = useState("");

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await apiFetchMajors();
        setMajors(response.data);
      } catch (error) {
        console.error("Error fetching majors:", error);
      }
    };

    fetchMajors();
  }, []);

  const handleAddMajor = async (event) => {
    event.preventDefault();
    try {
      const response = await apiAddMajor(newMajor);
      setMajors([...majors, response.data]);
      setNewMajor("");
    } catch (error) {
      console.error("Error adding major:", error);
    }
  };

  const handleDeleteMajor = async (id) => {
    try {
      await apiDeleteMajor(id);
      setMajors(majors.filter((major) => major.id !== id));
    } catch (error) {
      console.error("Error deleting major:", error);
    }
  };

  const handleUpdateMajor = async (id, updatedName) => {
    try {
      const response = await apiUpdateMajor(id, updatedName);
      setMajors(
        majors.map((major) =>
          major.id === id ? { ...major, name: response.data.name } : major,
        ),
      );
    } catch (error) {
      console.error("Error updating major:", error);
    }
  };

  return (
    <div className="manage-majors">
      <h2>Manage Majors</h2>

      <form onSubmit={handleAddMajor}>
        <input
          type="text"
          placeholder="New Major Name"
          value={newMajor}
          onChange={(e) => setNewMajor(e.target.value)}
          required
        />
        <button type="submit">Add Major</button>
      </form>

      <ul className="majors-list">
        {majors.map((major) => (
          <li key={major.id}>
            {major.name}
            <button onClick={() => handleUpdateMajor(major.id, "Updated Name")}>
              Edit
            </button>
            <button onClick={() => handleDeleteMajor(major.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
