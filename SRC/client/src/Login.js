import React, { useState } from 'react';
import './Login.css';

function Login() {
    const [studentId, setStudentId] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await fetch(`http://localhost:3001/api/verify-student/${studentId}`);
            const data = await response.json();
            
            if (data.exists) {
                setMessage('Student ID verified!');
            } else {
                setMessage('Student ID not found.');
            }
        } catch (error) {
            setMessage('Error checking student ID. Please try again.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Student Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="studentId">Student ID:</label>
                        <input
                            type="number"
                            id="studentId"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            placeholder="Enter your Student ID"
                            required
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Checking...' : 'Verify ID'}
                    </button>
                    {message && <div className={`message ${message.includes('verified') ? 'success' : 'error'}`}>
                        {message}
                    </div>}
                </form>
            </div>
        </div>
    );
}

export default Login;