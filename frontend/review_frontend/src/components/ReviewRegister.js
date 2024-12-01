import React, { useState } from 'react';

function ReviewRegister({ setShowRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleRegister = () => {
    if (username && password && email) {
      localStorage.setItem('review_username', username);
      localStorage.setItem('review_password', password);
      localStorage.setItem('review_email', email);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setShowRegister(false); // Navigate back to login after successful registration
      }, 3000);
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className="form-container">
      <h1>Review Monitoring System</h1>
      <h2>Review Registration</h2>
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
        Already have an account? <span onClick={() => setShowRegister(false)}>Login here</span>
      </p>
      {showPopup && (
        <div className="popup">
          <p>Registration successful! You can now log in.</p>
        </div>
      )}
    </div>
  );
}

export default ReviewRegister;
