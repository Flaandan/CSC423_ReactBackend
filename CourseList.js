import React from 'react';
import './Dashboard.css';

const CourseList = ({ major, enrolledCourses, droppedCourses }) => {
  if (!major) {
    return <div>Select a major to view its courses.</div>;
  }

  const mockCourses = {
    101: 'Introduction to Programming',
    102: 'Data Structures',
    103: 'Algorithms',
    201: 'Calculus I',
    202: 'Linear Algebra',
    203: 'Statistics',
    301: 'Biology I',
    302: 'Genetics',
    303: 'Ecology',
  };

  const majorCourses = major.courses.map((courseId) => ({
    id: courseId,
    name: mockCourses[courseId],
  }));

  return (
    <div className="course-lists">
      <h3>Courses for {major.name}</h3>
      <div className="major-courses">
        <h4>All Courses</h4>
        <ul>
          {majorCourses.map((course) => (
            <li key={course.id}>{course.name}</li>
          ))}
        </ul>
      </div>
      <div className="enrolled-courses">
        <h4>Enrolled Courses</h4>
        <ul>
          {enrolledCourses.map((courseId) => (
            <li key={courseId}>{mockCourses[courseId]}</li>
          ))}
        </ul>
      </div>
      <div className="dropped-courses">
        <h4>Dropped Courses</h4>
        <ul>
          {droppedCourses.map((courseId) => (
            <li key={courseId}>{mockCourses[courseId]}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseList;
