import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import StudentScores from './StudentScores';
import StudentSearch from './StudentSearch';
import UniversityGrades from './UniversityGrades';
import AdminPanel from './AdminPanel';

function Login() {
    const [activeTab, setActiveTab] = useState('ratings'); // 'ratings', 'register', or 'students'

    return (
        <div className="main-container">
            <div className="tab-selector">
                <button 
                    className={activeTab === 'ratings' ? 'active' : ''}
                    onClick={() => setActiveTab('ratings')}
                >
                    Program Ratings
                </button>
                <button 
                    className={activeTab === 'register' ? 'active' : ''}
                    onClick={() => setActiveTab('register')}
                >
                    Register
                </button>
                <button 
                    className={activeTab === 'students' ? 'active' : ''}
                    onClick={() => setActiveTab('students')}
                >
                    Students
                </button>
                <button 
                    className={activeTab === 'admin' ? 'active' : ''}
                    onClick={() => setActiveTab('admin')}
                >
                    Admin
                </button>
            </div>

            <div className="content-box">
                {activeTab === 'ratings' && (
                    <div className="ratings-section">
                        <h2>Program Ratings</h2>
                        <StudentScores />
                    </div>
                )}

                {activeTab === 'register' && (
                    <div className="register-section">
                        <h2>Register</h2>
                        <Link to="/register">Go to Registration</Link>
                    </div>
                )}

                {activeTab === 'students' && (
                    <div className="students-section">
                        <h2>Student Directory</h2>
                        <StudentSearch />
                    </div>
                )}

                {activeTab === 'admin' && (
                    <div className="admin-section">
                        <h2>Admin Panel</h2>
                        <AdminPanel />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;