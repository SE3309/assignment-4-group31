import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import StudentScores from './components/StudentScores';
import StudentSearch from './components/StudentSearch';
import UniversityGrades from './components/UniversityGrades';

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
                    className={activeTab === 'universities' ? 'active' : ''}
                    onClick={() => setActiveTab('universities')}
                >
                    Universities
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

                {activeTab === 'universities' && (
                    <div className="universities-section">
                        <UniversityGrades />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;