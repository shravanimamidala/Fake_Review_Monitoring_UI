// src/App.js
import React, { useState } from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  return (
    <div className="App">
      {!loggedIn ? (
        showLogin ? (
          <Login setLoggedIn={setLoggedIn} setWelcomeMessage={setWelcomeMessage} setShowLogin={setShowLogin} />
        ) : (
          <Register setShowLogin={setShowLogin} />
        )
      ) : (
        <Dashboard welcomeMessage={welcomeMessage} setLoggedIn={setLoggedIn} />
      )}
    </div>
  );
}

export default App;
