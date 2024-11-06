import { Dialog, DialogPanel, DialogTitle, Description } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { JWT_KEY, useLocalState } from "../../hooks/useLocalStorage";
import { apiCheckToken } from "../../lib/api";
import { decodeJWT } from "../../utils/decodeJWT";
import ChangePassword from "../../components/changePassword";
import "../../styles/webPage.css";

const AdminDash = () => {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
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

export default AdminDash;
