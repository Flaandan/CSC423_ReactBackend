import React, { useState } from 'react';
import './Login.css';
import BrockportLogo from '/BrockportLogo.jpg';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (username === 'admin' && password === 'admin') {
            navigate('/adminDash');
        } else {
            alert('Invalid username or password');
        }
    };

    const handleForgotPassword = () => {

        console.log('Redirect to forgot password page');
    };

    return (
        <div className="container">
            <form onSubmit={handleLogin} className="form">
                <img src={BrockportLogo} alt="Brockport Logo" />
                <h2 class="DarkBlue-text">Sign In:</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                />
                <button type="submit" className="loginButton">
                    Login
                </button>

                <div className="buttonContainer">
                    <button onClick={handleForgotPassword} className="bottomButtons">
                        Forgot Password
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;
