import React, { useState, useEffect } from "react";
import { customFetch } from "../utils/customFetch";
import { decodeJWT } from "../utils/decodeJWT";

const ChooseMajor = ({ jwt }) => {
  const [majors, setMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchMajors = async () => {
      const params = {
        url: "http://localhost:8000/api/v1/majors",
        method: "GET",
        jwt,
      };

      const response = await customFetch(params);

      if (response.error) {
        setErrorMessage(response.error);
        return;
      }

      setMajors(response.majors);
    };

    fetchMajors();
  }, [jwt]);

  const handleChooseMajor = async () => {
    if(jwt){
        const userId = decodeJWT(jwt).user_id;
        setErrorMessage("");

        if (!selectedMajor) {
          setErrorMessage("Please select a major.");
          return;
        }

        const params = {
          url: `http://localhost:8000/api/v1/users/${userId}/majors/${selectedMajor}`,
          method: "POST",
          jwt,
        };

        const response = await customFetch(params);

        if (response.error) {
          setErrorMessage(response.error);
          return;
        }

        setSuccessMessage("Major selected successfully!");
    }
  };

  return (
    <div className="choose-major-container">
      <h2 className="choose-major-title">Choose Your Major</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <div className="form-group">
        <select
          value={selectedMajor}
          onChange={(e) => setSelectedMajor(e.target.value)}
          className="form-select"
        >
          <option value="">Select a major</option>
          {majors.map((major) => (
            <option key={major.id} value={major.id}>
              {major.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleChooseMajor} className="form-button">
        Confirm Major
      </button>
    </div>
  );
};

export default ChooseMajor; 