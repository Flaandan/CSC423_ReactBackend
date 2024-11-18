import { useEffect, useState } from "react";
import { customFetch } from "../../utils/customFetch";

const EditUser = ({ jwt, setIsOpen, users }) => {
  const [firstName, setFirstName] = useState(users.first_name);
  const [lastName, setLastName] = useState(users.last_name);
  const [username, setUsername] = useState(users.username);
  const [role, setRole] = useState(users.role);
  const [phoneNumber, setPhoneNumber] = useState(users.phone_number);
  const [office, setOffice] = useState(users.office);

  const handleEditUser = async (event) => {
    event.preventDefault();

    const params = {
      url: `http://localhost:8000/api/v1/users/${users.id}`,
      method: "PATCH",
      jwt: jwt,
      requestBody: {
        first_name: firstName,
        last_name: lastName,
        username: username,
        role: role,
        phone_number: phoneNumber,
        office: office,
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
    setRole("");
    setPhoneNumber("");
    setOffice("");

    alert(`${response.success}`);
    location.reload();
  };

  return (
    <form onSubmit={handleEditUser} className="user-form">
      <div className="form-group">
        <label htmlFor="firstName">First Name</label>
        <input
          text="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="username">User Name</label>
        <input
          text="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="role">Role</label>
        <input
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          text="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="office">Office</label>
        <input
          id="office"
          value={office}
          onChange={(e) => setOffice(e.target.value)}
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

export default EditUser;
