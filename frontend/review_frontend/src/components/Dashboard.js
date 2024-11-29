// src/components/Dashboard.js
import React, { useState } from 'react';

function Dashboard({ welcomeMessage, setLoggedIn }) {
  const [showProfile, setShowProfile] = useState(false);
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');

  const handleLogout = () => {
    setLoggedIn(false);
  };

  const handleReset = () => {
    // Reset functionality goes here if needed
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>REVIEW MONITORING SYSTEM</h2>
        <button className="profile-button" onClick={() => setShowProfile(!showProfile)}>Profile</button>
      </header>
      <main className="dashboard-content">
        <p>{welcomeMessage}, Please upload a CSV file to continue.</p>
        <div className="upload-box">
          <input type="file" accept=".csv" />
          <div className="button-container">
            <button>Submit</button>
            <button onClick={handleReset}>Reset</button>
          </div>
        </div>
      </main>
      {showProfile && (
        <div className="profile-modal">
          <div className="profile-content">
            <h2>Profile</h2>
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Email:</strong> {email}</p>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={() => setShowProfile(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
