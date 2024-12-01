import React, { useState } from 'react';
import './App.css';
import SelectionPage from './components/SelectionPage';
import ReviewRegister from './components/ReviewRegister';
import ReviewLogin from './components/ReviewLogin';
import ReviewCreation from './components/ReviewCreation';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Analysis from './components/Analysis';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [showReviewLogin, setShowReviewLogin] = useState(true);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SelectionPage />} />
          <Route path="/review-register" element={<ReviewRegister setShowRegister={setShowReviewLogin} />} />
          <Route path="/review-login" element={
            showReviewLogin ? (
              <ReviewLogin setShowRegister={setShowReviewLogin} />
            ) : (
              <ReviewRegister setShowRegister={setShowReviewLogin} />
            )
          } />
          <Route path="/review-creation" element={<ReviewCreation />} />
          <Route path="/login" element={
            !loggedIn ? (
              showLogin ? (
                <Login setLoggedIn={setLoggedIn} setWelcomeMessage={setWelcomeMessage} setShowLogin={setShowLogin} />
              ) : (
                <Register setShowLogin={setShowLogin} />
              )
            ) : (
              <Navigate to="/dashboard" />
            )
          } />
          <Route path="/register" element={<Register setShowLogin={setShowLogin} />} />
          <Route path="/dashboard" element={
            loggedIn ? (
              <Dashboard welcomeMessage={welcomeMessage} setLoggedIn={setLoggedIn} />
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
