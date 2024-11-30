import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
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
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<StudentRegister />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;