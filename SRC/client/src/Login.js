import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';

function Login({ onLoginSuccess }) {
    const [loginType, setLoginType] = useState('student'); // 'student' or 'admin'
    const [id, setId] = useState('');
    const [password, setPassword] = useState(''); // Only for admin
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            if (loginType === 'student') {
                const response = await fetch(`http://localhost:3001/api/verify-student/${id}`);
                const data = await response.json();
                
                if (data.exists) {
                    setMessage('Student ID verified!');
                } else {
                    setMessage('Student ID not found.');
                }
            } else {
                // Admin login
                const response = await fetch('http://localhost:3001/api/verify-admin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        adminId: id,
                        password: password
                    }),
                });
                const data = await response.json();
                
                if (data.success) {
                    setMessage('Admin login successful!');
                    onLoginSuccess('admin');
                } else {
                    setMessage('Invalid admin credentials.');
                }
            }
        } catch (error) {
            setMessage('Error during login. Please try again.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-type-selector">
                    <button 
                        className={loginType === 'student' ? 'active' : ''}
                        onClick={() => {
                            setLoginType('student');
                            setMessage('');
                            setId('');
                            setPassword('');
                        }}
                    >
                        Student Login
                    </button>
                    <button 
                        className={loginType === 'admin' ? 'active' : ''}
                        onClick={() => {
                            setLoginType('admin');
                            setMessage('');
                            setId('');
                            setPassword('');
                        }}
                    >
                        Admin Login
                    </button>
                </div>

                <h2>{loginType === 'student' ? 'Student Login' : 'Admin Login'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="id">
                            {loginType === 'student' ? 'Student ID:' : 'Admin ID:'}
                        </label>
                        <input
                            type="text"
                            id="id"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder={loginType === 'student' ? "Enter Student ID" : "Enter Admin ID"}
                            required
                        />
                    </div>

                    {loginType === 'admin' && (
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Password"
                                required
                            />
                        </div>
                    )}

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Checking...' : 'Login'}
                    </button>

                    {message && (
                        <div className={`message ${message.includes('successful') || message.includes('verified') ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}
                </form>

                <div className="register-link">
                    <p>New student? <Link to="/register">Register here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;