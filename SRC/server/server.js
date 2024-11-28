const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// Log the current directory and environment variables


// This is the only database connection you need - using pool with hardcoded values
const pool = mysql.createPool({
    host: 'localhost',
    user: 'dbuser',
    password: 'example', //PUT YOUR PASSWORD HERE OR CHANGE IT !!!!
    database: 'databaselab',
    port: 3306,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to initialize database and tables
async function initializeDatabase() {
    try {
        console.log('Connected to MySQL');

        // Read the SQL file
        const sqlPath = path.join(__dirname, '../../DUMP/databaselab_student.sql');
        console.log('Reading SQL file from:', sqlPath);
        
        const sqlContent = await fs.readFile(sqlPath, { encoding: 'utf8' });
        console.log('SQL file read successfully');

        // Filter out comments and empty lines, then split into statements
        const statements = sqlContent
            .split('\n')
            .filter(line => !line.startsWith('--') && !line.startsWith('/*') && line.trim())
            .join('\n')
            .split(';')
            .filter(statement => statement.trim());

        // Execute each valid SQL statement
        for (const statement of statements) {
            const trimmedStatement = statement.trim();
            if (trimmedStatement && !trimmedStatement.startsWith('/*!')) {
                try {
                    await pool.execute(trimmedStatement);
                    console.log('Executed statement successfully');
                } catch (error) {
                    if (!error.message.includes('already exists')) {
                        console.error('Error executing statement:', error.message);
                    }
                }
            }
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}

// Global connection variable
let connection;

// Initialize database and start server
async function startServer() {
    try {
        connection = await initializeDatabase();
        
        // Student verification endpoint
        app.get('/api/verify-student/:id', async (req, res) => {
            try {
                const [rows] = await connection.query(
                    'SELECT * FROM student WHERE StudentID = ?',
                    [req.params.id]
                );
                
                const exists = rows.length > 0;
                res.json({ 
                    exists: exists,
                    message: exists ? 'Student ID verified!' : 'Student ID not found.',
                    student: exists ? rows[0] : null
                });
            } catch (error) {
                console.error('Error verifying student:', error);
                res.status(500).json({ error: 'Error checking student ID' });
            }
        });

        // Add an endpoint to get all students
        app.get('/api/students', async (req, res) => {
            try {
                const [rows] = await pool.execute('SELECT * FROM student');
                res.json(rows);
            } catch (error) {
                console.error('Database error:', error);
                res.status(500).json({ error: 'Database connection failed' });
            }
        });

        const PORT = 3001;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

// Start the server
startServer();