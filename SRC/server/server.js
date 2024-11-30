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

app.post('/api/students/register', async (req, res) => {
    try {
        const { firstName, lastName, email, currentHighSchool, gradYear, biography } = req.body;

        // Get the last StudentID
        const [lastStudent] = await pool.query('SELECT StudentID FROM student ORDER BY StudentID DESC LIMIT 1');
        const nextStudentId = lastStudent.length > 0 ? parseInt(lastStudent[0].StudentID) + 1 : 1;

        // Start a transaction
        await pool.query('START TRANSACTION');

        // Insert into student table
        await pool.query(
            'INSERT INTO student (StudentID, FirstName, LastName, Address, Biography) VALUES (?, ?, ?, ?, ?)',
            [nextStudentId, firstName, lastName, email, biography]
        );

        // Insert into highschoolstudent table
        await pool.query(
            'INSERT INTO highschoolstudent (StudentID, CurrentHighSchool, GradYear) VALUES (?, ?, ?)',
            [nextStudentId, currentHighSchool, gradYear]
        );

        // Commit the transaction
        await pool.query('COMMIT');

        res.json({
            success: true,
            studentId: nextStudentId,
            message: 'Registration successful'
        });
    } catch (error) {
        // Rollback in case of error
        await pool.query('ROLLBACK');
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during registration'
        });
    }
});

app.get('/api/highschools', async (req, res) => {
    try {
        const [highSchools] = await pool.query(
            'SELECT DISTINCT CurrentHighSchool FROM highSchoolStudent ORDER BY CurrentHighSchool'
        );
        
        res.json({
            success: true,
            highSchools
        });
    } catch (error) {
        console.error('Error fetching high schools:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching high schools'
        });
    }
});



app.get('/api/student-scores', async (req, res) => {
    try {
        const studentScoresQuery = `
            WITH WeightedScores AS (
                SELECT
                    se.programName,
                    se.universityName,
                    sew.StudentID,
                    SUM(
                        CASE sew.StudentExperienceFactor
                            WHEN 'careerRating' THEN sew.Rating * se.careerRating
                            WHEN 'facilitiesRating' THEN sew.Rating * se.facilitiesRating
                            WHEN 'learningEnviroRating' THEN sew.Rating * se.learningEnviroRating
                            WHEN 'scholarshipsRating' THEN sew.Rating * se.scholarshipsRating
                            WHEN 'studentSatisfactionRating' THEN sew.Rating * se.studentSatisfactionRating
                            ELSE 0
                        END
                    ) AS WeightedScore
                FROM
                    StudentExperienceWeightings sew
                JOIN
                    StudentExperience se
                ON sew.StudentExperienceFactor IN (
                    'careerRating', 'facilitiesRating', 'learningEnviroRating', 
                    'scholarshipsRating', 'studentSatisfactionRating'
                )
                GROUP BY
                    sew.StudentID, se.programName, se.universityName
            )
            SELECT
                StudentID,
                programName,
                universityName,
                WeightedScore AS MaxScore
            FROM WeightedScores
            ORDER BY WeightedScore DESC;
        `;

        const [results] = await pool.query(studentScoresQuery);
        res.json({
            success: true,
            scores: results
        });
    } catch (error) {
        console.error('Error fetching student scores:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch student scores'
        });
    }
});

app.get('/api/universities/grades', async (req, res) => {
    try {
        const query = `
            WITH AvgGradeOfStudents AS (
                SELECT 
                    us.UniversityName,
                    AVG(hg.HighSchoolGrade) AS AvgUniversityHighSchoolGrade
                FROM UniversityStudent us
                JOIN HighSchoolGrade hg ON us.StudentID = hg.StudentID
                GROUP BY us.UniversityName
            )
            SELECT 
                UniversityName,
                ROUND(AvgUniversityHighSchoolGrade, 2) as AvgGrade
            FROM AvgGradeOfStudents
            ORDER BY AvgUniversityHighSchoolGrade DESC;
        `;

        const [results] = await pool.query(query);
        
        res.json({
            success: true,
            universities: results
        });
    } catch (error) {
        console.error('Error fetching university grades:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching university data'
        });
    }
});

app.get('/api/students/university-fit', async (req, res) => {
    try {
        const { studentId, universityId } = req.query;
        
        const query = `
            WITH StudentAvg AS (
                SELECT 
                    StudentID,
                    AVG(HighSchoolGrade) AS AvgStudentGrade
                FROM HighSchoolGrade
                WHERE StudentID = ?
                GROUP BY StudentID
            ),
            UnivAvg AS (
                SELECT 
                    u.UniversityID,
                    u.UniversityName,
                    AVG(hg.HighSchoolGrade) AS AvgUniversityHighSchoolGrade
                FROM University u
                LEFT JOIN UniversityStudent us ON u.UniversityID = us.UniversityID
                LEFT JOIN HighSchoolGrade hg ON us.StudentID = hg.StudentID
                GROUP BY u.UniversityID, u.UniversityName
            )
            SELECT 
                sa.StudentID,
                ua.UniversityID,
                ua.UniversityName,
                ROUND(sa.AvgStudentGrade, 2) as StudentAverage,
                ROUND(ua.AvgUniversityHighSchoolGrade, 2) as UniversityAverage,
                ROUND(
                    (sa.AvgStudentGrade - ua.AvgUniversityHighSchoolGrade), 
                    2
                ) AS GradeDifference
            FROM StudentAvg sa
            CROSS JOIN UnivAvg ua
            ${universityId ? 'WHERE ua.UniversityID = ?' : ''}
            ORDER BY GradeDifference DESC;
        `;

        const params = universityId ? [studentId, universityId] : [studentId];
        const [results] = await pool.query(query, params);
        
        // Ensure numbers are properly formatted
        const formattedResults = results.map(match => ({
            ...match,
            StudentAverage: parseFloat(match.StudentAverage),
            UniversityAverage: parseFloat(match.UniversityAverage),
            GradeDifference: parseFloat(match.GradeDifference)
        }));

        res.json({
            success: true,
            matches: formattedResults
        });
    } catch (error) {
        console.error('Error fetching university matches:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching university matches'
        });
    }
});

// Initialize database and start server
async function startServer() {
    try {
        connection = await initializeDatabase();


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

        app.get('/api/students/search', async (req, res) => {
            try {
                const { term, type } = req.query;
                
                let query;
                let searchValue;

                if (!term.trim()) {
                    // If search term is empty, return all students
                    query = `
                        SELECT 
                            StudentID,
                            FirstName,
                            LastName,
                            Address
                        FROM student
                        ORDER BY StudentID
                    `;
                    searchValue = [];
                } else {
                    // If search term exists, filter by term and type
                    query = `
                        SELECT 
                            StudentID,
                            FirstName,
                            LastName,
                            Address
                        FROM student
                        WHERE ${type === 'id' ? 'StudentID = ?' : "CONCAT(FirstName, ' ', LastName) LIKE ?"}
                        ORDER BY StudentID
                    `;
                    searchValue = [type === 'id' ? term : `%${term}%`];
                }
                
                const [students] = await pool.query(query, searchValue);

                res.json({
                    success: true,
                    students: students
                });

            } catch (error) {
                console.error('Search error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error searching for students'
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