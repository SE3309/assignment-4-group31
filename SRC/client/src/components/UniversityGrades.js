import React, { useState, useEffect } from 'react';
import './UniversityGrades.css';

const UniversityGrades = () => {
    const [universities, setUniversities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUniversityGrades();
    }, []);

    const fetchUniversityGrades = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/universities/grades');
            const data = await response.json();

            if (data.success) {
                setUniversities(data.universities);
            } else {
                setError('Failed to load university data');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="loading">Loading university data...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="university-grades-container">
            <h2>University Entrance Grades</h2>
            <div className="info-box">
                <p>Average high school grades of current students at each university</p>
            </div>
            
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>University</th>
                            <th>Average Entrance Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {universities.map((uni, index) => (
                            <tr key={index}>
                                <td>{uni.UniversityName}</td>
                                <td className="grade">{uni.AvgGrade}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UniversityGrades; 