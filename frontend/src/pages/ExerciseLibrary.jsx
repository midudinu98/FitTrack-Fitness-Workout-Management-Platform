import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const ExerciseLibrary = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const fetchExercises = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/exercises/");
            setExercises(response.data);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to load exercises."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExercises();
    }, []);

    const filteredExercises = exercises.filter((exercise) => {
        const matchesSearch = exercise.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" ||
            exercise.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="exercise-library-container">

            <header className="exercise-library-header">
                <div>
                    <h1>Exercise Library</h1>
                    <p>
                        Explore exercises and build your workout routine.
                    </p>
                </div>

                <Link to="/dashboard">
                    Back to Dashboard
                </Link>
            </header>

            <section className="exercise-library-controls">

                <input
                    type="text"
                    placeholder="Search exercises by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Strength">Strength</option>
                    <option value="Yoga">Yoga</option>
                </select>

            </section>

            <div className="exercise-library-summary">
                <h2>Available Exercises</h2>
                <p>
                    Showing {filteredExercises.length} of {exercises.length} exercises
                </p>
            </div>

            {error && (
                <p className="exercise-error">{error}</p>
            )}

            {loading ? (
                <p>Loading exercises...</p>
            ) : filteredExercises.length === 0 ? (
                <div className="exercise-empty">
                    <h3>No exercises found</h3>
                    <p>
                        Try another search term or select a different category.
                    </p>
                </div>
            ) : (
                <div className="exercise-list">

                    {filteredExercises.map((exercise) => (
                        <div
                            className="exercise-card"
                            key={exercise.id}
                        >
                            <div className="exercise-card-header">
                                <h3>{exercise.name}</h3>

                                <span className={`exercise-category ${exercise.category.toLowerCase()}`}>
                                    {exercise.category}
                                </span>
                            </div>

                            <p>
                                {exercise.description ||
                                    "No description available."}
                            </p>

                            <div className="exercise-duration">
                                Duration: {exercise.duration} minutes
                            </div>
                        </div>
                    ))}

                </div>
            )}

        </div>
    );
};

export default ExerciseLibrary;