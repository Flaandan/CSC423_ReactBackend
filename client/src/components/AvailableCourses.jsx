import React from 'react';

const AvailableCourses = ({ courses, studentMajor }) => {
  if (!courses || courses.length === 0) {
    return (
      <div className="available-courses-container">
        <h2>Available Courses for {studentMajor}</h2>
        <p>No available courses found for your major.</p>
      </div>
    );
  }

  return (
    <div className="available-courses-container">
      <h2>Available Courses for {studentMajor}</h2>
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-header">
              <h3>{course.courseName}</h3>
              <span className="course-code">{course.courseCode}</span>
            </div>
            <div className="course-details">
              <p><strong>Credits:</strong> {course.credits}</p>
              <p><strong>Professor:</strong> {course.instructor}</p>
              <p><strong>Schedule:</strong> {course.schedule}</p>
              <p><strong>Available Seats:</strong> {course.availableSeats}</p>
            </div>
            <button 
              className="register-button"
              disabled={course.availableSeats === 0}
              onClick={() => course.onRegister(course.id)}
            >
              {course.availableSeats === 0 ? 'Class Full' : 'Register'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableCourses;