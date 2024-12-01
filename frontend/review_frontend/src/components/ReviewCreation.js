import React, { useState } from 'react';
import StarRating from './StarRating';
import { useNavigate } from 'react-router-dom'
import '/workspaces/Project_Version2/frontend/review_frontend/src/ReviewCreation.css';

function ReviewCreation() {
  const [productCategory, setProductCategory] = useState('Mobile_electronics');
  const [productId, setProductId] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [duplicateReview, setDuplicateReview] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('review_username'); // Get the current logged-in username

  const existingReviews = JSON.parse(localStorage.getItem('reviews')) || [];

  const handleSubmit = () => {
    const newReview = { username, productCategory, productId, review, rating };
    const isDuplicate = existingReviews.some(
      (r) => r.username === username && r.productId === productId
    );

    if (isDuplicate) {
      setDuplicateReview(true);
      alert('Analogous Review, Sent alert to the Admin');
    } else {
      localStorage.setItem(
        'reviews',
        JSON.stringify([...existingReviews, newReview])
      );
      setSuccessMessage('Review submitted successfully');
      setDuplicateReview(false);
      setProductCategory('Mobile_electronics');
      setProductId('');
      setReview('');
      setRating(0);
    }
  };

  const handleAnotherReview = () => {
    setSuccessMessage('');
  };

  const goBackToHome = () => { 
    navigate('/'); 
  };

  return (
    <div className="form-container">
      <h1>Create a Review</h1>
      <div className="form-group">
        <label>Product Category</label>
        <select
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
        >
          <option value="Mobile_electronics">Mobile Electronics</option>
          <option value="Beauty_products">Beauty Products</option>
          <option value="Office_supplies">Office Supplies</option>
          <option value="Home_supplies">Home Supplies</option>
          <option value="Groceries">Groceries</option>
        </select>
      </div>
      <div className="form-group">
        <label>Product ID</label>
        <input
          type="text"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Review</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
      </div>
      <div className="form-group">
        <label>Rating</label>
        <StarRating rating={rating} setRating={setRating} />
      </div>
      <button onClick={handleSubmit}>Submit</button>
      {successMessage && (
        <div>
          <p>{successMessage}</p>
          <button onClick={handleAnotherReview}>Submit Another Review</button>
        </div>
      )}
      <button onClick={goBackToHome}>Go back to Home</button>
    </div>
  );
}

export default ReviewCreation;
