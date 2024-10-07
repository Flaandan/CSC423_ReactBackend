import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popup } from 'reactjs-popup';
import './webPage.css';



const studentDash = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        navigate('/');
    };
    const handleChangePass = () => {}
    /* I want to add all the functional buttons to the side column, main page
     * should be used for displaying the interaction information*/
    return (
        <div className="student-dashboard">
            <div className="left-column">
                <h1>Student Dashboard</h1>
                {/*Place Holders*/}
                <a href="#classes">Regiester for Classes</a>
                

                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>

                {/*
                    <div>
                    <button onClick={() => setOpen(true)}>Open Popup</button>
                    <Popup open={open} onClose={() => setOpen(false)}>
                        <div>
                        <h2>Popup Title</h2>
                        <p>Popup content</p>
                        </div>
                    </Popup>
                    </div>
                */}
            </div>
            </div>
   
    );
};

export default studentDash;
