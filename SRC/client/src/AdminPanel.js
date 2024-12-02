import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

function AdminPanel() {
    const [universities, setUniversities] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [editingProgram, setEditingProgram] = useState(null);
    const [newTuition, setNewTuition] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        handleLoadUniversities();
    }, []);

    const handleLoadUniversities = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:3001/api/universities');
            const data = await response.json();
            setUniversities(data);
        } catch (err) {
            setError('Failed to load universities');
            console.error('Error loading universities:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadPrograms = async (universityName) => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:3001/api/programs/${universityName}`);
            const data = await response.json();
            setPrograms(data);
            setSelectedUniversity(universityName);
        } catch (err) {
            setError('Failed to load programs');
            console.error('Error loading programs:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditTuition = (programName, currentTuition) => {
        setEditingProgram(programName);
        setNewTuition(currentTuition);
    };

    const handleSaveTuition = async (programName) => {
        try {
            const response = await fetch(`http://localhost:3001/api/programs/${selectedUniversity}/${programName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tuition: newTuition }),
            });
            if (response.ok) {
                handleLoadPrograms(selectedUniversity);
                setEditingProgram(null);
            } else {
                setError('Failed to update tuition');
            }
        } catch (err) {
            setError('Failed to update tuition');
            console.error('Error updating tuition:', err);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin') {
            setIsLoggedIn(true);
        } else {
            setError('Invalid credentials');
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="admin-panel">
                <div className="login-container">
                    <h2>Admin Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <div className="error">{error}</div>}
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            {isLoading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}

            <div className="data-container">
                <div className="universities-list">
                    <h3>Universities</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>City</th>
                                <th>Number of Students</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {universities.map(uni => (
                                <tr key={uni.universityName} 
                                    className={selectedUniversity === uni.universityName ? 'selected' : ''}>
                                    <td>{uni.universityName}</td>
                                    <td>{uni.city}</td>
                                    <td>{uni.numOfStudents}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleLoadPrograms(uni.universityName)}
                                            className="view-programs-btn"
                                        >
                                            View Programs
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {selectedUniversity && (
                    <div className="programs-list">
                        <h3>Programs at {selectedUniversity}</h3>
                        {programs.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Program Name</th>
                                        <th>Degree</th>
                                        <th>Program Length (Years)</th>
                                        <th>Tuition</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {programs.map(prog => (
                                        <tr key={prog.programName}>
                                            <td>{prog.programName}</td>
                                            <td>{prog.degree}</td>
                                            <td>{prog.programLength}</td>
                                            <td>
                                                {editingProgram === prog.programName ? (
                                                    <input
                                                        type="number"
                                                        value={newTuition}
                                                        onChange={(e) => setNewTuition(e.target.value)}
                                                    />
                                                ) : (
                                                    `$${prog.tuition?.toLocaleString()}`
                                                )}
                                            </td>
                                            <td>
                                                {editingProgram === prog.programName ? (
                                                    <button onClick={() => handleSaveTuition(prog.programName)}>
                                                        Save
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleEditTuition(prog.programName, prog.tuition)}>
                                                        Edit
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No programs found for this university.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPanel; 