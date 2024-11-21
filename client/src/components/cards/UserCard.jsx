import {
  Button,
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import React, { useState } from "react";
import { customFetch } from "../../utils/customFetch";
import EditUser from "./../editForms/EditUserForm";

const UserCard = ({ users, jwt }) => {
  const [isRemoveUserOpen, setIsRemoveUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);

  const handleRemove = async (id) => {
    const params = {
      url: `http://localhost:8000/api/v1/users/${id}`,
      method: "DELETE",
      jwt,
    };

    const response = await customFetch(params);

    if (response.error) {
      alert(`${response.error}`);
      return;
    }

    alert(`${response.success}`);
    location.reload();
  };

  const handleEdit = async (id) => {
    console.log(`Editing users with id: ${id}`);
  };

  const handleListCourses = (id) => {
    console.log(`Listing courses user with id: ${id} is taking`);
  };

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>
        {users.first_name} {users.last_name}
      </h3>
      <p>
        <strong>Username:</strong> {users.username}
      </p>
      <p>
        <strong>Role:</strong> {users.role}
      </p>
      <p>
        <strong>Phone Number:</strong> {users.phone_number}
      </p>
      <p>
        <strong>Office:</strong> {users.office}
      </p>
      <p>
        <strong>Last Login:</strong> {users.last_login}
      </p>

      <div style={buttonContainerStyle}>
        <Button
          style={{ ...buttonStyle, backgroundColor: "#e74c3c" }}
          onClick={() => setIsRemoveUserOpen(true)}
        >
          Remove
        </Button>
        <Button
          style={{ ...buttonStyle, backgroundColor: "#7f8c8d" }}
          onClick={() => setIsEditUserOpen(true)}
        >
          Edit
        </Button>
        <Button
          style={{ ...buttonStyle, backgroundColor: "#7f8c8d" }}
          onClick={() => handleListCourses(users.id)}
        >
          List Courses
        </Button>
      </div>

      <Dialog
        open={isRemoveUserOpen}
        onClose={() => setIsRemoveUserOpen(false)}
        className="dialog-pop"
      >
        <div className="dialog-pop-back">
          <div className="pop-panel">
            <DialogPanel>
              <DialogTitle className="font-bold">
                Are you sure you want to remove this user?
              </DialogTitle>
              <div className="button-group">
                <Button
                  style={{ ...buttonStyle, backgroundColor: "#7f8c8d" }}
                  onClick={() => handleRemove(users.id)}
                >
                  Yes
                </Button>
                <Button
                  style={{ ...buttonStyle, backgroundColor: "#e74c3c" }}
                  onClick={() => setIsRemoveUserOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={isEditUserOpen}
        onClose={() => setIsEditUserOpen(false)}
        className="dialog-pop"
      >
        <div className="dialog-pop-back">
          <div className="pop-panel">
            <DialogPanel>
              <DialogTitle className="font-bold">Edit User</DialogTitle>
              <Description>
                This will edit the details of this User. Not all fields are
                required to be changed
              </Description>
              <EditUser jwt={jwt} setIsOpen={setIsEditUserOpen} users={users} />
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

const buttonStyle = {
  color: "white",
  border: "none",
  padding: "8px 16px",
  margin: "5px",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
};

const buttonContainerStyle = {
  marginTop: "10px",
  display: "flex",
  justifyContent: "flex-start",
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "16px",
  margin: "10px",
  backgroundColor: "#f9f9f9",
  width: "90%",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const titleStyle = {
  fontSize: "18px",
  fontWeight: "bold",
};

export default UserCard;
