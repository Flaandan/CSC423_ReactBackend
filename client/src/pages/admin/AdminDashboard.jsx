import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangePassword from "../../components/changePassword";
import { JWT_KEY, useLocalState } from "../../hooks/useLocalStorage";
import { apiCheckToken } from "../../lib/api";
import { decodeJWT } from "../../utils/decodeJWT";
// import ManageMajorsSection from "../../components/manageMajors";
// import ManageUsersSection from "../../components/manageUsers";
import "../../styles/webPage.css";

const AdminDash = () => {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("dashboard");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(JWT_KEY);
    navigate("/");
  };

  const handleCreateMajor = () => {};

  useEffect(() => {
    const checkToken = async () => {
      if (jwt) {
        const response = await apiCheckToken(jwt);

        if (response?.error) {
          navigate("/");
        }

        const decodedRole = decodeJWT(jwt).user_role;

        if (decodedRole !== "ADMIN") {
          navigate(
            decodedRole === "STUDENT"
              ? "/student"
              : decodedRole === "TEACHER"
                ? "/teacher"
                : "/",
          );
        }
      } else {
        navigate("/");
      }
    };

    checkToken();
  }, [jwt, navigate]);

  return (
    <div className="admin-dashboard">
      <div className="left-column">
        <h1>Admin Dashboard</h1>

        <div className="main-buttons">
          <div className="manage-major-section">
            <button
              type="button"
              href="#majors"
              onClick={() => setCurrentSection("manageMajors")}
            >
              Manage Majors
            </button>
          </div>
          <div className="manage-users-section">
            <button
              type="button"
              href="#users"
              onClick={() => setCurrentSection("manageUsers")}
            >
              Manage Users
            </button>
          </div>
        </div>

        <div className="bottom-buttons">
          <button onClick={() => setIsPasswordOpen(true)} type="button">
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="logout-button"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        <h2>Welcome to Admin Dashboard</h2>
        {currentSection === "dashboard" && <div>Admin Dash Placeholder</div>}
        {/* {currentSection === "manageMajors" && <ManageMajorsSection />} */}
        {/* {currentSection === "manageUsers" && <ManageUsersSection />} */}
      </div>

      <Dialog
        open={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        className="dialog-pop"
      >
        <div className="dialog-pop-back">
          <div className="pop-panel">
            <DialogPanel>
              <DialogTitle className="font-bold">Change Password</DialogTitle>
              <Description>This will update your password.</Description>
              <ChangePassword jwt={jwt} setIsOpen={setIsPasswordOpen} />
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AdminDash;
