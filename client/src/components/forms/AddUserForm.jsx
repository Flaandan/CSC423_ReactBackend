import { useEffect, useState } from "react";
import { customFetch } from "../../utils/customFetch";

const AddUser = ({ jwt, setIsOpen }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState([]);

  const resetFields = () => {
    setFirstName("");
    setLastName("");
    setUsername("");
    setPassword("");
    setRole("");
  };

  const handleAddUser = async (event) => {
    event.preventDefault();

    const params = {
      url: `http://localhost:8000/api/v1/users`,
      method: "POST",
      jwt: jwt,
      requestBody: {
        first_name: firstName,
        last_name: lastName,
        username: username,
        password: password,
        role: role,
      },
    };

    const response = await customFetch(params);

    if (response.error) {
      alert(`${response.error}`);
      return;
    }
    setFirstName("");
    setLastName("");
    setUsername("");
    setPassword("");
    setRole("");

    alert(`${response.success}`);
  };

  return (
    <div style={{ width: "70%" }}>
      <h1>Add User</h1>
      <form onSubmit={handleAddUser} className="user-form">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <input
            type="role"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
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
            Add User
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
