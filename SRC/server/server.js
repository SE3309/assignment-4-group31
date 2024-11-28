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
    user: 'root',     // Your MySQL username
    password: '',     // Your MySQL password
    database: 'databaselab',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to initialize database and tables
async function initializeDatabase() {
    try {
        console.log('Connected to MySQL');

        // List of SQL files to execute in order (considering dependencies)
        const sqlFiles = [
            // Base tables first (no foreign key dependencies)
            '../../DUMP/databaselab_student.sql',
            '../../DUMP/databaselab_university.sql',
            '../../DUMP/databaselab_program.sql',
            '../../DUMP/databaselab_course.sql',
            '../../DUMP/databaselab_highschoolstudent.sql',
            
            // Tables with foreign key dependencies
        
            '../../DUMP/databaselab_universitystudent.sql',
            '../../DUMP/databaselab_highschoolgrade.sql',
            '../../DUMP/databaselab_studentexperience.sql',
            '../../DUMP/databaselab_studentexperienceweightings.sql' 
        ];

        // Process each SQL file
        for (const sqlFile of sqlFiles) {
            const sqlPath = path.join(__dirname, sqlFile);
            console.log('Reading SQL file from:', sqlPath);
            
            const sqlContent = await fs.readFile(sqlPath, { encoding: 'utf8' });
            console.log(`SQL file ${sqlFile} read successfully`);

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
                        console.log(`Executed statement from ${sqlFile} successfully`);
                    } catch (error) {
                        if (!error.message.includes('already exists')) {
                            console.error(`Error executing statement from ${sqlFile}:`, error.message);
                        }
                    }
                }
            }
            console.log(`Finished processing ${sqlFile}`);
        }

        console.log('All databases initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}

app.get('/api/universities/:id/courses', async (req, res) => {
    try {
        const [courses] = await pool.query(`
            SELECT *
            FROM university
           
        `, [req.params.id]);

        res.json({
            success: true,
            courses
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching courses'
        });
    }
});

// Global connection variable
let connection;

// Initialize database and start server
async function startServer() {
    try {
        connection = await initializeDatabase();
        
        // Student verification endpoint
        app.get('/api/verify-student/:id', async (req, res) => {
            try {
                const [rows] = await pool.query(
                    'SELECT * FROM student WHERE StudentID = ?',
                    [req.params.id]
                );
                
                console.log('Student verification result:', rows);
                
                res.json({
                    exists: rows.length > 0,
                    student: rows.length > 0 ? rows[0] : null
                });
            } catch (error) {
                console.error('Error verifying student:', error);
                res.status(500).json({
                    error: 'Error verifying student',
                    details: error.message
                });
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

        // Replace or add this endpoint
        app.post('/api/verify-admin', (req, res) => {
            const { adminId, password } = req.body;
            
            // Simple hardcoded check
            if (adminId === 'admin' && password === 'admin') {
                res.json({
                    success: true,
                    admin: { id: 'admin' }
                });
            } else {
                res.json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
        });

        app.get('/api/admin/search-student', async (req, res) => {
            try {
                const { term, type } = req.query;
                
                // Fixed SQL syntax by removing trailing comma
                const query = `
                    SELECT 
                        StudentID,
                        FirstName,
                        LastName,
                        Address
                        
                    FROM student
                    WHERE ${type === 'id' ? 'StudentID = ?' : "CONCAT(FirstName, ' ', LastName) LIKE ?"}
                `;

                const searchValue = type === 'id' ? term : `%${term}%`;
                
                const [students] = await pool.query(query, [searchValue]);

                res.json({
                    success: true,
                    students: students.length > 0 ? students : []
                });

            } catch (error) {
                console.error('Search error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error searching for students'
                });
            }
        });

        // Get all universities with their student count
        app.get('/api/universities', async (req, res) => {
            try {
                const [universities] = await pool.query(
                    'SELECT UniversityName, NumOfStudents FROM university ORDER BY UniversityName'
                );
                res.json({
                    success: true,
                    universities
                });
            } catch (error) {
                console.error('Error fetching universities:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error fetching universities'
                });
            }
        });

        app.get('/api/universities/programs/:universityName', async (req, res) => {
            try {
                const [programs] = await pool.query(`
                    SELECT p.programName
                    FROM program p, university c
                    WHERE p.universityName = c.universityName
                `, [req.params.universityName]);
                
                res.json({
                    success: true,
                    programs
                });
            } catch (error) {
                console.error('Error fetching programs:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error fetching programs'
                });
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