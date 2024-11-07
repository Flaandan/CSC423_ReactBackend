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
import { apiCheckToken } from "../../lib/api";
import { decodeJWT } from "../../utils/decodeJWT";
import ChangePassword from "../../components/changePassword";
import DroppedCourses from "../../components/DroppedCourses";
import AvailableCourses from "../../components/AvailableCourses";

const StudentDash = () => {
  const [jwt] = useLocalState("", JWT_KEY);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [droppedCourses, setDroppedCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [studentMajor, setStudentMajor] = useState('');
  const [currentView, setCurrentView] = useState('welcome');

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
        const response = await fetch("/api/dropped-courses", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          //TODO: Change this to the actual API endpoint HMUNN
        });
        const data = await response.json();
        setDroppedCourses(data);
      } catch (error) {
        console.error("Error fetching dropped courses:", error);
      }
    };

    if (jwt) {
      fetchDroppedCourses();
    }
  }, [jwt]);

  useEffect(() => {
    const fetchAvailableCourses = async () => {
      try {
        const response = await fetch('/api/available-courses', {
          headers: {
            'Authorization': `Bearer ${jwt}`
          }
        });
        const data = await response.json();
        setAvailableCourses(data);
      } catch (error) {
        console.error('Error fetching available courses:', error);
      }
    };

    const fetchStudentMajor = async () => {
      try {
        const response = await fetch('/api/student/major', {
          headers: {
            'Authorization': `Bearer ${jwt}`
          }
        });
        const data = await response.json();
        setStudentMajor(data.major);
      } catch (error) {
        console.error('Error fetching student major:', error);
      }
    };

    if (jwt) {
      fetchAvailableCourses();
      fetchStudentMajor();
    }
  }, [jwt]);

  const handleCourseRegistration = async (courseId) => {
    try {
      const response = await fetch('/api/register-course', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId })
      });
      
      if (response.ok) {
        // Refresh available courses after registration
        fetchAvailableCourses();
      }
    } catch (error) {
      console.error('Error registering for course:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Left Column */}
      <div className="left-column">
        <h1>Student Dashboard</h1>
        {/* Main buttons */}
        <div className="main-buttons">
          <button onClick={() => setCurrentView('available')} type="button">
            Available Classes
          </button>
          <button onClick={() => setCurrentView('dropped')} type="button">
            Dropped Courses
          </button>
          <button onClick={handleChooseMajor} className="choose-major-button" type="button">
            Choose Major
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
        {currentView === 'available' && (
          <div>
            <h2>Available Courses</h2>
            <AvailableCourses 
              courses={availableCourses.map(course => ({
                ...course,
                onRegister: handleCourseRegistration
              }))} 
              studentMajor={studentMajor}
            />
          </div>
        )}

        {currentView === 'dropped' && (
          <div>
            <h2>Dropped Courses</h2>
            <DroppedCourses courses={droppedCourses} />
          </div>
        )}

        {currentView === 'welcome' && (
          <div>
            <h2>Welcome to Your Dashboard</h2>
            {/* Add default dashboard content here */}
          </div>
        )}
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

export default StudentDash;
