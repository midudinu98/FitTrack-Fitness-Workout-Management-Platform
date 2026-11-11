import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const Nutrition = () => {
    const [meals, setMeals] = useState([]);
    const [summary, setSummary] = useState({
        total_calories: 0,
        total_protein: 0,
        total_carbs: 0,
        total_fats: 0,
        total_meals: 0
    });

    const [mealData, setMealData] = useState({
        meal_type: "Breakfast",
        food_name: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: ""
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchNutrition = async () => {
        try {
            const [mealsResponse, summaryResponse] = await Promise.all([
                API.get("/meals/"),
                API.get("/meals/summary")
            ]);

            setMeals(mealsResponse.data);
            setSummary(summaryResponse.data);
            setError("");
        } catch (err) {
            setError("Unable to load nutrition details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNutrition();
    }, []);

    const handleChange = (e) => {
        setMealData({
            ...mealData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!mealData.food_name.trim()) {
            setError("Please enter a food name.");
            return;
        }

        try {
            setSubmitting(true);

            const payload = {
                ...mealData,
                food_name: mealData.food_name.trim(),
                calories: Number(mealData.calories),
                protein: Number(mealData.protein),
                carbs: Number(mealData.carbs),
                fats: Number(mealData.fats)
            };

            await API.post("/meals/", payload);

            setSuccess("Meal added successfully!");

            setMealData({
                meal_type: "Breakfast",
                food_name: "",
                calories: "",
                protein: "",
                carbs: "",
                fats: ""
            });

            await fetchNutrition();

        } catch (err) {
            setError(
                err.response?.data?.detail || "Unable to add meal. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="nutrition-container">

            <header className="nutrition-header">
                <div>
                    <h1>Nutrition & Meal Tracking</h1>
                    <p>Track your daily food intake and nutrition.</p>
                </div>
            </header>

            {/* Daily Nutrition Summary */}

            <section className="nutrition-summary">
                <div className="nutrition-card calories-card">
                    <h3>Calories</h3>
                    <h2>{Number(summary.total_calories).toFixed(0)}</h2>
                    <p>kcal consumed today</p>
                </div>

                <div className="nutrition-card protein-card">
                    <h3>Protein</h3>
                    <h2>{Number(summary.total_protein).toFixed(1)} g</h2>
                    <p>Total protein today</p>
                </div>

                <div className="nutrition-card carbs-card">
                    <h3>Carbohydrates</h3>
                    <h2>{Number(summary.total_carbs).toFixed(1)} g</h2>
                    <p>Total carbs today</p>
                </div>

                <div className="nutrition-card fats-card">
                    <h3>Fats</h3>
                    <h2>{Number(summary.total_fats).toFixed(1)} g</h2>
                    <p>Total fats today</p>
                </div>
            </section>

            {/* Add Meal Form */}

            <section className="nutrition-form-section">
                <h2>Add Meal</h2>

                <form onSubmit={handleSubmit} className="nutrition-form">

                    <div className="form-group">
                        <label>Meal Type</label>
                        <select
                            name="meal_type"
                            value={mealData.meal_type}
                            onChange={handleChange}
                        >
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                            <option value="Snacks">Snacks</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Food Name</label>
                        <input
                            type="text"
                            name="food_name"
                            placeholder="Enter food name"
                            value={mealData.food_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="nutrition-input-grid">

                        <div className="form-group">
                            <label>Calories (kcal)</label>
                            <input
                                type="number"
                                name="calories"
                                min="0"
                                step="any"
                                placeholder="Calories"
                                value={mealData.calories}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Protein (g)</label>
                            <input
                                type="number"
                                name="protein"
                                min="0"
                                step="any"
                                placeholder="Protein"
                                value={mealData.protein}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Carbs (g)</label>
                            <input
                                type="number"
                                name="carbs"
                                min="0"
                                step="any"
                                placeholder="Carbs"
                                value={mealData.carbs}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Fats (g)</label>
                            <input
                                type="number"
                                name="fats"
                                min="0"
                                step="any"
                                placeholder="Fats"
                                value={mealData.fats}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    {error && (
                        <div className="error-message">{error}</div>
                    )}

                    {success && (
                        <div className="success-message">{success}</div>
                    )}

                    <button
                        type="submit"
                        className="add-meal-button"
                        disabled={submitting}
                    >
                        {submitting ? "Adding Meal..." : "+ Add Meal"}
                    </button>

                </form>
            </section>

            {/* Meal History */}

            <section className="meal-history-section">
                <h2>Meal History</h2>

                {loading && <p>Loading meals...</p>}

                {!loading && meals.length === 0 && (
                    <div className="empty-meals">
                        <h3>No meals recorded</h3>
                        <p>Start tracking your daily nutrition by adding a meal.</p>
                    </div>
                )}

                {!loading && meals.length > 0 && (
                    <div className="meal-list">
                        {meals.map((meal) => (
                            <div className="meal-card" key={meal.id}>
                                <div className="meal-card-header">
                                    <div>
                                        <span className="meal-type">
                                            {meal.meal_type}
                                        </span>
                                        <h3>{meal.food_name}</h3>
                                    </div>

                                    <strong>
                                        {Number(meal.calories).toFixed(0)} kcal
                                    </strong>
                                </div>

                                <div className="meal-nutrients">
                                    <span>Protein: {meal.protein} g</span>
                                    <span>Carbs: {meal.carbs} g</span>
                                    <span>Fats: {meal.fats} g</span>
                                </div>

                                <p className="meal-date">
                                    {meal.created_at
                                        ? new Date(meal.created_at).toLocaleString()
                                        : ""}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <Link to="/dashboard" className="back-link">
                Back to Dashboard
            </Link>

        </div>
    );
};

export default Nutrition;