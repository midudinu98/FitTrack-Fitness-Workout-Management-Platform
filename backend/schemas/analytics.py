from pydantic import BaseModel
from typing import List

class WeeklyPerformance(BaseModel):
    week: str
    workouts: int
    duration: int
    calories: float

class MonthlyPerformance(BaseModel):
    month: str
    workouts: int
    duration: int
    calories: float

class GoalAnalytics(BaseModel):
    total_goals: int
    completed_goals: int
    completion_rate: float

class ConsistencyAnalytics(BaseModel):
    total_workout_days: int
    total_days: int
    consistency_rate: float
    current_streak: int
    longest_streak: int

class PerformanceInsights(BaseModel):
    total_workouts: int
    total_duration: int
    total_calories: float
    average_duration: float
    average_calories: float
    most_frequent_category: str
    insights: List[str]

class AdvancedAnalyticsResponse(BaseModel):
    weekly_performance: List[WeeklyPerformance]
    monthly_performance: List[MonthlyPerformance]
    goal_analytics: GoalAnalytics
    consistency: ConsistencyAnalytics
    performance_insights: PerformanceInsights