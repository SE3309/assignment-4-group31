import React, { useState, useEffect } from 'react';
import './StudentTable.css';

function StudentTable() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/api/students')
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Received data:', data);
                setStudents(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Detailed fetch error:', error);
                setError(`Failed to fetch: ${error.message}`);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="loading">Loading student data...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!students.length) return <div className="no-data">No students found</div>;

    return (
        <div className="student-table-container">
            <h1>Student Directory</h1>
            <table className="student-table">
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Address</th>
                        <th>Biography</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.StudentID}>
                            <td>{student.StudentID}</td>
                            <td>{student.FirstName}</td>
                            <td>{student.LastName}</td>
                            <td>{student.Address}</td>
                            <td>{student.Biography}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StudentTable;