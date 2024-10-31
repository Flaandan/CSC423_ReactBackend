import { useState } from "react";
import { apiChangePassword } from "../lib/api";

const ChangePassword = ({ jwt, setIsOpen }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (currentPassword === newPassword) {
      alert("Passwords must be different");
      return;
    }

    if (confirmPassword !== newPassword) {
      alert("Passwords do not match");
      return;
    }

    const response = await apiChangePassword(currentPassword, newPassword, jwt);

    if (response.error) {
      alert(`${response.error}`);
    } else {
      alert(`${response.success}`);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsOpen(false); // Close dialog on success
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="password-form">
      <div className="form-group">
        <label htmlFor="currentPassword">Current Password</label>
        <input
          type="password"
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm New Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          Confirm
        </button>
      </div>
    </form>
  );
};

export default ChangePassword;
