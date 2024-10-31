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

const AdminDash = () => {
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

  /* I want to add all the functional buttons to the side column, main page
   * should be used for displaying the interaction information*/
  return (
    <div className="student-dashboard">
      <div className="left-column">
        <h1>Admin Dashboard</h1>
        {/*Place Holders*/}
        <a href="#majors">Manage Majors</a>
        <a href="#users">Manage Users</a>

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

export default AdminDash;
