import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ViewCourses from "../../components/ViewCourses";
import EnrolledCourses from "../../components/EnrolledCourses";
import ChangePassword from "../../components/changePassword";
import { JWT_KEY, useLocalState } from "../../hooks/useLocalStorage";
import { apiCheckToken } from "../../lib/api";
import { decodeJWT } from "../../utils/decodeJWT";
import "../../styles/webPage.css";
import DroppedCourses from "../../components/DroppedCourses";
import RegisterCourses from "../../components/RegisterCourses";
import ChooseMajor from "../../components/ChooseMajor";

const StudentDash = () => {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("viewCourses");
  const [courseView, setCourseView] = useState("current");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(JWT_KEY);
    navigate("/");
  };

  useEffect(() => {
    const checkToken = async () => {
      if (jwt) {
        const response = await apiCheckToken(jwt);

        if (response?.error) {
          navigate("/");
        }

        const decodedRole = decodeJWT(jwt).user_role;

        if (decodedRole !== "STUDENT") {
          navigate(
            decodedRole === "TEACHER"
              ? "/teacher"
              : decodedRole === "ADMIN"
                ? "/admin"
                : "/",
          );
        }
      } else {
        navigate("/");
      }
    };

    checkToken();
  }, [jwt, navigate]);

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "viewCourses":
        return (
          <div>
            <div className="course-view-buttons">
              <button
                type="button"
                className={`view-button ${courseView === "current" ? "active" : ""}`}
                onClick={() => setCourseView("current")}
              >
                Current Courses
              </button>
              <button
                type="button"
                className={`view-button ${courseView === "dropped" ? "active" : ""}`}
                onClick={() => setCourseView("dropped")}
              >
                Dropped Courses
              </button>
            </div>
            {courseView === "current" ? (
              <EnrolledCourses jwt={jwt} />
            ) : (
              <DroppedCourses jwt={jwt} />
            )}
          </div>
        );
      case "registerCourses":
        return <RegisterCourses jwt={jwt} />;
      case "chooseMajor":
        return <ChooseMajor jwt={jwt} />;
      default:
        return <h2>Welcome to Student Dashboard</h2>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Left Column */}
      <div className="left-column">
        <h1>Student Dashboard</h1>

        {/* Main buttons */}
        <div className="main-buttons">
          <button
            type="button"
            onClick={() => setActiveComponent("registerCourses")}
          >
            Register for Courses
          </button>
          <button
            type="button"
            onClick={() => setActiveComponent("viewCourses")}
          >
            View My Courses
          </button>
          <button
            type="button"
            onClick={() => setActiveComponent("chooseMajor")}
          >
            Choose Major
          </button>
        </div>

        {/* Bottom buttons */}
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

      {/* Main Content */}
      <div className="main-content">{renderActiveComponent()}</div>

      {/* Change Password Dialog */}
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

export default StudentDash;
