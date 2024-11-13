import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React, { useState } from "react";
import { customFetch } from "../utils/customFetch";

const CourseCard = ({ course, jwt }) => {
  const [isRemoveCourseOpen, setIsRemoveCourseOpen] = useState(false);

  const handleRemove = async (id) => {
    const params = {
      url: `http://localhost:8000/api/v1/courses/${id}`,
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
    console.log(`Editing course with id: ${id}`);
  };

  const handleListStudents = (id) => {
    console.log(`Listing students for course with id: ${id}`);
  };

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>
        {course.course_discipline} - {course.course_number}
      </h3>
      <p>
        <strong>Description:</strong> {course.description}
      </p>
      <p>
        <strong>Max Capacity:</strong> {course.max_capacity}
      </p>
      <p>
        <strong>Current Enrollment:</strong> {course.current_enrollment}
      </p>
      <p>
        <strong>Status:</strong> {course.status}
      </p>

      <div style={buttonContainerStyle}>
        {course.status === "ACTIVE" ? (
          <>
            <Button
              style={{ ...buttonStyle, backgroundColor: "#e74c3c" }}
              onClick={() => setIsRemoveCourseOpen(true)}
            >
              Remove
            </Button>
            <Button
              style={{ ...buttonStyle, backgroundColor: "#7f8c8d" }}
              onClick={() => handleEdit(course.id)}
            >
              Edit
            </Button>
            <Button
              style={{ ...buttonStyle, backgroundColor: "#7f8c8d" }}
              onClick={() => handleListStudents(course.id)}
            >
              List Students
            </Button>
          </>
        ) : (
          <Button
            style={{ ...buttonStyle, backgroundColor: "#7f8c8d" }}
            onClick={() => handleEdit(course.id)}
          >
            Edit
          </Button>
        )}
      </div>

      <Dialog
        open={isRemoveCourseOpen}
        onClose={() => setIsRemoveCourseOpen(false)}
        className="dialog-pop"
      >
        <div className="dialog-pop-back">
          <div className="pop-panel">
            <DialogPanel>
              <DialogTitle className="font-bold">
                Are you sure you want to remove this Course?
              </DialogTitle>
              <div className="button-group">
                <Button
                  style={{ ...buttonStyle, backgroundColor: "#7f8c8d" }}
                  onClick={() => handleRemove(course.id)}
                >
                  Yes
                </Button>
                <Button
                  style={{ ...buttonStyle, backgroundColor: "#e74c3c" }}
                  onClick={() => setIsRemoveCourseOpen(false)}
                >
                  Cancel
                </Button>
              </div>
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

export default CourseCard;
