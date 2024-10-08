import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popup } from 'reactjs-popup';
import './webPage.css';
import { Description, Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'

const studentDash = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleLogout = () => {
        navigate('/');
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        // Handle password change logic here 
        console.log('Current Password:', currentPassword);
        console.log('New Password:', newPassword);
        setIsOpen(false);  
    };

    return (
        <div className="student-dashboard">
            <div className="left-column">
                <h1>Student Dashboard</h1>
                <a href="#classes">Register for Classes</a>

                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>

                <button onClick={() => setIsOpen(true)}>Change Password</button>

                <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="dialog-pop">
                    <div className="fixed inset-0">
                        <DialogBackdrop className="dialog-pop-back" />
                        {/* Full-screen container to center the panel */}
                        <div className="pass-panel">
                            {/* The actual dialog panel */}
                            <DialogPanel className="pop-panel">
                                <DialogTitle className="font-bold">Change Password</DialogTitle>
                                <Description>
                                    This will update your password.
                                </Description>
                                <p>
                                    Please enter your current password to confirm and your new password.
                                </p>

                                {/* Password change form */}
                                <form onSubmit={handleChangePassword} className="password-form">
                                    <div className="form-group">
                                        <label htmlFor="currentPassword">Current Password</label>
                                        <input
                                            type="password"
                                            id="currentPassword"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="newPassword">New Password</label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button className='form-button' type="button" onClick={() => setIsOpen(false)}>Cancel</button>
                                        <button className='form-button' type="submit">Confirm</button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};
/* Casey please*/
