import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/webPage.css";
import { JWT_KEY, useLocalState } from "../hooks/useLocalStorage";
import { apiFetch } from "../utils/apiFetch";

const TeacherDash = () => {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(JWT_KEY);

    navigate("/");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (currentPassword === newPassword) {
        alert("passwords must be different");
        return;
    }

    const params = {
        url: "http://localhost:8000/v1/auth/change-password",
        method: "POST",
        jwt,
        requestBody: {
            current_password: currentPassword,
            new_password: newPassword,
        },
    };

    const response = await apiFetch(params);

    if (response.error) {
        alert(`${response.error}`);
    } else {
        alert(`${response.success}`);

        setCurrentPassword("");
        setNewPassword("");
        setIsOpen(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="left-column">
        <h1>Teacher Dashboard</h1>
        {/*Place Holders*/}
        <a href="#majors">Manage Majors</a>
        <a href="#users">Manage Users</a>

        <button onClick={handleLogout} className="logout-button" type="button">
          Logout
        </button>

        <button onClick={() => setIsOpen(true)} type="button">
          Change Password
        </button>

        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="dialog-pop"
        >
          <div className="dialog-pop-back">
            <div className="pop-panel">
              <DialogPanel>
                <DialogTitle className="font-bold">Change Password</DialogTitle>
                <Description>This will update your password.</Description>
                <p>
                  Please enter your current password to confirm and your new
                  password.
                </p>

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

                  <div className="form-actions">
                    <button
                      className="form-button"
                      type="button"
                      onClick={() => setIsOpen(false)}
                    >Cancel</button>

                    <button className="form-button" type="submit">
                      Confirm
                    </button>

                  </div>
                </form>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default TeacherDash;
