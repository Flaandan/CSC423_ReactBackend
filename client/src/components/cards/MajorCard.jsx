import {
  Button,
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import React, { useState } from "react";
import { customFetch } from "../../utils/customFetch";
import EditMajor from "./../forms/EditMajorForm";

const MajorCard = ({ major, jwt }) => {
  const [isRemoveMajorOpen, setIsRemoveMajorOpen] = useState(false);
  const [isEditMajorOpen, setIsEditMajorOpen] = useState(false);

  const handleRemove = async (id) => {
    const params = {
      url: `http://localhost:8000/api/v1/majors/${id}`,
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
    console.log(`Editing majors with id: ${id}`);
  };

  const handleListCourses = (id) => {
    console.log(`Listing courses for major with id: ${id}`);
  };

  const handleListStudents = (id) => {
    console.log(`Listing students for course with id: ${id}`);
  };

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>{major.name}</h3>
      <p>
        <strong>Description:</strong> {major.description}
      </p>

      <div style={buttonContainerStyle}>
        <Button
          style={{ ...buttonStyle, backgroundColor: "#e74c3c" }}
          onClick={() => setIsRemoveMajorOpen(true)}
        >
          Remove
        </Button>
        <Button
          style={{ ...buttonStyle, backgroundColor: "#7f8c8d" }}
          onClick={() => setIsEditMajorOpen(true)}
        >
          Edit
        </Button>
        <Button
          style={{ ...buttonStyle, backgroundColor: "#7f8c8d" }}
          onClick={() => handleListCourses(course.id)}
        >
          List Courses
        </Button>
      </div>

      <Dialog
        open={isRemoveMajorOpen}
        onClose={() => setIsRemoveMajorOpen(false)}
        className="dialog-pop"
      >
        <div className="dialog-pop-back">
          <div className="pop-panel">
            <DialogPanel>
              <DialogTitle className="font-bold">
                Are you sure you want to remove this Major?
              </DialogTitle>
              <div className="button-group">
                <Button
                  style={{ ...buttonStyle, backgroundColor: "#7f8c8d" }}
                  onClick={() => handleRemove(major.id)}
                >
                  Yes
                </Button>
                <Button
                  style={{ ...buttonStyle, backgroundColor: "#e74c3c" }}
                  onClick={() => setIsRemoveMajorOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={isEditMajorOpen}
        onClose={() => setIsEditMajorOpen(false)}
        className="dialog-pop"
      >
        <div className="dialog-pop-back">
          <div className="pop-panel">
            <DialogPanel>
              <DialogTitle className="font-bold">Edit Major</DialogTitle>
              <Description>
                This will edit the details of this Major. Not all fields are
                required to be changed
              </Description>
              <EditMajor
                jwt={jwt}
                setIsOpen={setIsEditMajorOpen}
                major={major}
              />
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

export default MajorCard;
