import React, { useEffect, useState } from "react";
import { useLocalState } from "../../hooks/useLocalStorage";
import { JWT_KEY } from "../../hooks/useLocalStorage";
import { customFetch } from "../../utils/customFetch";
import { decodeJWT } from "../../utils/decodeJWT";
import UserCard from "./../cards/UserCard";

const ViewUser = () => {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
  const [errorMessage, setErrorMessage] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (jwt) {
      // Get user ID from JWT
      const userId = decodeJWT(jwt).user_id;

      setErrorMessage("");

      const getUsers = async () => {
        const params = {
          url: `http://localhost:8000/api/v1/users`,
          method: "GET",
          jwt,
        };

        const response = await customFetch(params);

        if (response.error) {
          setErrorMessage(response.error);
          return;
        }

        console.log("Fetched users:", response.users);
        setUsers(response.users || []);
      };

      getUsers();
    }
  }, [jwt]);

  const activeUsers = Array.isArray(users) ? users : [];
  console.log("Active users to render:", activeUsers);

  return (
    <div>
      <h1>Active Users</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div style={{ width: "48%" }}>
          {activeUsers.length > 0 ? (
            activeUsers.map((users) => (
              <UserCard key={users.id} users={users} jwt={jwt} />
            ))
          ) : (
            <p>No active users available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
