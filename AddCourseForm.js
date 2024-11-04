import React, { useState } from 'react';
import './Dashboard.css';

const AddCourseForm = ({ onClose, onAddCourse }) => {
  const [formData, setFormData] = useState({
    courseName: '',
    description: '',
    majors: '',
    teacherId: '',
    maxCapacity: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCourse = {
      ...formData,
      id: Date.now(),
      majors: formData.majors.split(',').map((id) => id.trim()),
      currentEnrollment: 0,
      enrolledStudents: [],
      droppedStudents: [],
      lastUpdated: new Date().toISOString(),
    };
    onAddCourse(newCourse);
    onClose();
  };

  return (
    <div className="form-modal">
      <h3>Add New Course</h3>
      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-group">
          <label>Course Name:</label>
          <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Majors (comma-separated IDs):</label>
          <input type="text" name="majors" value={formData.majors} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Teacher ID:</label>
          <input type="number" name="teacherId" value={formData.teacherId} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Max Capacity:</label>
          <input type="number" name="maxCapacity" value={formData.maxCapacity} onChange={handleChange} required />
        </div>
        <button type="submit" className="submit-button">Add Course</button>
        <button type="button" onClick={onClose} className="close-button">Cancel</button>
      </form>
    </div>
  );
};

export default AddCourseForm;
