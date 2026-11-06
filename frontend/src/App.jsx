import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import AddWorkout from "./pages/AddWorkout";
import Workouts from "./pages/Workouts";
import EditWorkout from "./pages/EditWorkout";

import Progress from "./pages/Progress";

import Goals from "./pages/Goals";

import Reports from "./pages/Reports";

import WorkoutPlans from "./pages/WorkoutPlans";

import ExerciseLibrary from "./pages/ExerciseLibrary";
import AddExercisesToWorkout from "./pages/AddExercisesToWorkout";

import ProgressComparison from "./pages/ProgressComparison";

import StreakTracking from "./pages/StreakTracking";

import AchievementBadges from "./pages/AchievementBadges";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/dashboard"element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
                
                <Route path="/workouts"element={<ProtectedRoute><Workouts /></ProtectedRoute>}/>

                <Route path="/workouts/add"element={<ProtectedRoute><AddWorkout /></ProtectedRoute>}/>

                <Route path="/workouts/edit/:workoutId"element={<ProtectedRoute><EditWorkout /></ProtectedRoute>}/>

                <Route path="/progress"element={<ProtectedRoute><Progress /></ProtectedRoute>}/>

                <Route path="/goals"element={<ProtectedRoute><Goals /></ProtectedRoute>}/>

                <Route path="/reports"element={<ProtectedRoute><Reports /></ProtectedRoute>}/>
                
                <Route path="/workout-plans"element={<ProtectedRoute><WorkoutPlans /></ProtectedRoute>}/>
                
                <Route path="/exercise-library"element={<ProtectedRoute><ExerciseLibrary /></ProtectedRoute>}/>

                <Route path="/add-exercises-to-workout"element={<ProtectedRoute><AddExercisesToWorkout /></ProtectedRoute>}/>
                
                <Route path="/progress-comparison"element={<ProtectedRoute><ProgressComparison /></ProtectedRoute>}/>
                  
                <Route path="/streak-tracking"element={<ProtectedRoute><StreakTracking /></ProtectedRoute>}/>

                <Route path="/achievement-badges"element={<ProtectedRoute><AchievementBadges /></ProtectedRoute>}/>
                 
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;