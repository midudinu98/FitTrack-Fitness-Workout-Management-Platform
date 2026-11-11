import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const AddExercisesToWorkout = () => {
    const [workouts, setWorkouts] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState("");
    const [addedExercises, setAddedExercises] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Load workouts and exercises
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [workoutResponse, exerciseResponse] =
                    await Promise.all([
                        API.get("/workouts/"),
                        API.get("/exercises/")
                    ]);

                setWorkouts(workoutResponse.data);
                setExercises(exerciseResponse.data);
            } catch (err) {
                setError(
                    err.response?.data?.detail ||
                    "Unable to load workouts or exercises."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Load exercises already added to selected workout
    useEffect(() => {
        if (!selectedWorkout) {
            setAddedExercises([]);
            return;
        }

        const fetchAddedExercises = async () => {
            try {
                setError("");
                setSuccess("");

                const response = await API.get(
                    `/workout-exercises/${selectedWorkout}`
                );

                setAddedExercises(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.detail ||
                    "Unable to load exercises for this workout."
                );
            }
        };

        fetchAddedExercises();
    }, [selectedWorkout]);

    // Add exercise to selected workout
    const handleAddExercise = async (exerciseId) => {
        if (!selectedWorkout) {
            setError("Please select a workout first.");
            return;
        }

        try {
            setAddingId(exerciseId);
            setError("");
            setSuccess("");

            const response = await API.post("/workout-exercises/", {
                workout_id: Number(selectedWorkout),
                exercise_id: exerciseId
            });

            setAddedExercises((previous) => [
                ...previous,
                response.data
            ]);

            const exercise = exercises.find(
                (item) => item.id === exerciseId
            );

            setSuccess(
                `${exercise?.name || "Exercise"} added successfully!`
            );
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to add exercise to workout."
            );
        } finally {
            setAddingId(null);
        }
    };

    // Search and category filter
    const filteredExercises = exercises.filter((exercise) => {
        const matchesSearch = exercise.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" ||
            exercise.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const isExerciseAdded = (exerciseId) => {
        return addedExercises.some(
            (item) => item.exercise_id === exerciseId
        );
    };

    // Find exercise details for the selected workout
    const workoutExerciseDetails = addedExercises
        .map((item) =>
            exercises.find(
                (exercise) => exercise.id === item.exercise_id
            )
        )
        .filter(Boolean);

    if (loading) {
        return (
            <div className="add-exercises-container">
                <p>Loading workouts and exercises...</p>
            </div>
        );
    }

    return (
        <div className="add-exercises-container">

            <header className="add-exercises-header">
                <div>
                    <h1>Add Exercises to Workout</h1>
                    <p>
                        Choose a workout and add exercises from your library.
                    </p>
                </div>

                <Link to="/dashboard">
                    Back to Dashboard
                </Link>
            </header>

            {error && (
                <div className="exercise-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="exercise-success">
                    {success}
                </div>
            )}

            {/* Workout selection */}
            <section className="workout-selection">
                <label htmlFor="workout-select">
                    Select Workout
                </label>

                <select
                    id="workout-select"
                    value={selectedWorkout}
                    onChange={(e) => setSelectedWorkout(e.target.value)}
                >
                    <option value="">-- Choose a workout --</option>

                    {workouts.map((workout) => (
                        <option
                            key={workout.id}
                            value={workout.id}
                        >
                            {workout.workout_name} - {workout.workout_date}
                        </option>
                    ))}
                </select>

                {workouts.length === 0 && (
                    <p>
                        No workouts available. Please create a workout first.
                    </p>
                )}
            </section>

            {/* Exercises already added */}
            {selectedWorkout && (
                <section className="added-exercises-section">
                    <h2>Exercises Added to This Workout</h2>

                    {workoutExerciseDetails.length === 0 ? (
                        <p>No exercises added yet.</p>
                    ) : (
                        <div className="added-exercise-list">
                            {workoutExerciseDetails.map((exercise) => (
                                <span key={exercise.id}>
                                    {exercise.name}
                                </span>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Search and filter */}
            <section className="add-exercise-controls">
                <input
                    type="text"
                    placeholder="Search exercises..."
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

            <div className="add-exercise-summary">
                <h2>Available Exercises</h2>
                <p>
                    Showing {filteredExercises.length} of {exercises.length}
                </p>
            </div>

            {/* Exercise cards */}
            {filteredExercises.length === 0 ? (
                <div className="exercise-empty">
                    <h3>No exercises found</h3>
                    <p>Try another search or category.</p>
                </div>
            ) : (
                <div className="add-exercise-list">

                    {filteredExercises.map((exercise) => {
                        const alreadyAdded = isExerciseAdded(exercise.id);

                        return (
                            <div
                                className="add-exercise-card"
                                key={exercise.id}
                            >
                                <div className="add-exercise-card-header">
                                    <h3>{exercise.name}</h3>

                                    <span
                                        className={`exercise-category ${exercise.category.toLowerCase()}`}
                                    >
                                        {exercise.category}
                                    </span>
                                </div>

                                <p>
                                    {exercise.description ||
                                        "No description available."}
                                </p>

                                <p className="exercise-duration">
                                    Duration: {exercise.duration} minutes
                                </p>

                                <button
                                    disabled={
                                        !selectedWorkout ||
                                        alreadyAdded ||
                                        addingId === exercise.id
                                    }
                                    onClick={() =>
                                        handleAddExercise(exercise.id)
                                    }
                                >
                                    {alreadyAdded
                                        ? "Already Added"
                                        : addingId === exercise.id
                                            ? "Adding..."
                                            : "Add to Workout"}
                                </button>
                            </div>
                        );
                    })}

                </div>
            )}

            <div className="add-exercises-footer">
                <Link to="/exercise-library">
                    View Exercise Library
                </Link>

                <Link to="/workouts">
                    My Workouts
                </Link>
            </div>

        </div>
    );
};

export default AddExercisesToWorkout;