# Photo Puzzle Game - API Documentation

## Base URL
```
Production: https://dragpuzzle.preview.emergentagent.com/api
Local: http://localhost:8001/api
```

---

## Admin Endpoints

### 1. Upload New Puzzle
**POST** `/admin/puzzles`

Upload a new puzzle image and automatically generate pieces for all difficulty levels.

**Request:**
- Method: `multipart/form-data`
- Fields:
  - `file`: Image file (required) - JPG, PNG, WebP
  - `title`: string (required)
  - `description`: string (optional)
  - `category`: string (default: "General")
  - `tags`: JSON array string (default: "[]")
  - `difficulty_available`: JSON array string (default: '["easy", "medium", "hard", "expert"]')
  - `status`: "draft" | "published" | "archived" (default: "published")
  - `is_featured`: boolean (default: false)
  - `display_order`: integer (default: 0)

**Response:**
```json
{
  "id": "uuid",
  "title": "Test Puzzle - Lacedonia 1957",
  "description": "Vintage street scene",
  "category": "Historical",
  "tags": ["1950s", "lacedonia", "vintage"],
  "original_image": {
    "cloudinary_public_id": "mavi-puzzles/xxx",
    "url": "https://res.cloudinary.com/...",
    "width": 900,
    "height": 900,
    "format": "jpg"
  },
  "thumbnail_url": "https://res.cloudinary.com/...",
  "piece_data": {
    "easy": ["url1", "url2", ... "url9"],
    "medium": ["url1", ... "url16"],
    "hard": ["url1", ... "url25"],
    "expert": ["url1", ... "url36"]
  },
  "difficulty_available": ["easy", "medium", "hard", "expert"],
  "status": "published",
  "is_featured": true,
  "display_order": 1,
  "metadata": {
    "total_plays": 0,
    "total_completions": 0,
    "average_completion_time": 0
  },
  "created_at": "2025-01-15T10:30:00",
  "updated_at": "2025-01-15T10:30:00",
  "created_by": null
}
```

**Example:**
```bash
curl -X POST "http://localhost:8001/api/admin/puzzles" \
  -F "file=@puzzle.jpg" \
  -F "title=Lacedonia 1957" \
  -F "description=Historic street scene" \
  -F "category=Historical" \
  -F 'tags=["1950s", "italy"]' \
  -F "is_featured=true"
```

---

### 2. Get All Puzzles
**GET** `/admin/puzzles`

Retrieve all puzzles with optional filters.

**Query Parameters:**
- `status`: Filter by status ("draft", "published", "archived")
- `category`: Filter by category
- `is_featured`: Filter featured puzzles (true/false)
- `skip`: Pagination skip (default: 0)
- `limit`: Items per page (default: 50, max: 50)

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Puzzle Title",
    ...
  }
]
```

**Example:**
```bash
curl "http://localhost:8001/api/admin/puzzles?status=published&is_featured=true"
```

---

### 3. Get Single Puzzle
**GET** `/admin/puzzles/{puzzle_id}`

Retrieve detailed information about a specific puzzle.

**Response:**
```json
{
  "id": "uuid",
  "title": "Puzzle Title",
  ...
}
```

**Example:**
```bash
curl "http://localhost:8001/api/admin/puzzles/40b443e0-a19b-4c93-8b11-3e63191e047d"
```

---

### 4. Update Puzzle Metadata
**PUT** `/admin/puzzles/{puzzle_id}`

Update puzzle metadata (does not change the image or pieces).

**Request Body:**
```json
{
  "title": "New Title",
  "description": "New description",
  "category": "New Category",
  "tags": ["tag1", "tag2"],
  "difficulty_available": ["easy", "medium"],
  "status": "published",
  "is_featured": false,
  "display_order": 5
}
```

All fields are optional - only provided fields will be updated.

**Response:**
```json
{
  "id": "uuid",
  "title": "New Title",
  ...
}
```

**Example:**
```bash
curl -X PUT "http://localhost:8001/api/admin/puzzles/{id}" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title", "is_featured": false}'
```

---

### 5. Delete Puzzle
**DELETE** `/admin/puzzles/{puzzle_id}`

Delete a puzzle and its associated Cloudinary image.

**Response:**
```json
{
  "success": true,
  "message": "Puzzle deleted successfully"
}
```

**Example:**
```bash
curl -X DELETE "http://localhost:8001/api/admin/puzzles/{id}"
```

---

### 6. Get Puzzle Pieces by Difficulty
**GET** `/admin/puzzles/{puzzle_id}/pieces/{difficulty}`

Retrieve piece URLs for a specific difficulty level.

**Path Parameters:**
- `puzzle_id`: UUID of the puzzle
- `difficulty`: "easy" | "medium" | "hard" | "expert"

**Response:**
```json
{
  "puzzle_id": "uuid",
  "difficulty": "medium",
  "pieces": [
    "https://res.cloudinary.com/...",
    "https://res.cloudinary.com/...",
    ...
  ]
}
```

**Example:**
```bash
curl "http://localhost:8001/api/admin/puzzles/{id}/pieces/medium"
```

---

## Difficulty Configurations

| Difficulty | Grid Size | Total Pieces |
|-----------|-----------|--------------|
| Easy      | 3x3       | 9            |
| Medium    | 4x4       | 16           |
| Hard      | 5x5       | 25           |
| Expert    | 6x6       | 36           |

---

## Cloudinary Image Transformations

### Thumbnail
- Width: 300px
- Height: 225px
- Crop: fill
- Gravity: auto
- Quality: auto:best
- Format: auto

### Puzzle Pieces
- Crop: crop (exact region extraction)
- Coordinates: Calculated based on grid position
- Quality: auto:best
- Format: auto
- Gravity: auto

### Storage Structure
```
mavi-puzzles/
├── {public_id_1}.jpg
├── {public_id_2}.jpg
└── ...
```

All pieces are generated dynamically via URL transformations - no separate files stored.

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "File must be an image"
}
```

### 404 Not Found
```json
{
  "detail": "Puzzle not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Image upload failed: {error_message}"
}
```

---

## Status Codes

- `200 OK`: Success
- `201 Created`: Resource created
- `400 Bad Request`: Invalid input
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## MongoDB Collections

### puzzles
- Stores puzzle metadata and Cloudinary references
- Piece URLs are dynamically generated and cached

### users
- Player and admin accounts
- Authentication and statistics

### scores
- Leaderboard entries
- Completion times and rankings

---

## Next Steps (SPRINT 2)

- Player API endpoints (browse, play, submit scores)
- Authentication (Google OAuth + Guest mode)
- Leaderboard system
- Frontend React app with drag & drop game

---

**Version:** 1.0.0  
**Last Updated:** 2025-01-15  
**Backend:** FastAPI + MongoDB + Cloudinary
