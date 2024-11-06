import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/webPage.css";
import { JWT_KEY, useLocalState } from "../../hooks/useLocalStorage";
import { apiChangePassword, apiCheckToken } from "../../lib/api";
import { decodeJWT } from "../../utils/decodeJWT";
import ChangePassword from "../../components/changePassword";
//import ManageMajorSection from "../../components/manageMajors";
//import ManageUsersSection from "../../components/manageUsers";

const AdminDash = () => {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
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

        if (response.error) {
          navigate("/");
        }

        const decodedRole = decodeJWT(jwt).role;

        console.log(decodedRole);

        if (decodedRole !== "ADMIN") {
          navigate(
            decodedRole === "STUDENT"
              ? "/student"
              : decodedRole === "INSTRUCTOR"
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

        <div classname="manage-major-section">
          <a href="#majors" onclick={() => setcurrentsection("managemajors")}>
            Manage Majors
          </a>
        </div>
        <div classname="manage-users-section">
          <a href="#users" onclick={() => setcurrentsection("manageusers")}>
            Manage Users
          </a>
        </div>

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
                <ChangePassword jwt={jwt} setIsOpen={setIsOpen} />
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </div>

      <div className="main-content">
        {currentSection === "dashboard" && <div>Admin Dash Placeholder</div>}
        {currentSection === "manageMajors" && <ManageMajorsSection />}
        {currentSection === "manageUsers" && <ManageUsersSection />}
      </div>
    </div>
  );
};

export default AdminDash;
