// src/components/Register.js
import React, { useState } from 'react';
import RegisterImage from '/workspaces/Project_Version2/frontend/review_frontend/src/assests/Register_image.jpg'; // Import the image

function Register({ setShowLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State for displaying the popup

  const handleRegister = () => {
    if (username && password && email) {
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      localStorage.setItem('email', email);
      setShowPopup(true); // Show the popup
      setTimeout(() => {
        setShowPopup(false); // Hide the popup after 3 seconds
        setShowLogin(true);
      }, 3000); // Adjust the delay as needed
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className="form-container">
      <img src={RegisterImage} alt="Login" className="register-image" /> {/* Use the custom class */}
      <h4>Register</h4>
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
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <p>
        Already have an account? <span onClick={() => setShowLogin(true)}>Login here</span>
      </p>
      {showPopup && (
        <div className="popup">
          <p>Registration successful! You can now log in.</p>
        </div>
      )}
    </div>
  );
}

export default Register;
