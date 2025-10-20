import cloudinary
import cloudinary.uploader
import cloudinary.api
from typing import Dict, List, Tuple
import os
import math
from fastapi import UploadFile, HTTPException

# Grid configurations
GRID_CONFIG = {
    "beginner": {"rows": 2, "cols": 2},
    "easy": {"rows": 3, "cols": 3},
    "medium": {"rows": 4, "cols": 4},
    "hard": {"rows": 5, "cols": 5},
    "expert": {"rows": 6, "cols": 6},
    "master": {"rows": 7, "cols": 7}
}


def configure_cloudinary():
    """Configure Cloudinary with environment variables"""
    cloudinary.config(
        cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
        api_key=os.getenv('CLOUDINARY_API_KEY'),
        api_secret=os.getenv('CLOUDINARY_API_SECRET'),
        secure=True
    )


async def upload_puzzle_image(file: UploadFile) -> Dict:
    """
    Upload puzzle image to Cloudinary
    Returns: dict with public_id, url, width, height, format
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read file contents
        contents = await file.read()
        
        # Upload to Cloudinary with optimized settings
        result = cloudinary.uploader.upload(
            contents,
            folder="mavi-puzzles",
            resource_type="image",
            quality="auto:best",
            tags=["puzzle", "mavi", "historical"]
        )
        
        return {
            "cloudinary_public_id": result["public_id"],
            "url": result["secure_url"],
            "width": result["width"],
            "height": result["height"],
            "format": result["format"]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")


def generate_thumbnail_url(public_id: str, width: int = 300, height: int = 225) -> str:
    """
    Generate thumbnail URL using Cloudinary transformations
    """
    return cloudinary.CloudinaryImage(public_id).build_url(
        width=width,
        height=height,
        crop="fill",
        gravity="auto",
        quality="auto:best",
        format="auto"
    )


def generate_puzzle_pieces(public_id: str, image_width: int, image_height: int, difficulty: str) -> List[str]:
    """
    Generate puzzle piece URLs for a specific difficulty using Cloudinary transformations.
    Pieces are generated dynamically via crop transformations.
    
    IMPORTANT: We standardize image to 1260x1260 for perfect division by all grids (2,3,4,5,6,7).
    
    Args:
        public_id: Cloudinary public ID of the uploaded image
        image_width: Original image width (not used, we standardize)
        image_height: Original image height (not used, we standardize)
        difficulty: Difficulty level (beginner, easy, medium, hard, expert, master)
    
    Returns:
        List of transformation URLs for each puzzle piece
    """
    if difficulty not in GRID_CONFIG:
        raise ValueError(f"Invalid difficulty: {difficulty}")
    
    config = GRID_CONFIG[difficulty]
    rows = config["rows"]
    cols = config["cols"]
    
    # STANDARDIZED IMAGE SIZE: 1260x1260 (quadrato, divisibile per 2,3,4,5,6,7)
    # 1260 = LCM(2,3,4,5,6,7) * 3 = 420 * 3
    # Divisione perfetta:
    # - Beginner 2x2: 630px per pezzo
    # - Easy 3x3: 420px per pezzo
    # - Medium 4x4: 315px per pezzo
    # - Hard 5x5: 252px per pezzo
    # - Expert 6x6: 210px per pezzo
    # - Master 7x7: 180px per pezzo
    STANDARD_SIZE = 1260
    
    # Calculate perfect piece dimensions (no rounding needed!)
    piece_width = STANDARD_SIZE // cols
    piece_height = STANDARD_SIZE // rows
    
    piece_urls = []
    
    for row in range(rows):
        for col in range(cols):
            # Calculate crop coordinates (perfect alignment)
            x = col * piece_width
            y = row * piece_height
            
            # Generate transformation URL with:
            # 1. First resize to standard size (1260x840)
            # 2. Then crop to exact piece
            piece_url = cloudinary.CloudinaryImage(public_id).build_url(
                transformation=[
                    {
                        "width": STANDARD_WIDTH,
                        "height": STANDARD_HEIGHT,
                        "crop": "fill",
                        "gravity": "auto"
                    },
                    {
                        "crop": "crop",
                        "x": x,
                        "y": y,
                        "width": piece_width,
                        "height": piece_height
                    },
                    {
                        "quality": "auto:best",
                        "format": "auto"
                    }
                ]
            )
            
            piece_urls.append(piece_url)
    
    return piece_urls


def generate_all_difficulty_pieces(public_id: str, image_width: int, image_height: int) -> Dict[str, List[str]]:
    """
    Generate puzzle pieces for all difficulty levels
    
    Returns:
        Dict with difficulty as key and list of piece URLs as value
    """
    pieces = {}
    
    for difficulty in ["beginner", "easy", "medium", "hard", "expert", "master"]:
        pieces[difficulty] = generate_puzzle_pieces(public_id, image_width, image_height, difficulty)
    
    return pieces


async def delete_puzzle_image(public_id: str) -> bool:
    """
    Delete image from Cloudinary
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result.get("result") == "ok"
    except Exception as e:
        print(f"Error deleting image: {str(e)}")
        return False
