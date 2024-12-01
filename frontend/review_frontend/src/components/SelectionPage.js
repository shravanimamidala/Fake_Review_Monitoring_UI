import React from 'react';
import { useNavigate } from 'react-router-dom';
import titleImage from '/workspaces/Project_Version2/frontend/review_frontend/src/assests/SelectionPage_Logo.png'; // Adjust the path as needed
import '/workspaces/Project_Version2/frontend/review_frontend/src/SelectionPage.css'; // Import the CSS file for styling

function SelectionPage() {
  const navigate = useNavigate();

  return (
    <div className="selection-container">
      <h1>
        <h3>FAKE PRODUCT REVIEW MONITORING SYSTEM</h3>
        <img src={titleImage} alt="Title" className="title-image" /> 
      </h1>
      <button className="styled-button" onClick={() => navigate('/review-login')}>
        CLICK HERE IF YOU WANT TO WRITE A REVIEW
      </button>
      <button className="styled-button" onClick={() => navigate('/login')}>
        CLICK HERE IF YOU WANT TO MAKE REVIEW ANALYSIS
      </button>
    </div>
  );
}

export default SelectionPage;
