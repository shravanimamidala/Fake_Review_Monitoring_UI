import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReviewRegister from './ReviewRegister';

function ReviewLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  // List of blocked usernames
  const blockedUsers = ['User23', 'Bot23', 'User123'];

  const handleLogin = () => {
    // Check if the username is in the list of blocked users
    if (blockedUsers.includes(username)) {
      alert('User Blocked. Please contact administrator.');
      return;
    }

    const storedUsername = localStorage.getItem('review_username');
    const storedPassword = localStorage.getItem('review_password');

    if (username === storedUsername && password === storedPassword) {
      navigate('/review-creation');
    } else {
      alert('Invalid username or password.');
    }
  };

  return showRegister ? (
    <ReviewRegister setShowRegister={setShowRegister} />
  ) : (
    <div className="form-container">
      <h1>Review Monitoring System</h1>
      <h2>Review Login</h2>
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
        Don't have an account? <span onClick={() => setShowRegister(true)}>Register here</span>
      </p>
    </div>
  );
}

export default ReviewLogin;
