import React from 'react';

const DroppedCourses = ({ courses }) => {
  if (!courses || courses.length === 0) {
    return (
      <div className="dropped-courses-container">
        <h2>Dropped Courses</h2>
        <p>No dropped courses to display.</p>
      </div>
    );
  }

  return (
    <div className="dropped-courses-container">
      <h2>Dropped Courses</h2>
      <div className="courses-list">
        {courses.map((course) => (
          <div key={course.id} className="course-item">
            <h3>{course.courseName}</h3>
            <p>Course Code: {course.courseCode}</p>
            <p>Dropped Date: {new Date(course.droppedDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DroppedCourses;