import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stylesheets/webPage.css';

const TeacherDash = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        navigate('/');
    };
    return (
        <div className="admin-dashboard">
            <div className="left-column">
                <h1>Teacher Dashboard</h1>
                {/*Place Holders*/}
                <a href="#majors">Manage Majors</a>
                <a href="#users">Manage Users</a>

                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default TeacherDash;
