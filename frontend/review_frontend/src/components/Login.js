// src/components/Login.js
import React, { useState } from 'react';
import loginImage from '/workspaces/Project_Version2/frontend/review_frontend/src/assests/Analysis_Image.avif'; // Import the image

function Login({ setLoggedIn, setWelcomeMessage, setShowLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (username === storedUsername && password === storedPassword) {
      setWelcomeMessage(`Welcome, ${username}!`);
      setLoggedIn(true);
    } else {
      alert('Invalid username or password.');
    }
  };

  return (
    <div className="form-container">
      <h1>FAKE REVIEW MONITORING SYSTEM</h1>
      <img src={loginImage} alt="Login" className="login-image" /> {/* Use the imported image */}
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account? <span onClick={() => setShowLogin(false)}>Register here</span>
      </p>
    </div>
  );
}

export default Login;
