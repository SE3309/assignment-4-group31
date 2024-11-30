import React, { useState } from 'react';
import './AdminPanel.css';

function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleManageUsers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/users');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError('Failed to load users');
            console.error('Error loading users:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-panel">
            <div className="admin-actions">
                <button onClick={handleManageUsers}>Manage Users</button>
                <button>Manage Programs</button>
                <button>View Reports</button>
            </div>

            {isLoading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}

            {users.length > 0 && (
                <div className="users-list">
                    <h3>Users</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <button className="edit-btn">Edit</button>
                                        <button className="delete-btn">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminPanel; 