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
import AvailableCourses from "../../components/AvailableCourses";

const StudentDash = () => {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isDroppedOpen, setIsDroppedOpen] = useState(false);
  const [isAvailableOpen, setIsAvailableOpen] = useState(false);
  const [droppedCourses, setDroppedCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [studentMajor, setStudentMajor] = useState('');

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

      {/* Main Content */}
      <div className="main-content">  
        <h2>Welcome to Your Dashboard</h2>
        {/* Add any additional content, widgets, or information here */}
      </div>

      {/* Left Column */}
      <div className="left-column">
        {/* Student Dashboard Header */}
        <h1>Student Dashboard</h1>
<<<<<<< HEAD

        {/* Main buttons */}
        <div className="main-buttons">
          <button onClick={() => setIsAvailableOpen(true)} type="button">
            Register for Classes
=======
        <div className="button-container">
          <a href="#classes">Register for Classes</a>
          <button
            onClick={handleLogout}
            className="logout-button"
            type="button"
          >
            Logout
>>>>>>> 55d3ecb (added 2 components and updated admin page so they can be imported)
          </button>

          <button onClick={() => setIsDroppedOpen(true)} type="button">
            View Dropped Courses
          </button>
<<<<<<< HEAD

          <button onClick={handleChooseMajor} className="choose-major-button" type="button">
=======
          <button
            onClick={handleChooseMajor}
            className="choose-major-button"
            type="button"
          >
>>>>>>> 55d3ecb (added 2 components and updated admin page so they can be imported)
            Choose Major
          </button>
        </div>

        {/* Bottom buttons */}
        <div className="bottom-buttons">
          <button onClick={() => setIsPasswordOpen(true)} type="button">
            Change Password
          </button>

<<<<<<< HEAD
          <button onClick={handleLogout} className="logout-button" type="button">
            Logout
          </button>
        </div>

        {/* Available Courses Dialog */}
        <Dialog open={isAvailableOpen} onClose={() => setIsAvailableOpen(false)} className="dialog-pop">
          <div className="dialog-pop-back">
            <div className="pop-panel">
              <DialogPanel>
                <DialogTitle className="font-bold">Available Courses</DialogTitle>
                <Description>Courses available for registration</Description>
                <AvailableCourses 
                  courses={availableCourses.map(course => ({
                    ...course,
                    onRegister: handleCourseRegistration
                  }))} 
                  studentMajor={studentMajor}
                />
                <button 
                  onClick={() => setIsAvailableOpen(false)}
                  className="close-button"
                  type="button"
                >
                  Close
                </button>
              </DialogPanel>
            </div>
          </div>
        </Dialog>

        {/* Dropped Courses Dialog */}
        <Dialog open={isDroppedOpen} onClose={() => setIsDroppedOpen(false)} className="dialog-pop">
          <div className="dialog-pop-back">
            <div className="pop-panel">
              <DialogPanel>
                <DialogTitle className="font-bold">Dropped Courses</DialogTitle>
                <Description>Your dropped course history</Description>
                <DroppedCourses courses={droppedCourses} />
                <button 
                  onClick={() => setIsDroppedOpen(false)}
                  className="close-button"
                  type="button"
                >
                  Close
                </button>
              </DialogPanel>
            </div>
          </div>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} className="dialog-pop">
=======
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="dialog-pop"
        >
>>>>>>> 55d3ecb (added 2 components and updated admin page so they can be imported)
          <div className="dialog-pop-back">
            <div className="pop-panel">
              <DialogPanel>
                <DialogTitle className="font-bold">Change Password</DialogTitle>
                <Description>This will update your password.</Description>
<<<<<<< HEAD
                <ChangePassword jwt={jwt} setIsOpen={setIsPasswordOpen} />
=======
                <ChangePassword jwt={jwt} setIsOpen={setIsOpen} />
>>>>>>> 55d3ecb (added 2 components and updated admin page so they can be imported)
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default StudentDash;
