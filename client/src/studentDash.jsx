import React, { useState } from 'react';
import './webPage.css';


const StudentDash = () => {
    const handleLogout = () => {
        navigate('/');
    };
    return (
        <div>
            <h1>Student Dashboard</h1>
            <p>Welcome to the Student Dashboard!</p>
        </div>
    );
};

export default StudentDash;
