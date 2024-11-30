import React from 'react';
import image1 from '/workspaces/Project_Version2/frontend/review_frontend/src/assests/exp1.png'; // Adjust the path as needed
import image2 from '/workspaces/Project_Version2/frontend/review_frontend/src/assests/exp2.png'; // Adjust the path as needed

function Analysis() {
  return (
    <div className="analysis-container">
      <h1>Analysis Results</h1>
      <div>
        <h2>Image 1</h2>
        <img src={image1} alt="Analysis Result 1" />
      </div>
      <div>
        <h2>Image 2</h2>
        <img src={image2} alt="Analysis Result 2" />
      </div>
    </div>
  );
}

export default Analysis;
