import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login';
import Admin from './Admin';
import StudentRegister from './StudentRegister';

function App() {
  const handleLoginSuccess = (isAdmin) => {
    if (isAdmin) {
      window.location.href = '/admin';
    } else {
      // Handle student login if needed
      window.location.href = '/student-dashboard';
    }
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/register" element={<StudentRegister />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;