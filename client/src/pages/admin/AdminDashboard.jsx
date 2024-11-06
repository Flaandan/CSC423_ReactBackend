import { Dialog, DialogPanel, DialogTitle, Description } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { JWT_KEY, useLocalState } from "../../hooks/useLocalStorage";
import { apiCheckToken } from "../../lib/api";
import { decodeJWT } from "../../utils/decodeJWT";
import ChangePassword from "../../components/changePassword";
<<<<<<< HEAD
import "../../styles/webPage.css";

const AdminDash = () => {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
=======
//import ManageMajorSection from "../../components/manageMajors";
//import ManageUsersSection from "../../components/manageUsers";

const AdminDash = () => {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
  const [isOpen, setIsOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("dashboard");

>>>>>>> 55d3ecb (added 2 components and updated admin page so they can be imported)
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
<<<<<<< HEAD
    <div className="dashboard-container">
      {/* Left Column */}
      <div className="left-column">
        <h1>Admin Dashboard</h1>
        
        {/* Main buttons */}
        <div className="main-buttons">
          <button type="button">
            Manage Users
          </button>
          <button type="button">
            Manage Courses
          </button>
          <button type="button">
            View Reports
          </button>
          <button type="button">
            System Settings
          </button>
=======
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
>>>>>>> 55d3ecb (added 2 components and updated admin page so they can be imported)
        </div>

        {/* Bottom buttons */}
        <div className="bottom-buttons">
          <button onClick={() => setIsPasswordOpen(true)} type="button">
            Change Password
          </button>
          <button onClick={handleLogout} className="logout-button" type="button">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2>Welcome to Admin Dashboard</h2>
        {/* Add admin-specific content here */}
      </div>

<<<<<<< HEAD
      {/* Change Password Dialog */}
      <Dialog open={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} className="dialog-pop">
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
=======
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
>>>>>>> 55d3ecb (added 2 components and updated admin page so they can be imported)
    </div>
  );
};

export default AdminDash;
