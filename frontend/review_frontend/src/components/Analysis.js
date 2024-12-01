import React from 'react';
import { useNavigate } from 'react-router-dom';
import '/workspaces/Project_Version2/frontend/review_frontend/src/Analysis.css'; // Import CSS for styling

function Analysis() {
  const navigate = useNavigate();

  const goBackToHome = () => {
    navigate('/');
  };

  // Image paths and titles
  const images = [
    
    { src: '/assests/Fake_Ip_Address.png', title: 'Top IP Address which are Fake with its count' },
    { src: '/assests/Top_Product_Fake.png', title: 'Top products which are Fake' },
    { src: '/assests/Top_product_title_Fake.png', title: 'Top Products Titles which are Fake' },
    { src: '/assests/Verified_Users.png', title: 'Verified User count' },
    { src: '/assests/Fake_label_count.png', title: 'Total Fake Reviews in the file' },
    { src: '/assests/Duplicate_User_IDs.png', title: 'Duplicate User IDs' },
  ];

  return (
    <div className="analysis-container">
      <h1>Analysis Results</h1>
      <div className="image-grid">
        {images.map((image, index) => (
          <div key={index} className="image-item">
            <h3>{image.title}</h3>
            <img src={image.src} alt={image.title} />
          </div>
        ))}
      </div>
      <button onClick={goBackToHome}>Go back to Home</button>
    </div>
  );
}

export default Analysis;
