import React, { useState } from 'react';

function LoginPage() {

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
	<button onClick={handleCreateAccount} className="bottomButtons">
	  Create Account
	 </button>
	 <button onClick={handleForgotPassword} className="bottomButtons">
	  Forgot Password
	 </button>
	</div>
      </form>
    </div>
  );
}

export default LoginPage;
