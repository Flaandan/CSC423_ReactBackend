import React from "react";
import { customFetch } from "../../utils/customFetch";
import { decodeJWT } from "../../utils/decodeJWT";
const SimpleCourseCard = ({ course, jwt }) => {
  const handleDrop = async (id) => {
    const userId = decodeJWT(jwt).user_id;
    

    const params = {
      url: `http://localhost:8000/api/v1/users/${userId}/courses/${course.id}`,
      method: "DELETE",
      jwt,
    };

    const response = await customFetch(params);

    if (response.error) {
      alert(`${response.error}`);
      return;
    }

    alert(`${response.success}`);
    location.reload(); // Refresh the page or update the state to reflect changes
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
        <strong>Status:</strong> {course.status}
      </p>

      <div style={buttonContainerStyle}>
        <button
          style={{ ...buttonStyle, backgroundColor: "#e74c3c" }}
          onClick={() => handleDrop(course.id)}
        >
          Drop Course
        </button>
      </div>
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

export default SimpleCourseCard; 