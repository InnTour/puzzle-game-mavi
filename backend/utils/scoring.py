"""Scoring utilities for puzzle game"""

def calculate_game_score(difficulty: str, completion_time_ms: int, moves: int) -> int:
    """
    Calculate score based on difficulty, time, and moves.
    
    Formula: (base_score * difficulty_multiplier) - time_penalty - move_penalty
    
    Args:
        difficulty: Difficulty level
        completion_time_ms: Time in milliseconds
        moves: Number of moves made
    
    Returns:
        Final score (minimum 0)
    """
    # Difficulty multipliers
    multipliers = {
        "beginner": 0.5,
        "easy": 1.0,
        "medium": 1.5,
        "hard": 2.0,
        "expert": 2.5,
        "master": 3.0,
    }
    
    base_score = 10000
    multiplier = multipliers.get(difficulty, 1.0)
    
    # Time penalty (2 points per second)
    time_seconds = completion_time_ms / 1000
    time_penalty = int(time_seconds * 2)
    
    # Move penalty (10 points per move)
    move_penalty = moves * 10
    
    # Calculate final score
    final_score = int((base_score * multiplier) - time_penalty - move_penalty)
    
    return max(0, final_score)


def get_achievement_for_score(difficulty: str, completion_time_ms: int, moves: int, score: int) -> list:
    """
    Check which achievements were earned for this score.
    
    Returns:
        List of achievement IDs earned
    """
    achievements = []
    
    time_seconds = completion_time_ms / 1000
    
    # Speed achievements
    if time_seconds < 30:
        achievements.append("speed_demon")
    elif time_seconds < 60:
        achievements.append("quick_solver")
    
    # Efficiency achievements
    if difficulty == "easy" and moves <= 9:
        achievements.append("perfect_easy")
    elif difficulty == "medium" and moves <= 16:
        achievements.append("perfect_medium")
    elif difficulty == "hard" and moves <= 25:
        achievements.append("perfect_hard")
    
    # Difficulty achievements
    if difficulty == "expert":
        achievements.append("expert_solver")
    elif difficulty == "master":
        achievements.append("master_solver")
    
    # Score achievements
    if score >= 10000:
        achievements.append("high_scorer")
    if score >= 15000:
        achievements.append("score_master")
    
    return achievements


# Achievement definitions
ACHIEVEMENTS = {
    "speed_demon": {
        "id": "speed_demon",
        "name": "Speed Demon",
        "description": "Complete a puzzle in under 30 seconds",
        "icon": "⚡",
        "points": 100
    },
    "quick_solver": {
        "id": "quick_solver",
        "name": "Quick Solver",
        "description": "Complete a puzzle in under 1 minute",
        "icon": "⏱️",
        "points": 50
    },
    "perfect_easy": {
        "id": "perfect_easy",
        "name": "Perfect Easy",
        "description": "Complete Easy puzzle with minimum moves",
        "icon": "🎯",
        "points": 50
    },
    "perfect_medium": {
        "id": "perfect_medium",
        "name": "Perfect Medium",
        "description": "Complete Medium puzzle with minimum moves",
        "icon": "🎯",
        "points": 100
    },
    "perfect_hard": {
        "id": "perfect_hard",
        "name": "Perfect Hard",
        "description": "Complete Hard puzzle with minimum moves",
        "icon": "🎯",
        "points": 150
    },
    "expert_solver": {
        "id": "expert_solver",
        "name": "Expert Solver",
        "description": "Complete an Expert puzzle",
        "icon": "💎",
        "points": 200
    },
    "master_solver": {
        "id": "master_solver",
        "name": "Master Solver",
        "description": "Complete a Master puzzle",
        "icon": "👑",
        "points": 300
    },
    "high_scorer": {
        "id": "high_scorer",
        "name": "High Scorer",
        "description": "Achieve 10,000+ points",
        "icon": "🏆",
        "points": 100
    },
    "score_master": {
        "id": "score_master",
        "name": "Score Master",
        "description": "Achieve 15,000+ points",
        "icon": "⭐",
        "points": 200
    }
}
