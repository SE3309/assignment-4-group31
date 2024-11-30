import React, { useState } from 'react';
import './UniversityMatch.css';

const UniversityMatch = () => {
    const [studentId, setStudentId] = useState('');
    const [matches, setMatches] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMatches(null);

        try {
            const response = await fetch(`http://localhost:3001/api/students/university-fit?studentId=${studentId}`);
            const data = await response.json();

            if (data.success) {
                setMatches(data.matches);
            } else {
                setError('No matches found for this student');
            }
        } catch (err) {
            setError('Error fetching matches');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="university-match-container">
            <h2>University Grade Comparison</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="Enter Student ID"
                    />
                    <button type="submit">Compare Grades</button>
                </div>
            </form>

            {error && <div className="error-message">{error}</div>}
            
            {loading ? (
                <div className="loading">Loading comparisons...</div>
            ) : matches && matches.length > 0 ? (
                <div className="matches-section">
                    <div className="info-box">
                        <p>
                            <span className="above-average">Positive values</span> indicate your grades are above the university average.
                            <br />
                            <span className="below-average">Negative values</span> indicate your grades are below the university average.
                        </p>
                    </div>
                    <table className="matches-table">
                        <thead>
                            <tr>
                                <th>University</th>
                                <th>Your Average</th>
                                <th>University Average</th>
                                <th>Difference</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matches.map((match, index) => (
                                <tr key={index}>
                                    <td>{match.UniversityName}</td>
                                    <td className="grade">
                                        {Number(match.StudentAverage).toFixed(1)}%
                                    </td>
                                    <td className="grade">
                                        {Number(match.UniversityAverage).toFixed(1)}%
                                    </td>
                                    <td className="difference">
                                        <span className={
                                            Number(match.GradeDifference) >= 0 ? 'above-average' : 'below-average'
                                        }>
                                            {Number(match.GradeDifference) > 0 ? '+' : ''}
                                            {Number(match.GradeDifference).toFixed(1)}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : null}
        </div>
    );
};

export default UniversityMatch; 