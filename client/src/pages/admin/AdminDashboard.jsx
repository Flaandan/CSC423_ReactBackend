import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangePassword from "../../components/changePassword";
import ViewMajors from "../../components/ViewMajors";
import { JWT_KEY, useLocalState } from "../../hooks/useLocalStorage";
import { apiCheckToken } from "../../lib/api";
import { decodeJWT } from "../../utils/decodeJWT";
import "../../styles/webPage.css";

const AdminDash = () => {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("ViewMajors"); // Track active view

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

        if (response?.error) {
          navigate("/");
        }

        const decodedRole = decodeJWT(jwt).user_role;

        if (decodedRole !== "ADMIN") {
          navigate(
            decodedRole === "STUDENT"
              ? "/student"
              : decodedRole === "TEACHER"
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

  // Render different content based on the activeComponent state
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "viewUser":
        return <ViewUser />;
      case "addUser":
        return <AddUser />;
      case "addMajor":
        return <AddMajor />;
      default:
        return <ViewMajors />;
    }
  };
  return (
    <div className="admin-dashboard">
      <div className="left-column">
        <h1>Admin Dashboard</h1>

        {/* Main buttons */}
        <div className="main-buttons">
          <button
            type="button"
            onClick={() => setActiveComponent("viewMajors")}
          >
            View Majors
          </button>
          <button type="button" onClick={() => setActiveComponent("addMajor")}>
            Add Majors
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveComponent("viewUser");
            }}
          >
            View Users
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveComponent("addUser");
            }}
          >
            Add Users
          </button>
        </div>

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

export default AdminDash;
