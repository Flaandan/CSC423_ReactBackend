import React, { useState } from 'react';
import ChangePassword from './ChangePassword'; 
import './Dashboard.css';

const TeacherDashboard2 = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentSection, setCurrentSection] = useState('dashboard');

  const [courses, setCourses] = useState([
    {
      id: 1,
      name: 'Intro to React',
      description: 'Learn the basics of React.',
      major: 'Computer Science',
      maxCapacity: 30,
      status: 'active',
      enrolledStudents: ['John Smith', 'Jane Doe'],
      unenrolledStudents: ['Emily Clark', 'Michael Scott'],
    },
    {
      id: 2,
      name: 'Data Structures',
      description: 'Understanding data structures.',
      major: 'Computer Science',
      maxCapacity: 25,
      status: 'inactive',
      enrolledStudents: ['John Doe'],
      unenrolledStudents: ['Sam Wilson', 'Tony Stark'],
    },
  ]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const handleCourseStatusChange = (courseId) => {
    setCourses(courses.map(course =>
      course.id === courseId
        ? { ...course, status: course.status === 'active' ? 'inactive' : 'active' }
        : course
    ));
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    const newCourse = {
      id: courses.length + 1,
      name: e.target.courseName.value,
      description: e.target.description.value,
      major: e.target.major.value,
      maxCapacity: parseInt(e.target.maxCapacity.value, 10),
      status: 'active', 
      enrolledStudents: [],
      unenrolledStudents: [],
    };
    setCourses([...courses, newCourse]);
    e.target.reset(); 
    setCurrentSection('dashboard'); 
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <button onClick={toggleSidebar} className="toggle-sidebar">
          {sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
        </button>
        {sidebarOpen && (
          <ul>
            <li onClick={() => handleSectionChange('dashboard')}>Dashboard</li>
            <li onClick={() => handleSectionChange('addCourse')}>Add New Course</li>
            <li onClick={() => handleSectionChange('studentRegistrations')}>View Student Registrations</li>
            <li onClick={() => handleSectionChange('changePassword')}>Change Password</li>
          </ul>
        )}
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="header">
          <h1>Teacher Dashboard</h1>
        </div>

        {/* Render Current Section */}
        {currentSection === 'dashboard' && (
          <div>
            <h2>My Courses</h2>
            <table className="course-table">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Description</th>
                  <th>Major</th>
                  <th>Max Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id}>
                    <td>{course.name}</td>
                    <td>{course.description}</td>
                    <td>{course.major}</td>
                    <td>{course.maxCapacity}</td>
                    <td>{course.status}</td>
                    <td>
                      <button onClick={() => handleCourseStatusChange(course.id)}>
                        {course.status === 'active' ? 'Set Inactive' : 'Set Active'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {currentSection === 'addCourse' && (
          <div>
            <h2>Add New Course</h2>
            <form onSubmit={handleAddCourse}>
              <div className="form-group">
                <label>Course Name:</label>
                <input type="text" name="courseName" required />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <input type="text" name="description" required />
              </div>
              <div className="form-group">
                <label>Major:</label>
                <input type="text" name="major" required />
              </div>
              <div className="form-group">
                <label>Max Capacity:</label>
                <input type="number" name="maxCapacity" required />
              </div>
              <button type="submit">Add Course</button>
            </form>
          </div>
        )}

        {currentSection === 'studentRegistrations' && (
          <div>
            <h2>Student Registrations</h2>

            {/* Enrolled Students Table */}
            <h3>Enrolled Students</h3>
            <table className="registration-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Course Name</th>
                </tr>
              </thead>
              <tbody>
                {courses.flatMap(course =>
                  course.enrolledStudents.map(student => (
                    <tr key={`${student}-${course.id}`}>
                      <td>{student}</td>
                      <td>{course.name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Dropped Students Table */}
            <h3>Dropped Students</h3>
            <table className="registration-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Course Name</th>
                </tr>
              </thead>
              <tbody>
                {courses.flatMap(course =>
                  course.unenrolledStudents.map(student => (
                    <tr key={`${student}-${course.id}`}>
                      <td>{student}</td>
                      <td>{course.name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {currentSection === 'changePassword' && (
          <div>
            <h2>Change Password</h2>
            <ChangePassword setIsOpen={setCurrentSection} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard2;
