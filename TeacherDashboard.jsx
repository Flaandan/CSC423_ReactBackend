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
import { apiChangePassword, apiCheckToken, apiCreateCourse } from "../../lib/api"; // Assuming apiCreateCourse exists
import { decodeJWT } from "../../utils/decodeJWT";
import ChangePassword from "../../components/changePassword";

const TeacherDash = () => {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    major: "",
    maxCapacity: "",
  });

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

  // Updated handleCreateCourse to pass JWT token
const handleCreateCourse = async () => {
  const response = await apiCreateCourse(jwt, courseData); // Include JWT here
  if (!response.error) {
    alert("Course created successfully!");
    setIsCreateCourseOpen(false); // Close the dialog
    setCourseData({ name: "", description: "", major: "", maxCapacity: "" }); // Reset the form
  } else {
    alert("Failed to create course. Please try again.");
  }
};


  return (
    <div className="teacher-dashboard">
      <div className="left-column">
        <h1>Teacher Dashboard</h1>
        <button onClick={handleLogout} className="logout-button" type="button">
          Logout
        </button>

        <button onClick={() => setIsOpen(true)} type="button">
          Change Password
        </button>

        <button onClick={() => setIsCreateCourseOpen(true)} type="button">
          Create Course
        </button>

        {/* Change Password Dialog */}
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="dialog-pop">
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

        {/* Create Course Dialog */}
        <Dialog open={isCreateCourseOpen} onClose={() => setIsCreateCourseOpen(false)} className="dialog-pop">
          <div className="dialog-pop-back">
            <div className="pop-panel">
              <DialogPanel>
                <DialogTitle className="font-bold">Create Course</DialogTitle>
                <Description>Enter course details below:</Description>
                <form onSubmit={(e) => { e.preventDefault(); handleCreateCourse(); }}>
                  <input
                    type="text"
                    placeholder="Course Name"
                    value={courseData.name}
                    onChange={(e) => setCourseData({ ...courseData, name: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={courseData.description}
                    onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Major"
                    value={courseData.major}
                    onChange={(e) => setCourseData({ ...courseData, major: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Max Capacity"
                    value={courseData.maxCapacity}
                    onChange={(e) => setCourseData({ ...courseData, maxCapacity: e.target.value })}
                    required
                  />
                  <button type="submit">Create Course</button>
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
