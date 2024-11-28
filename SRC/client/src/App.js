import React, { useState } from 'react';
import StudentTable from './StudentTable';
import Login from './Login';
import Admin from './Admin';
import './App.css';

function App() {
    const [userType, setUserType] = useState(null); // null, 'student', or 'admin'

    const handleLoginSuccess = (type) => {
        setUserType(type);
    };

    return (
        <div className="App">
            {!userType ? (
                <Login onLoginSuccess={handleLoginSuccess} />
            ) : userType === 'admin' ? (
                <Admin />
            ) : (
                <StudentTable />
            )}
        </div>
    );
}

export default App;