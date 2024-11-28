import React, { useState } from 'react';
import './Admin.css';
import UniversityView from './UniversityView';

function Admin() {
    const [idSearch, setIdSearch] = useState('');
    const [nameSearch, setNameSearch] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [view, setView] = useState('search');

    const handleSearch = async (e, searchType) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        const searchTerm = searchType === 'id' ? idSearch : nameSearch;
        
        try {
            const response = await fetch(`http://localhost:3001/api/admin/search-student?term=${encodeURIComponent(searchTerm)}&type=${searchType}`);
            const data = await response.json();
            
            if (data.success) {
                setSearchResults(data.students);
            } else {
                setError(data.message || 'No students found');
                setSearchResults(null);
            }
        } catch (error) {
            setError('Error searching for students');
            setSearchResults(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setIdSearch('');
        setNameSearch('');
        setSearchResults(null);
        setError('');
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
                <div className="header-buttons">
                    <button 
                        onClick={() => setView('search')} 
                        className={`nav-button ${view === 'search' ? 'active' : ''}`}
                    >
                        Student Search
                    </button>
                    <button 
                        onClick={() => setView('universities')} 
                        className={`nav-button ${view === 'universities' ? 'active' : ''}`}
                    >
                        Universities
                    </button>
                    <button onClick={handleClear} className="clear-button">
                        Clear
                    </button>
                    <button onClick={() => window.location.reload()} className="logout-button">
                        Logout
                    </button>
                </div>
            </header>
            
            {view === 'search' ? (
                <div className="search-section">
                    <div className="search-box">
                        <h3>Search by Student ID</h3>
                        <form onSubmit={(e) => handleSearch(e, 'id')}>
                            <input
                                type="text"
                                value={idSearch}
                                onChange={(e) => setIdSearch(e.target.value)}
                                placeholder="Enter Student ID"
                                className="search-input"
                            />
                            <button type="submit" className="search-button" disabled={isLoading}>
                                {isLoading ? 'Searching...' : 'Search'}
                            </button>
                        </form>
                    </div>

                    <div className="search-box">
                        <h3>Search by Name</h3>
                        <form onSubmit={(e) => handleSearch(e, 'name')}>
                            <input
                                type="text"
                                value={nameSearch}
                                onChange={(e) => setNameSearch(e.target.value)}
                                placeholder="Enter Student Name"
                                className="search-input"
                            />
                            <button type="submit" className="search-button" disabled={isLoading}>
                                {isLoading ? 'Searching...' : 'Search'}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <UniversityView />
            )}

            {error && <div className="error-message">{error}</div>}

            {searchResults && searchResults.length > 0 && (
                <div className="results-section">
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.map((student) => (
                                <tr key={student.StudentID}>
                                    <td>{student.StudentID}</td>
                                    <td>{student.FirstName} {student.LastName}</td>
                                    <td>{student.Address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Admin; 