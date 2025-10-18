from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
from datetime import datetime
import uuid


# ============ USER MODELS ============

class UserStats(BaseModel):
    total_puzzles_completed: int = 0
    total_play_time: int = 0  # milliseconds
    average_completion_time: int = 0
    favorite_category: Optional[str] = None


class UserPreferences(BaseModel):
    sound_enabled: bool = True
    animations_enabled: bool = True
    preferred_difficulty: str = "medium"


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    username: str
    avatar: Optional[str] = None
    
    # Authentication
    auth_provider: str = "email"  # "email" | "google"
    password_hash: Optional[str] = None
    
    # Role
    role: str = "player"  # "admin" | "player"
    
    # Stats & Preferences
    stats: UserStats = Field(default_factory=UserStats)
    preferences: UserPreferences = Field(default_factory=UserPreferences)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login_at: Optional[datetime] = None
    is_banned: bool = False


class UserCreate(BaseModel):
    email: str
    username: str
    password: Optional[str] = None
    auth_provider: str = "email"
    role: str = "player"


# ============ PUZZLE MODELS ============

class PuzzleImage(BaseModel):
    cloudinary_public_id: str
    url: str
    width: int
    height: int
    format: str


class PuzzleMetadata(BaseModel):
    total_plays: int = 0
    total_completions: int = 0
    average_completion_time: int = 0


class Puzzle(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    category: str = "General"
    tags: List[str] = Field(default_factory=list)
    
    # Image Data
    original_image: PuzzleImage
    thumbnail_url: str
    
    # Piece URLs - dynamically generated via Cloudinary transformations
    # These are base URLs with transformation parameters for each difficulty
    piece_data: Optional[Dict[str, List[str]]] = None
    
    # Configuration
    difficulty_available: List[str] = Field(default_factory=lambda: ["easy", "medium", "hard", "expert"])
    
    # Metadata
    metadata: PuzzleMetadata = Field(default_factory=PuzzleMetadata)
    
    # Admin Controls
    status: str = "published"  # "draft" | "published" | "archived"
    is_featured: bool = False
    display_order: int = 0
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None  # Admin user ID


class PuzzleCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "General"
    tags: List[str] = Field(default_factory=list)
    difficulty_available: List[str] = Field(default_factory=lambda: ["easy", "medium", "hard", "expert"])
    status: str = "published"
    is_featured: bool = False
    display_order: int = 0


class PuzzleUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    difficulty_available: Optional[List[str]] = None
    status: Optional[str] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None


# ============ SCORE MODELS ============

class Score(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    puzzle_id: str
    
    # Performance Metrics
    completion_time: int  # milliseconds
    moves: int
    difficulty: str  # "easy" | "medium" | "hard" | "expert"
    
    # Calculated Score
    score: int
    
    # Metadata
    is_validated: bool = True
    completed_at: datetime = Field(default_factory=datetime.utcnow)


class ScoreCreate(BaseModel):
    puzzle_id: str
    completion_time: int
    moves: int
    difficulty: str
