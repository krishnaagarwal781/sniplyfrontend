// src/App.js

import React, { useState } from 'react';
import './App.css';
import Form from './Form';


function App() {
  const [shortLink, setShortLink] = useState('');

  // Function to update shortLink state when a new link is generated.
  const updateShortLink = (newShortLink) => {
    setShortLink(newShortLink);
  };

  return (
    <div className="App">
      
      <Form updateShortLink={updateShortLink} />
      
    </div>
  );
}

export default App;
