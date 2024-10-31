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

const TeacherDash = () => {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className="admin-dashboard">
      <div className="left-column">
        <h1>Teacher Dashboard</h1>
        {/* Placeholder for other links or elements */}

        <button onClick={handleLogout} className="logout-button" type="button">
          Logout
        </button>

        <button onClick={() => setIsOpen(true)} type="button">
          Change Password
        </button>

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

export default TeacherDash;