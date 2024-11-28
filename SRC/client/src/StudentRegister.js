import React, { useState, useEffect } from 'react';
import './StudentRegister.css';
import { useNavigate } from 'react-router-dom';

function StudentRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        currentHighSchool: '',
        gradYear: '',
        biography: ''
    });
    const [highSchools, setHighSchools] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchHighSchools();
    }, []);

    const fetchHighSchools = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/highschools');
            const data = await response.json();
            if (data.success) {
                setHighSchools(data.highSchools);
            }
        } catch (error) {
            setError('Error fetching high schools');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:3001/api/students/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            
            if (data.success) {
                setSuccess(`Registration successful! Your Student ID is: ${data.studentId}`);
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    currentHighSchool: '',
                    gradYear: '',
                    biography: ''
                });
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (error) {
            setError('Error during registration');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleBackToLogin = () => {
        navigate('/');
    };

    // Generate graduation years (starting from 2025)
    const gradYears = [];
    const startYear = 2025;
    for (let year = startYear; year <= startYear + 3; year++) {
        gradYears.push(year);
    }

    return (
        <div className="register-container">
            <div className="header-buttons">
                <button onClick={handleBackToLogin} className="back-button">
                    Back to Login
                </button>
            </div>
            
            <h2>Student Registration</h2>
            
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.Address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>High School:</label>
                    <select
                        name="currentHighSchool"
                        value={formData.currentHighSchool}
                        onChange={handleChange}
                        required
                        className="highschool-select"
                    >
                        <option value="">Select a High School</option>
                        {highSchools.map((school) => (
                            <option key={school.CurrentHighSchool} value={school.CurrentHighSchool}>
                                {school.CurrentHighSchool}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Graduation Year:</label>
                    <select
                        name="gradYear"
                        value={formData.gradYear}
                        onChange={handleChange}
                        required
                        className="highschool-select"
                    >
                        <option value="">Select Graduation Year</option>
                        {gradYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Biography:</label>
                    <textarea
                        name="biography"
                        value={formData.biography}
                        onChange={handleChange}
                        className="biography-input"
                        placeholder="Tell us about yourself..."
                        rows="4"
                    />
                </div>

                <button type="submit" className="register-button">Register</button>
            </form>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
        </div>
    );
}

export default StudentRegister; 