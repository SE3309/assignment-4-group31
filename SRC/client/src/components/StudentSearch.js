import React, { useState } from 'react';
import './StudentSearch.css';

const StudentSearch = () => {
    const [inputValue, setInputValue] = useState('');
    const [searchType, setSearchType] = useState('name');
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:3001/api/students/search?term=${inputValue}&type=${searchType}`);
            const data = await response.json();

            if (data.success) {
                setStudents(data.students);
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

            {error && <div className="error-message">{error}</div>}

            {isLoading ? (
                <div className="loading">Searching...</div>
            ) : (
                <div className="results-container">
                    {students.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.StudentID}>
                                        <td>{student.StudentID}</td>
                                        <td>{student.FirstName}</td>
                                        <td>{student.LastName}</td>
                                        <td>{student.Address}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-results">No students found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentSearch;
