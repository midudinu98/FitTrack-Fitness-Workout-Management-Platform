from .user import UserCreate,UserLogin,UserResponse
from .workout import WorkoutCreate, WorkoutUpdate, WorkoutResponse
from .progress import ProgressResponse
from .goal import GoalCreate, GoalUpdate, GoalResponse
from .notification import NotificationResponse, NotificationUpdate
from .workout_plan import WorkoutPlanCreate,WorkoutPlanResponse
from .exercise import ExerciseCreate,ExerciseResponse
from .workout_exercise import WorkoutExerciseCreate,WorkoutExerciseResponse
from .streak import StreakResponse
from .badge import UserBadgeResponse,BadgeResponse,BadgeStatusResponse
from .meal import MealCreate,MealResponse,NutritionSummary
from .water_tracking import WaterTrackingCreate,WaterTrackingResponse,WaterSummary
from .recommendation import ExerciseSuggestion,WorkoutRecommendation,RecommendationResponse
from .analytics import WeeklyPerformance,MonthlyPerformance,GoalAnalytics,ConsistencyAnalytics,PerformanceInsights,AdvancedAnalyticsResponse
from .reminder import ReminderCreate,ReminderResponse,ReminderUpdate