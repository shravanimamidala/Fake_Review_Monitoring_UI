import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard({ welcomeMessage, setLoggedIn }) {
  const [showProfile, setShowProfile] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');

  const handleLogout = () => {
    setLoggedIn(false);
  };

  const handleReset = () => {
    setFile(null);
    setUploadMessage('');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage(''); // Clear any previous message when a new file is selected
  };

  const handleSubmit = async () => {
    if (file) {
      // Validate file type
      const validTypes = ['text/csv', 'application/vnd.ms-excel'];
      if (!validTypes.includes(file.type)) {
        setUploadMessage('Invalid input. Please upload a CSV file.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('https://curly-doodle-r75664pjpqx39j4-5000.app.github.dev/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setUploadMessage(response.data.message);
      } catch (error) {
        setUploadMessage(`Error uploading file: ${error.message}`);
      }
    } else {
      setUploadMessage('Please select a file to upload');
    }
  };

  const handleShowAnalysis = () => {
    // Redirect to analysis page
    navigate('/analysis');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>REVIEW MONITORING SYSTEM</h1>
        <button className="profile-button" onClick={() => setShowProfile(!showProfile)}>Profile</button>
      </header>
      <main className="dashboard-content">
        <p>{welcomeMessage}, Please upload a CSV file to continue.</p>
        <div className="upload-box">
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <div className="button-container">
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={handleReset}>Reset</button>
          </div>
          {uploadMessage && <p>{uploadMessage}</p>}
          {uploadMessage === "File uploaded successfully" && (
            <button onClick={handleShowAnalysis}>Show Analysis</button>
          )}
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
