import React, { useState, useEffect } from 'react';
import './UniversityView.css';

function UniversityView() {
    const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [studentCount, setStudentCount] = useState(null);
    const [programs, setPrograms] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUniversities();
    }, []);

    const fetchUniversities = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/universities');
            const data = await response.json();
            if (data.success) {
                setUniversities(data.universities);
            }
        } catch (error) {
            setError('Error fetching universities');
        }
    };

    const handleUniversityChange = async (e) => {
        const uniName = e.target.value;
        setSelectedUniversity(uniName);
        setPrograms([]);
        
        if (uniName) {
            const selectedUni = universities.find(uni => uni.UniversityName === uniName);
            setStudentCount(selectedUni.NumOfStudents);
            
            try {
                const response = await fetch(`http://localhost:3001/api/universities/programs/${encodeURIComponent(uniName)}`);
                const data = await response.json();
                if (data.success) {
                    setPrograms(data.programs);
                } else {
                    setPrograms([]);
                }
            } catch (error) {
                setError('Error fetching programs');
                setPrograms([]);
            }
        } else {
            setStudentCount(null);
            setPrograms([]);
        }
    };

    return (
        <div className="university-view">
            <h2>Universities</h2>
            
            <div className="university-selector">
                <select 
                    value={selectedUniversity}
                    onChange={handleUniversityChange}
                    className="university-dropdown"
                >
                    <option value="">Select a University</option>
                    {universities.map(uni => (
                        <option key={uni.UniversityName} value={uni.UniversityName}>
                            {uni.UniversityName}
                        </option>
                    ))}
                </select>
            </div>

            {studentCount !== null && (
                <div className="student-count">
                    <h3>Number of Students: {studentCount}</h3>
                </div>
            )}

            {programs.length > 0 && (
                <div className="programs-table-container">
                    <h3>Available Programs</h3>
                    <table className="programs-table">
                        <thead>
                            <tr>
                                <th>Program Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {programs.map((program, index) => (
                                <tr key={index}>
                                    <td>{program.programName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {error && <div className="error-message">{error}</div>}
        </div>
    );
}

export default UniversityView;