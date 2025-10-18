from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Depends
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
import json

from models import Puzzle, PuzzleCreate, PuzzleUpdate, PuzzleImage
from cloudinary_service import (
    upload_puzzle_image,
    generate_thumbnail_url,
    generate_all_difficulty_pieces,
    delete_puzzle_image,
    configure_cloudinary
)

router = APIRouter(prefix="/admin", tags=["admin"])

# Initialize Cloudinary on module load
configure_cloudinary()


# Dependency to get database
async def get_db():
    from server import db
    return db


@router.post("/puzzles", response_model=Puzzle)
async def create_puzzle(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    category: str = Form("General"),
    tags: str = Form("[]"),  # JSON string of tags
    difficulty_available: str = Form('["easy", "medium", "hard", "expert"]'),
    status: str = Form("published"),
    is_featured: bool = Form(False),
    display_order: int = Form(0),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Upload a new puzzle image and create puzzle entry.
    Generates piece URLs for all difficulty levels.
    """
    try:
        # Parse JSON strings
        tags_list = json.loads(tags) if tags else []
        difficulty_list = json.loads(difficulty_available)
        
        # Upload image to Cloudinary
        upload_result = await upload_puzzle_image(file)
        
        # Generate thumbnail URL
        thumbnail = generate_thumbnail_url(upload_result["cloudinary_public_id"])
        
        # Generate puzzle pieces for all difficulties
        piece_data = generate_all_difficulty_pieces(
            upload_result["cloudinary_public_id"],
            upload_result["width"],
            upload_result["height"]
        )
        
        # Create puzzle object
        puzzle = Puzzle(
            title=title,
            description=description,
            category=category,
            tags=tags_list,
            original_image=PuzzleImage(
                cloudinary_public_id=upload_result["cloudinary_public_id"],
                url=upload_result["url"],
                width=upload_result["width"],
                height=upload_result["height"],
                format=upload_result["format"]
            ),
            thumbnail_url=thumbnail,
            piece_data=piece_data,
            difficulty_available=difficulty_list,
            status=status,
            is_featured=is_featured,
            display_order=display_order
        )
        
        # Save to MongoDB
        puzzle_dict = puzzle.model_dump()
        puzzle_dict["created_at"] = puzzle_dict["created_at"].isoformat()
        puzzle_dict["updated_at"] = puzzle_dict["updated_at"].isoformat()
        
        await db.puzzles.insert_one(puzzle_dict)
        
        return puzzle
    
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON in tags or difficulty_available")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create puzzle: {str(e)}")


@router.get("/puzzles", response_model=List[Puzzle])
async def get_all_puzzles(
    status: Optional[str] = None,
    category: Optional[str] = None,
    is_featured: Optional[bool] = None,
    skip: int = 0,
    limit: int = 50,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Get all puzzles with optional filters
    """
    query = {}
    
    if status:
        query["status"] = status
    if category:
        query["category"] = category
    if is_featured is not None:
        query["is_featured"] = is_featured
    
    puzzles = await db.puzzles.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    # Convert ISO string timestamps back to datetime
    for puzzle in puzzles:
        if isinstance(puzzle.get("created_at"), str):
            puzzle["created_at"] = datetime.fromisoformat(puzzle["created_at"])
        if isinstance(puzzle.get("updated_at"), str):
            puzzle["updated_at"] = datetime.fromisoformat(puzzle["updated_at"])
    
    return puzzles


@router.get("/puzzles/{puzzle_id}", response_model=Puzzle)
async def get_puzzle(
    puzzle_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Get a single puzzle by ID
    """
    puzzle = await db.puzzles.find_one({"id": puzzle_id}, {"_id": 0})
    
    if not puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")
    
    # Convert ISO string timestamps back to datetime
    if isinstance(puzzle.get("created_at"), str):
        puzzle["created_at"] = datetime.fromisoformat(puzzle["created_at"])
    if isinstance(puzzle.get("updated_at"), str):
        puzzle["updated_at"] = datetime.fromisoformat(puzzle["updated_at"])
    
    return puzzle


@router.put("/puzzles/{puzzle_id}", response_model=Puzzle)
async def update_puzzle(
    puzzle_id: str,
    update_data: PuzzleUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Update puzzle metadata (not the image)
    """
    # Check if puzzle exists
    existing_puzzle = await db.puzzles.find_one({"id": puzzle_id}, {"_id": 0})
    if not existing_puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")
    
    # Prepare update data
    update_dict = update_data.model_dump(exclude_unset=True)
    
    if update_dict:
        update_dict["updated_at"] = datetime.utcnow().isoformat()
        
        # Update in MongoDB
        await db.puzzles.update_one(
            {"id": puzzle_id},
            {"$set": update_dict}
        )
    
    # Fetch and return updated puzzle
    updated_puzzle = await db.puzzles.find_one({"id": puzzle_id}, {"_id": 0})
    
    # Convert ISO string timestamps back to datetime
    if isinstance(updated_puzzle.get("created_at"), str):
        updated_puzzle["created_at"] = datetime.fromisoformat(updated_puzzle["created_at"])
    if isinstance(updated_puzzle.get("updated_at"), str):
        updated_puzzle["updated_at"] = datetime.fromisoformat(updated_puzzle["updated_at"])
    
    return updated_puzzle


@router.delete("/puzzles/{puzzle_id}")
async def delete_puzzle(
    puzzle_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Delete a puzzle and its associated Cloudinary image
    """
    # Find puzzle
    puzzle = await db.puzzles.find_one({"id": puzzle_id}, {"_id": 0})
    
    if not puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")
    
    # Delete from Cloudinary
    public_id = puzzle["original_image"]["cloudinary_public_id"]
    await delete_puzzle_image(public_id)
    
    # Delete from MongoDB
    await db.puzzles.delete_one({"id": puzzle_id})
    
    return {"success": True, "message": "Puzzle deleted successfully"}


@router.get("/puzzles/{puzzle_id}/pieces/{difficulty}")
async def get_puzzle_pieces(
    puzzle_id: str,
    difficulty: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Get puzzle pieces for a specific difficulty level
    """
    puzzle = await db.puzzles.find_one({"id": puzzle_id}, {"_id": 0})
    
    if not puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")
    
    if difficulty not in puzzle.get("piece_data", {}):
        raise HTTPException(status_code=400, detail=f"Difficulty '{difficulty}' not available for this puzzle")
    
    return {
        "puzzle_id": puzzle_id,
        "difficulty": difficulty,
        "pieces": puzzle["piece_data"][difficulty]
    }
