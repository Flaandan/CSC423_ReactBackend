import {
  Button,
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { customFetch } from "../../utils/customFetch";

const MajorCourseCard = ({ course, jwt }) => {
  const [isListStudentsOpen, setIsListStudentsOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleListStudents = async (id) => {
    const params = {
      url: `http://localhost:8000/api/v1/courses/${id}/users`,
      method: "GET",
      jwt,
    };

    const response = await customFetch(params);

    if (response.error) {
      setErrorMessage(response.error);
      return;
    }

    setStudents(response.users || []);
    setIsListStudentsOpen(true);
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
        <Button
          style={{ ...buttonStyle, backgroundColor: "#3498db" }}
          onClick={() => handleListStudents(course.id)}
        >
          List Students
        </Button>
      </div>

      {/* List Students Dialog */}
      <Dialog
        open={isListStudentsOpen}
        onClose={() => setIsListStudentsOpen(false)}
        className="dialog-pop"
      >
        <div className="dialog-pop-back">
          <div className="pop-panel">
            <DialogPanel>
              <DialogTitle className="font-bold">Active Students</DialogTitle>
              {errorMessage ? (
                <p style={{ color: "red" }}>{errorMessage}</p>
              ) : students.length > 0 ? (
                <ul>
                  {students.map((student) => (
                    <li key={student.id}>
                      {student.first_name} {student.last_name} - {student.email}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No active students found.</p>
              )}
              <Button
                style={{ ...buttonStyle, backgroundColor: "#e74c3c" }}
                onClick={() => setIsListStudentsOpen(false)}
              >
                Close
              </Button>
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

export default MajorCourseCard;
