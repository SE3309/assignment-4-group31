import React, { useState, useEffect } from 'react';
import './StudentScores.css';

const StudentScores = () => {
    const [scores, setScores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentId, setStudentId] = useState('');
    const [filteredScores, setFilteredScores] = useState([]);
    const [studentAverage, setStudentAverage] = useState(null);
    const [studentName, setStudentName] = useState('');
    const [showTopStudents, setShowTopStudents] = useState(false);
    const [topStudents, setTopStudents] = useState([]);

    useEffect(() => {
        fetchScores();
    }, []);

    const fetchScores = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/student-scores');
            const data = await response.json();
            
            if (data.success) {
                setScores(data.scores);
                setFilteredScores([]);
            } else {
                setError('Failed to load scores');
            }
        } catch (err) {
            setError('Error connecting to server');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTopStudents = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/top-students');
            const data = await response.json();
            
            if (data.success) {
                setTopStudents(data.topStudents);
                setShowTopStudents(true);
            } else {
                setError('Failed to load top students');
            }
        } catch (err) {
            setError('Error connecting to server');
        }
    };

    const handleSearch = async () => {
        if (studentId.trim() === '') {
            setFilteredScores([]);
            setStudentAverage(null);
            setStudentName('');
            return;
        }

        const filtered = scores.filter(score => 
            score.StudentID.toString() === studentId.trim()
        );
        
        if (filtered.length > 0) {
            setStudentName(filtered[0].StudentName || 'Name Not Available');
        } else {
            setStudentName('');
        }

        if (filtered.length > 0) {
            const avgScore = filtered.reduce((acc, curr) => 
                acc + Number(curr.MaxScore), 0) / filtered.length;
            setStudentAverage(avgScore);
        } else {
            setStudentAverage(null);
        }

        const withComparisonAndTuition = await Promise.all(filtered.map(async score => {
            const universityScores = scores.filter(s => 
                s.universityName === score.universityName && 
                s.programName === score.programName
            );
            const avgScore = universityScores.reduce((acc, curr) => 
                acc + Number(curr.MaxScore), 0) / universityScores.length;
            
            try {
                const response = await fetch(
                    `http://localhost:3001/api/programs/${encodeURIComponent(score.universityName)}/${encodeURIComponent(score.programName)}/tuition`
                );
                const data = await response.json();
                return {
                    ...score,
                    universityAvg: avgScore,
                    tuition: data.success ? data.tuition : 'N/A'
                };
            } catch (err) {
                console.error('Error fetching tuition:', err);
                return {
                    ...score,
                    universityAvg: avgScore,
                    tuition: 'N/A'
                };
            }
        }));
        
        setFilteredScores(withComparisonAndTuition);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    if (isLoading) return <div>Loading scores...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="scores-container">
            <h2>Student Program Scores</h2>
            
            {studentName && (
                <h3 className="student-name">Student: {studentName}</h3>
            )}
            
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Enter exact Student ID..."
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">
                    Search
                </button>
                <button 
                    onClick={fetchTopStudents} 
                    className="top-students-button"
                >
                    View Top Students (90%+ Average)
                </button>
            </div>

            {showTopStudents && topStudents.length > 0 && (
                <div className="top-students-container">
                    <h3>Top Performing Students (90%+ Average)</h3>
                    <table className="scores-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>University</th>
                                <th>Program</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topStudents.map((student) => (
                                <tr key={`${student.StudentID}-${student.UniversityName}`}>
                                    <td>{student.StudentID}</td>
                                    <td>{student.firstName}</td>
                                    <td>{student.lastName}</td>
                                    <td>{student.UniversityName}</td>
                                    <td>{student.ProgramName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button 
                        onClick={() => setShowTopStudents(false)} 
                        className="close-button"
                    >
                        Close Top Students View
                    </button>
                </div>
            )}

            <div className="scores-table-container">
                <table className="scores-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Program</th>
                            <th>University</th>
                            <th>Score</th>
                            <th>University Average Score (All Students)</th>
                            <th>Tuition ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredScores.map((score, index) => (
                            <tr key={`${score.StudentID}-${score.programName}-${index}`}>
                                <td>{score.StudentID}</td>
                                <td>{score.programName}</td>
                                <td>{score.universityName}</td>
                                <td>{score.MaxScore ? Number(score.MaxScore).toFixed(2) : 'N/A'}</td>
                                <td>{score.universityAvg ? score.universityAvg.toFixed(2) : 'N/A'}</td>
                                <td>{score.tuition ? Number(score.tuition).toLocaleString() : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentScores; 
