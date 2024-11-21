import React, { useEffect, useState } from "react";
import { useLocalState } from "../../hooks/useLocalStorage";
import { JWT_KEY } from "../../hooks/useLocalStorage";
import { customFetch } from "../../utils/customFetch";
import { decodeJWT } from "../../utils/decodeJWT";
import MajorCard from "./../cards/MajorCard";

const ViewMajors = () => {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
  const [errorMessage, setErrorMessage] = useState("");
  const [majors, setMajors] = useState([]);

  useEffect(() => {
    if (jwt) {
      // Get user ID from JWT
      const userId = decodeJWT(jwt).user_id;

      setErrorMessage("");

      const getMajors = async () => {
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

        console.log("Fetched majors:", response.majors);
        setMajors(response.majors || []);
      };

      getMajors();
    }
  }, [jwt]);

  const activeMajors = Array.isArray(majors) ? majors : [];
  console.log("Active major to render:", activeMajors);

  return (
    <div>
      <h1>Admin Details</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div style={{ width: "48%" }}>
          <h2>Majors</h2>
          {activeMajors.length > 0 ? (
            activeMajors.map((major) => (
              <MajorCard key={major.id} major={major} jwt={jwt} />
            ))
          ) : (
            <p>No active majors available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewMajors;
