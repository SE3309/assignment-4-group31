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
        const { 
            firstName, 
            lastName, 
            email, 
            currentHighSchool, 
            gradYear, 
            biography,
            grades // New grades object containing the 5 subjects
        } = req.body;

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

        // Insert grades into highschoolgrade table
        const gradeInsertQuery = 'INSERT INTO highschoolgrade (StudentID, HighSchoolCourseName, HighSchoolGrade) VALUES ?';
        const gradeValues = Object.entries(grades).map(([subject, grade]) => 
            [nextStudentId, subject, Number(grade)]
        );
        
        await pool.query(gradeInsertQuery, [gradeValues]);

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

app.get('/api/student-ratings/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const query = `
            SELECT StudentExperienceFactor, Rating 
            FROM studentexperienceweightings 
            WHERE StudentID = ?
        `;
        
        const [ratings] = await pool.query(query, [studentId]);
        
        // Ensure we're sending an array of ratings
        res.json({
            success: true,
            ratings: ratings || [] // If no ratings found, send empty array
        });
    } catch (error) {
        console.error('Error fetching ratings:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch ratings',
            error: error.message 
        });
    }
});

app.post('/api/student-ratings', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { studentId, ratings } = req.body;

        // Validate input
        if (!studentId || !ratings || !Array.isArray(ratings)) {
            throw new Error('Invalid input data');
        }

        // Delete existing ratings for this student
        const deleteQuery = `
            DELETE FROM studentexperienceweightings 
            WHERE StudentID = ?
        `;
        await connection.query(deleteQuery, [studentId]);

        // Insert new ratings
        const insertQuery = `
            INSERT INTO studentexperienceweightings 
            (StudentID, StudentExperienceFactor, Rating) 
            VALUES ?
        `;

        const values = ratings.map(rating => [
            rating.StudentID,
            rating.StudentExperienceFactor,
            rating.Rating
        ]);

        await connection.query(insertQuery, [values]);
        await connection.commit();
        
        res.json({ 
            success: true, 
            message: 'Ratings updated successfully' 
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error updating ratings:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update ratings',
            error: error.message 
        });
    } finally {
        connection.release();
    }
});

app.put('/api/student-ratings/:studentId/:factor', async (req, res) => {
    try {
        const { studentId, factor } = req.params;
        const { rating } = req.body;

        // Validate rating value
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rating must be between 1 and 5' 
            });
        }

        const query = `
            UPDATE studentexperienceweightings 
            SET Rating = ? 
            WHERE StudentID = ? AND StudentExperienceFactor = ?
        `;
        
        await pool.query(query, [rating, studentId, factor]);
        
        res.json({ 
            success: true, 
            message: 'Rating updated successfully' 
        });

    } catch (error) {
        console.error('Error updating single rating:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update rating',
            error: error.message 
        });
    }
});

app.delete('/api/student-ratings/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const query = `
            DELETE FROM studentexperienceweightings 
            WHERE StudentID = ?
        `;
        
        await pool.query(query, [studentId]);
        
        res.json({ 
            success: true, 
            message: 'Ratings deleted successfully' 
        });

    } catch (error) {
        console.error('Error deleting ratings:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete ratings',
            error: error.message 
        });
    }
});

// Add this new endpoint
app.get('/api/top-students', async (req, res) => {
    try {
        const query = `
            SELECT
                s.StudentID,
                s.firstName,
                s.lastName,
                us.UniversityName,
                us.ProgramName
            FROM
                Student s
            JOIN 
                UniversityStudent us ON s.StudentID = us.StudentID
            WHERE EXISTS (
                SELECT 1
                FROM HighSchoolGrade hg
                WHERE hg.StudentID = s.StudentID
                GROUP BY us.UniversityName, us.ProgramName
                HAVING AVG(hg.HighSchoolGrade) > 90
            )`;
        
        const [results] = await pool.query(query);
        res.json({
            success: true,
            topStudents: results
        });
    } catch (error) {
        console.error('Error fetching top students:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch top students',
            error: error.message
        });
    }
});

app.get('/api/programs/:universityName/:programName/tuition', async (req, res) => {
    try {
        const { universityName, programName } = req.params;
        const [result] = await pool.query(
            'SELECT tuition FROM program WHERE universityName = ? AND programName = ?',
            [universityName, programName]
        );

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Program not found'
            });
        }

        res.json({
            success: true,
            tuition: result[0].tuition
        });
    } catch (error) {
        console.error('Error fetching tuition:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tuition'
        });
    }
});

app.get('/api/students/:studentId/similar-grades', async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const query = `
            WITH StudentGrades AS (
                SELECT 
                    StudentID, 
                    AVG(HighSchoolGrade) AS AvgStudentGrade
                FROM HighSchoolGrade
                WHERE StudentID = ?
                GROUP BY StudentID
            ),
            AllUniversityAvgs AS (
                SELECT 
                    UniversityName,
                    AVG(hg.HighSchoolGrade) AS AvgUniversityHighSchoolGrade
                FROM UniversityStudent us
                JOIN HighSchoolGrade hg ON us.StudentID = hg.StudentID
                GROUP BY UniversityName
            )
            SELECT 
                sg.StudentID,
                au.UniversityName,
                ROUND(au.AvgUniversityHighSchoolGrade - sg.AvgStudentGrade, 2) AS GradeDifference,
                ROUND(au.AvgUniversityHighSchoolGrade, 2) AS UniversityAvg,
                ROUND(sg.AvgStudentGrade, 2) AS StudentAvg
            FROM StudentGrades sg
            CROSS JOIN AllUniversityAvgs au
            ORDER BY ABS(au.AvgUniversityHighSchoolGrade - sg.AvgStudentGrade) ASC
            LIMIT 10;
        `;

        const [results] = await pool.query(query, [studentId]);

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No similar grades found or student not found'
            });
        }

        res.json({
            success: true,
            results: results
        });

    } catch (error) {
        console.error('Error fetching similar grades:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching similar grades',
            error: error.message
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

       


        // Get all universities with their student count
        app.get('/api/universities', async (req, res) => {
            try {
                const [universities] = await pool.query(
                    'SELECT universityName, city, numOfStudents FROM university ORDER BY universityName'
                );
                res.json(universities);
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

        // Add new endpoint to update university tuition
        app.put('/api/universities/:universityName', async (req, res) => {
            const connection = await pool.getConnection();
            try {
                const { universityName } = req.params;
                const { tuition } = req.body;

                // Input validation
                if (!tuition || isNaN(tuition) || tuition < 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid tuition value'
                    });
                }

                await connection.beginTransaction();

                const [result] = await connection.query(
                    'UPDATE university SET tuition = ? WHERE universityName = ?',
                    [tuition, universityName]
                );

                if (result.affectedRows === 0) {
                    await connection.rollback();
                    return res.status(404).json({
                        success: false,
                        message: 'University not found'
                    });
                }

                await connection.commit();

                res.json({
                    success: true,
                    message: 'University tuition updated successfully'
                });

            } catch (error) {
                await connection.rollback();
                console.error('Error updating university tuition:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error updating university tuition'
                });
            } finally {
                connection.release();
            }
        });

        // Get programs for a specific university
        app.get('/api/programs/:universityName', async (req, res) => {
            try {
                const [programs] = await pool.query(
                    'SELECT programName, degree, programLength, tuition FROM program WHERE universityName = ?',
                    [req.params.universityName]
                );
                res.json(programs);
            } catch (error) {
                console.error('Error fetching programs:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error fetching programs'
                });
            }
        });

        // Update program tuition
        app.put('/api/programs/:universityName/:programName', async (req, res) => {
            const { universityName, programName } = req.params;
            const { tuition } = req.body;

            if (!tuition || isNaN(tuition) || tuition < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid tuition value'
                });
            }

            try {
                const [result] = await pool.query(
                    'UPDATE program SET tuition = ? WHERE universityName = ? AND programName = ?',
                    [tuition, universityName, programName]
                );

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Program not found'
                    });
                }

                res.json({
                    success: true,
                    message: 'Tuition updated successfully'
                });
            } catch (error) {
                console.error('Error updating tuition:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error updating tuition'
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