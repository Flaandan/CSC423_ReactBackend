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
import DroppedCourses from "../../components/DroppedCourses";

const StudentDash = () => {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
  const [isOpen, setIsOpen] = useState(false);
  const [droppedCourses, setDroppedCourses] = useState([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(JWT_KEY);
    navigate("/");
  };

  const handleChooseMajor = () => {
    console.log("Choose Major");
  };

  useEffect(() => {
    const checkToken = async () => {
      if (jwt) {
        const response = await apiCheckToken(jwt);

        if (response.error) {
          navigate("/");
        }

        const decodedRole = decodeJWT(jwt).role;

        if (decodedRole !== "STUDENT") {
          navigate(
            decodedRole === "ADMIN"
              ? "/admin"
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

  useEffect(() => {
    const fetchDroppedCourses = async () => {
      try {
        const response = await fetch('/api/dropped-courses', {
          headers: {
            'Authorization': `Bearer ${jwt}`
          }
          //TODO: Change this to the actual API endpoint HMUNN
        });
        const data = await response.json();
        setDroppedCourses(data);
      } catch (error) {
        console.error('Error fetching dropped courses:', error);
      }
    };

    if (jwt) {
      fetchDroppedCourses();
    }
  }, [jwt]);

  return (
    <div className="student-dashboard">
      <div className="left-column">
        <h1>Student Dashboard</h1>
        <div className="button-container">
          <a href="#classes">Register for Classes</a>
          <button onClick={handleLogout} className="logout-button" type="button">
            Logout
          </button>
          <button onClick={() => setIsOpen(true)} type="button">
            Change Password
          </button>
          <button onClick={handleChooseMajor} className="choose-major-button" type="button">
            Choose Major
          </button>
        </div>

        <DroppedCourses courses={droppedCourses} />

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
      </div>
    </div>
  );
};

export default StudentDash;
