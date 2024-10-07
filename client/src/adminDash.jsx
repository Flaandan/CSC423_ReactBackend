import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './webPage.css';


const AdminDash = () => {

    const [majors, setMajors] = useState([]);
    const [users, setUsers] = useState([]);
    const [majorInput, setMajorInput] = useState('');
    const [userInput, setUserInput] = useState('');
    const navigate = useNavigate();

    const addMajor = () => {
        //place holder for add major
    };
    const deleteMajor = (id) => {
        //place holder for delete major
    };
    const updateMajor = (id, newName) => {
        //place holder for updateMajor
    };
    const addUser = () => {
        //place holder for addUser
    };
    const deleteUser = (id) => {
        //place holder for deleteUser
    };
    const updateUser = (id, newName) => {
        //place holder for UpdateUser 
    };
    const handleLogout = () => {
        navigate('/');
    };
    /* I want to add all the functional buttons to the side column, main page
     * should be used for displaying the interaction information*/
    return (
        <div className="admin-dashboard">
            <div className="left-column">
                <h1>Admin Dashboard</h1>
                {/*Place Holders*/}
                <a href="#majors">Manage Majors</a>
                <a href="#users">Manage Users</a>

                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>

                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>

            <div className="main-content">
                <section id="majors">
                    <h2>Add Majors</h2>
                    <input
                        type="text"
                        placeholder="Add Major"
                        value={majorInput}
                        onChange={(e) => setMajorInput(e.target.value)}
                    />
                    <button onClick={addMajor}>Add Major</button>

                    <ul>
                        {majors.map((major) => (
                            <li key={major.id}>
                                <input
                                    type="text"
                                    value={major.name}
                                    onChange={(e) => updateMajor(major.id, e.target.value)}
                                />
                                <button onClick={() => deleteMajor(major.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </section>

                <section id="users">
                    <h2>Add Users</h2>
                    <input
                        type="text"
                        placeholder="Add User"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                    />
                    <button onClick={addUser}>Add User</button>

                    <ul>
                        {users.map((user) => (
                            <li key={user.id}>
                                <input
                                    type="text"
                                    value={user.name}
                                    onChange={(e) => updateUser(user.id, e.target.value)}
                                />
                                <button onClick={() => deleteUser(user.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default AdminDash;
