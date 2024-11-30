import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AddExperience.css';

const AddExperience = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [ratings, setRatings] = useState({
        CareerRating: 1,
        FacilitiesRating: 1,
        LearningEnviroRating: 1,
        ScholarshipRating: 1,
        StudentSatisfactionRating: 1
    });

    useEffect(() => {
        const fetchExistingRatings = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/student-ratings/${studentId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && Array.isArray(data.ratings)) {
                        const formattedRatings = {};
                        data.ratings.forEach(rating => {
                            formattedRatings[rating.StudentExperienceFactor] = rating.Rating;
                        });
                        setRatings(prev => ({
                            ...prev,
                            ...formattedRatings
                        }));
                    }
                }
            } catch (error) {
                console.error('Error fetching existing ratings:', error);
            }
        };
        fetchExistingRatings();
    }, [studentId]);

    const handleChange = (factor, value) => {
        setRatings(prev => ({
            ...prev,
            [factor]: parseInt(value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const ratingEntries = Object.entries(ratings).map(([factor, rating]) => ({
                StudentID: parseInt(studentId),
                StudentExperienceFactor: factor,
                Rating: rating
            }));

            const response = await fetch('http://localhost:3001/api/student-ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId: parseInt(studentId),
                    ratings: ratingEntries
                }),
            });

            if (response.ok) {
                alert('Ratings submitted successfully!');
                navigate(-1);
            } else {
                throw new Error('Failed to submit ratings');
            }
        } catch (error) {
            console.error('Error submitting ratings:', error);
            alert('Failed to submit ratings');
        }
    };

    return (
        <div className="add-experience-container">
            <h2>Add Experience Ratings for Student ID: {studentId}</h2>
            <form onSubmit={handleSubmit} className="experience-form">
                {Object.keys(ratings).map((factor) => (
                    <div className="form-group" key={factor}>
                        <label>{factor.replace(/([A-Z])/g, ' $1').trim()}:</label>
                        <div className="rating-input">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <label key={value} className="rating-label">
                                    <input
                                        type="radio"
                                        name={factor}
                                        value={value}
                                        checked={ratings[factor] === value}
                                        onChange={(e) => handleChange(factor, e.target.value)}
                                    />
                                    {value}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="button-group">
                    <button type="submit" className="submit-btn">Submit Ratings</button>
                    <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddExperience; 