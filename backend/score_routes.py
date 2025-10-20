from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timedelta

from models import Score, ScoreCreate

router = APIRouter(prefix="/scores", tags=["scores"])


# Dependency to get database
async def get_db():
    from server import db
    return db


@router.post("", response_model=Score)
async def submit_score(
    score_data: ScoreCreate,
    user_id: Optional[str] = None,  # TODO: get from auth token
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Submit a score after completing a puzzle.
    Guest users can submit without user_id (will be marked as guest).
    """
    try:
        # Calculate score based on difficulty, time, and moves
        from utils.scoring import calculate_game_score
        
        calculated_score = calculate_game_score(
            score_data.difficulty,
            score_data.completion_time,
            score_data.moves
        )
        
        # Create score object
        score = Score(
            user_id=user_id or "guest",
            puzzle_id=score_data.puzzle_id,
            completion_time=score_data.completion_time,
            moves=score_data.moves,
            difficulty=score_data.difficulty,
            score=calculated_score
        )
        
        # Save to MongoDB
        score_dict = score.model_dump()
        score_dict["completed_at"] = score_dict["completed_at"].isoformat()
        
        await db.scores.insert_one(score_dict)
        
        # Update puzzle stats
        await db.puzzles.update_one(
            {"id": score_data.puzzle_id},
            {
                "$inc": {"metadata.total_completions": 1}
            }
        )
        
        return score
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit score: {str(e)}")


@router.get("/leaderboard", response_model=List[dict])
async def get_leaderboard(
    puzzle_id: Optional[str] = None,
    difficulty: Optional[str] = None,
    timeframe: Optional[str] = "all-time",  # daily, weekly, monthly, all-time
    limit: int = 100,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Get leaderboard with optional filters.
    """
    query = {}
    
    # Filter by puzzle
    if puzzle_id:
        query["puzzle_id"] = puzzle_id
    
    # Filter by difficulty
    if difficulty:
        query["difficulty"] = difficulty
    
    # Filter by timeframe
    if timeframe != "all-time":
        now = datetime.utcnow()
        if timeframe == "daily":
            query["completed_at"] = {"$gte": (now - timedelta(days=1)).isoformat()}
        elif timeframe == "weekly":
            query["completed_at"] = {"$gte": (now - timedelta(weeks=1)).isoformat()}
        elif timeframe == "monthly":
            query["completed_at"] = {"$gte": (now - timedelta(days=30)).isoformat()}
    
    # Get scores sorted by score (highest first)
    scores = await db.scores.find(query, {"_id": 0}).sort("score", -1).limit(limit).to_list(limit)
    
    # Add rank and user info
    leaderboard = []
    for idx, score in enumerate(scores):
        # Convert ISO string back to datetime if needed
        if isinstance(score.get("completed_at"), str):
            score["completed_at"] = datetime.fromisoformat(score["completed_at"])
        
        # Get user info (if not guest)
        user_info = {"username": "Guest", "avatar": None}
        if score["user_id"] != "guest":
            user = await db.users.find_one({"id": score["user_id"]}, {"_id": 0, "username": 1, "avatar": 1})
            if user:
                user_info = user
        
        # Get puzzle info
        puzzle = await db.puzzles.find_one({"id": score["puzzle_id"]}, {"_id": 0, "title": 1, "thumbnail_url": 1})
        
        leaderboard.append({
            "rank": idx + 1,
            "score_id": score["id"],
            "user": user_info,
            "puzzle": puzzle or {"title": "Unknown"},
            "score": score["score"],
            "completion_time": score["completion_time"],
            "moves": score["moves"],
            "difficulty": score["difficulty"],
            "completed_at": score["completed_at"].isoformat() if isinstance(score["completed_at"], datetime) else score["completed_at"]
        })
    
    return leaderboard


@router.get("/user/{user_id}", response_model=List[Score])
async def get_user_scores(
    user_id: str,
    limit: int = 20,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Get all scores for a specific user.
    """
    scores = await db.scores.find({"user_id": user_id}, {"_id": 0}).sort("completed_at", -1).limit(limit).to_list(limit)
    
    # Convert ISO strings back to datetime
    for score in scores:
        if isinstance(score.get("completed_at"), str):
            score["completed_at"] = datetime.fromisoformat(score["completed_at"])
    
    return scores


@router.get("/puzzle/{puzzle_id}", response_model=List[dict])
async def get_puzzle_leaderboard(
    puzzle_id: str,
    difficulty: Optional[str] = None,
    limit: int = 10,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Get top scores for a specific puzzle.
    """
    query = {"puzzle_id": puzzle_id}
    
    if difficulty:
        query["difficulty"] = difficulty
    
    scores = await db.scores.find(query, {"_id": 0}).sort("score", -1).limit(limit).to_list(limit)
    
    leaderboard = []
    for idx, score in enumerate(scores):
        # Get user info
        user_info = {"username": "Guest", "avatar": None}
        if score["user_id"] != "guest":
            user = await db.users.find_one({"id": score["user_id"]}, {"_id": 0, "username": 1, "avatar": 1})
            if user:
                user_info = user
        
        leaderboard.append({
            "rank": idx + 1,
            "user": user_info,
            "score": score["score"],
            "completion_time": score["completion_time"],
            "moves": score["moves"],
            "difficulty": score["difficulty"]
        })
    
    return leaderboard


# Admin routes for score management
@router.delete("/admin/{score_id}")
async def delete_score(
    score_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Admin: Delete a score (for fraudulent entries)
    """
    result = await db.scores.delete_one({"id": score_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Score not found")
    
    return {"success": True, "message": "Score deleted"}


@router.post("/admin/{score_id}/flag")
async def flag_score(
    score_id: str,
    reason: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Admin: Flag a score as suspicious
    """
    result = await db.scores.update_one(
        {"id": score_id},
        {"$set": {"is_validated": False, "flag_reason": reason}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Score not found")
    
    return {"success": True, "message": "Score flagged"}
