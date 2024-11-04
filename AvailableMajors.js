import React, { useState } from 'react';
import './Dashboard.css';

const AvailableMajors = ({ onSelectMajor }) => {
  const majors = [
    { id: 1, name: 'Computer Science', description: 'Study of computers and algorithms.', courses: [101, 102, 103] },
    { id: 2, name: 'Mathematics', description: 'Study of numbers and patterns.', courses: [201, 202, 203] },
    { id: 3, name: 'Biology', description: 'Study of living organisms.', courses: [301, 302, 303] },
  ];

  return (
    <div className="available-majors">
      <h3>Select Major</h3>
      <div className="majors-list">
        {majors.map((major) => (
          <div key={major.id} className="major-item" onClick={() => onSelectMajor(major)}>
            {major.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableMajors;
