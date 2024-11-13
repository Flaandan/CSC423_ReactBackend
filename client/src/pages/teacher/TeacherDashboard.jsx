import { Dialog, DialogPanel, DialogTitle, Description } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { JWT_KEY, useLocalState } from "../../hooks/useLocalStorage";
import { apiCheckToken } from "../../lib/api";
import { decodeJWT } from "../../utils/decodeJWT";
import ChangePassword from "../../components/changePassword";
import ViewCourses from "../../components/ViewCourses";
import CourseManagement from "../../components/CourseManagement";
import "../../styles/webPage.css";

const TeacherDash = () => {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("home"); // Track active view
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(JWT_KEY);
    navigate("/");
  };

  useEffect(() => {
    const checkToken = async () => {
      if (jwt) {
        const response = await apiCheckToken(jwt);

        if (response.error) {
          navigate("/");
        }

        const decodedRole = decodeJWT(jwt).role;

        if (decodedRole !== "INSTRUCTOR") {
          navigate(
            decodedRole === "ADMIN"
              ? "/admin"
              : decodedRole === "STUDENT"
                ? "/student"
                : "/",
          );
        }
      } else {
        navigate("/");
      }
    };

    checkToken();
  }, [jwt, navigate]);

  // Render different content based on the activeComponent state
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "viewCourses":
        return <ViewCourses />;
      case "courseManagement":
        return <CourseManagement />;
      default:
        return <h2>Welcome to Teacher Dashboard</h2>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Left Column */}
      <div className="left-column">
        <h1>Teacher Dashboard</h1>
        
        {/* Main buttons */}
        <div className="main-buttons">
          <button type="button" onClick={() => setActiveComponent("viewCourses")}>
            View My Courses
          </button>
          <button type="button" onClick={() => setActiveComponent("courseManagement")}>
            Course Management
          </button>
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
        {renderActiveComponent()}
      </div>

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
    </div>
  );
};

export default TeacherDash;
