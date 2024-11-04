import React, { useState } from "react";

const ChangePassword = ({ setIsOpen }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const confirmChange = window.confirm("Are you sure you want to change your password?");
    if (confirmChange) {
      alert("Password change confirmed.");
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsOpen(false); 
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
