import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import StudentRegister from './StudentRegister';
import AddExperience from './components/AddExperience';

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
          <Route path="/add-experience/:studentId" element={<AddExperience />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;