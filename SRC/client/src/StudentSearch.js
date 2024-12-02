import React, { useState } from 'react';
import './StudentSearch.css';
import { useNavigate } from 'react-router-dom';

const StudentSearch = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const [searchType, setSearchType] = useState('name');
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [similarGrades, setSimilarGrades] = useState([]);
    const [showingSimilarGrades, setShowingSimilarGrades] = useState(false);
    const [studentGrades, setStudentGrades] = useState(null);

    const fetchStudentGrades = async (studentId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/students/${studentId}/grades`);
            const data = await response.json();
            
            if (data.success) {
                setStudentGrades(data);
            }
        } catch (err) {
            console.error('Error fetching grades:', err);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setStudentGrades(null);

        try {
            const response = await fetch(`http://localhost:3001/api/students/search?term=${inputValue}&type=${searchType}`);
            const data = await response.json();

            if (data.success) {
                setStudents(data.students);
                if (data.students.length === 1) {
                    fetchStudentGrades(data.students[0].StudentID);
                }
            } else {
                setError('No students found');
            }
        } catch (err) {
            setError('Error searching students');
            console.error('Search error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddExperience = (studentId) => {
        navigate(`/add-experience/${studentId}`);
    };

    const handleShowSimilarGrades = async (studentId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/students/${studentId}/similar-grades`);
            const data = await response.json();
            
            if (data.success) {
                setSimilarGrades(data.results);
                setShowingSimilarGrades(true);
            } else {
                setError('Failed to fetch similar grades');
            }
        } catch (err) {
            setError('Error fetching similar grades');
            console.error('Similar grades error:', err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <div className="search-input-container">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Search students..."
                    />
                    <button type="submit">Search</button>
                </div>
                
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            value="name"
                            checked={searchType === 'name'}
                            onChange={(e) => setSearchType(e.target.value)}
                        />
                        Search by Name
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="id"
                            checked={searchType === 'id'}
                            onChange={(e) => setSearchType(e.target.value)}
                        />
                        Search by ID
                    </label>
                </div>
            </form>

            {studentGrades && (
                <div className="student-grades-summary">
                    <h3>Student Grade Summary</h3>
                    <div className="grades-grid">
                        <div className="grade-box">
                            <label>Average Grade</label>
                            <span className="grade-value">{Number(studentGrades.average).toFixed(2)}</span>
                        </div>
                        <div className="grade-box">
                            <label>Highest Grade</label>
                            <span className="grade-value">{Number(studentGrades.highest).toFixed(2)}</span>
                        </div>
                        <div className="grade-box">
                            <label>Lowest Grade</label>
                            <span className="grade-value">{Number(studentGrades.lowest).toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="grades-detail">
                        <h4>Individual Grades</h4>
                        <div className="grades-list">
                            {studentGrades.grades.map((grade, index) => (
                                <div key={index} className="grade-item">
                                    <span className="subject">{grade.Subject}</span>
                                    <span className="grade">{Number(grade.HighSchoolGrade).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {error && <div className="error-message">{error}</div>}

            {isLoading ? (
                <div className="loading">Searching...</div>
            ) : (
                <>
                    {showingSimilarGrades && similarGrades.length > 0 && (
                        <div className="similar-grades-container">
                            <h3>Universities Grade Comparison</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>University Name</th>
                                        <th>University Avg</th>
                                        <th>Your Avg</th>
                                        <th>Difference</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {similarGrades.map((result, index) => (
                                        <tr key={index}>
                                            <td>{result.UniversityName}</td>
                                            <td>{Number(result.UniversityAvg)}</td>
                                            <td>{Number(result.StudentAvg)}</td>
                                            <td className={Number(result.GradeDifference) >= 0 ? 'positive' : 'negative'}>
                                                {Number(result.GradeDifference) >= 0 ? '+' : ''}
                                                {Number(result.GradeDifference)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="results-container">
                        {students.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Address</th>
                                        <th>Email Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(student => (
                                        <tr key={student.StudentID}>
                                            <td>{student.StudentID}</td>
                                            <td>{student.FirstName}</td>
                                            <td>{student.LastName}</td>
                                            <td>{student.Address}</td>
                                            <td>
                                                <button 
                                                    onClick={() => handleAddExperience(student.StudentID)}
                                                    className="add-experience-btn"
                                                >
                                                    Add Experience
                                                </button>
                                                <button 
                                                    onClick={() => handleShowSimilarGrades(student.StudentID)}
                                                    className="similar-grades-btn"
                                                >
                                                    Compare Grades
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="no-results">No students found</div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default StudentSearch;
