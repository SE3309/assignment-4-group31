import React, { useState, useEffect } from 'react';
import './UniversityView.css';

function UniversityView() {
    const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [studentCount, setStudentCount] = useState(null);
    const [programs, setPrograms] = useState([]);
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });

    useEffect(() => {
        fetchUniversities();
    }, []);

    const fetchUniversities = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/universities');
            const data = await response.json();
            if (data.success) {
                setUniversities(data.universities);
            }
        } catch (error) {
            setError('Error fetching universities');
        }
    };

    const handleUniversityChange = async (e) => {
        const uniName = e.target.value;
        setSelectedUniversity(uniName);
        setPrograms([]);
        
        if (uniName) {
            const selectedUni = universities.find(uni => uni.UniversityName === uniName);
            setStudentCount(selectedUni.NumOfStudents);
            
            try {
                const response = await fetch(`http://localhost:3001/api/universities/programs/${encodeURIComponent(uniName)}`);
                const data = await response.json();
                if (data.success) {
                    setPrograms(data.programs);
                } else {
                    setPrograms([]);
                }
            } catch (error) {
                setError('Error fetching programs');
                setPrograms([]);
            }
        } else {
            setStudentCount(null);
            setPrograms([]);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (loginCredentials.username === 'admin' && loginCredentials.password === 'admin') {
            setIsAdmin(true);
            setShowLoginForm(false);
        } else {
            setError('Invalid credentials');
        }
    };

    const handleLogout = () => {
        setIsAdmin(false);
        setLoginCredentials({ username: '', password: '' });
    };

    return (
        <div className="university-view">
            <div className="admin-section">
                {!isAdmin ? (
                    <button 
                        className="admin-button"
                        onClick={() => setShowLoginForm(!showLoginForm)}
                    >
                        Admin Login
                    </button>
                ) : (
                    <button 
                        className="admin-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                )}
            </div>

            {showLoginForm && !isAdmin && (
                <div className="login-form">
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={loginCredentials.username}
                            onChange={(e) => setLoginCredentials({
                                ...loginCredentials,
                                username: e.target.value
                            })}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={loginCredentials.password}
                            onChange={(e) => setLoginCredentials({
                                ...loginCredentials,
                                password: e.target.value
                            })}
                        />
                        <button type="submit">Login</button>
                    </form>
                </div>
            )}

            <h2>Universities</h2>
            
            <div className="university-selector">
                <select 
                    value={selectedUniversity}
                    onChange={handleUniversityChange}
                    className="university-dropdown"
                >
                    <option value="">Select a University</option>
                    {universities.map(uni => (
                        <option key={uni.UniversityName} value={uni.UniversityName}>
                            {uni.UniversityName}
                        </option>
                    ))}
                </select>
            </div>

            {studentCount !== null && (
                <div className="student-count">
                    <h3>Number of Students: {studentCount}</h3>
                </div>
            )}

            {programs.length > 0 && (
                <div className="programs-table-container">
                    <h3>Available Programs</h3>
                    <table className="programs-table">
                        <thead>
                            <tr>
                                <th>Program Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {programs.map((program, index) => (
                                <tr key={index}>
                                    <td>{program.programName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {error && <div className="error-message">{error}</div>}
        </div>
    );
}

export default UniversityView;