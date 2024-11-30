import React, { useState, useEffect } from 'react';
import './StudentScores.css';

const StudentScores = () => {
    const [scores, setScores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentId, setStudentId] = useState('');
    const [filteredScores, setFilteredScores] = useState([]);
    const [studentAverage, setStudentAverage] = useState(null);

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

    const handleSearch = () => {
        if (studentId.trim() === '') {
            setFilteredScores([]);
            setStudentAverage(null);
            return;
        }

        const filtered = scores.filter(score => 
            score.StudentID.toString() === studentId.trim()
        );
        
        // Calculate student's average across all programs
        if (filtered.length > 0) {
            const avgScore = filtered.reduce((acc, curr) => 
                acc + Number(curr.MaxScore), 0) / filtered.length;
            setStudentAverage(avgScore);
        } else {
            setStudentAverage(null);
        }

        // Add university average comparison
        const withComparison = filtered.map(score => {
            const universityScores = scores.filter(s => 
                s.universityName === score.universityName && 
                s.programName === score.programName
            );
            const avgScore = universityScores.reduce((acc, curr) => 
                acc + Number(curr.MaxScore), 0) / universityScores.length;
            return {
                ...score,
                universityAvg: avgScore
            };
        });
        
        setFilteredScores(withComparison);
    };

    // Add handler for enter key
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
              
            </div>

            <div className="scores-table-container">
                <table className="scores-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Program</th>
                            <th>University</th>
                            <th>Score</th>
                            <th>University Average Score (All Students)</th>
                            <th>Grade Difference</th>
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
                                <td style={{ 
                                    color: score.MaxScore && score.universityAvg
                                        ? Number(score.MaxScore) - score.universityAvg > 0 
                                            ? 'green' 
                                            : Number(score.MaxScore) - score.universityAvg < 0
                                                ? 'red'
                                                : 'inherit'
                                        : 'inherit'
                                }}>
                                    {score.MaxScore && score.universityAvg 
                                        ? (Number(score.MaxScore) - score.universityAvg).toFixed(2) 
                                        : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentScores; 
