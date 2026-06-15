from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models
from database import engine, get_db
from pydantic import BaseModel
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone


# Automatically create the database tables if they do not exist yet
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Totaro's & Sons API",
    description="Backend management API for events, photos, and customer reviews.",
    version="1.0.0"
)

# Configure CORS so your Angular application can fetch data safely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"], # Angular default development server port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "TOTARO_SONS_PRODUCTION_SECRET_KEY_MATRIX_KEEP_SAFE_2026"
ALGORITHM = "HS256"

def verify_admin_token(authorization: str = Header(None)):
    if not authorization:
        print("DEBUG AUTH: No Authorization header recieved at all.")
        raise HTTPException(status_code=401, detail="Authorization header missing")
    if not authorization.lower().startswith("bearer "):
        print(f"DEBUG AUTH: Header recieved but does not start with Bearer. Recieved:{authorization}")
        raise HTTPException(status_code=401, detail="Invald token format scheme")
    
    try:
        token = authorization.split(" ")[1]
        token = token.strip('"').strip("'")

        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload.get("sub")
    except jwt.ExpiredSignatureError:
        print("DEBUG AUTH: Token validation failed because the signature has expired.")
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
    except jwt.InvalidTokenError as e:
        print(f"DEBUG AUTH: Token validation failed natively. Error detail: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid administrative verification signature")

# Model to handle the incoming moderation decision from Angular
class ModerationPayload(BaseModel):
    is_approved: bool

# 1. FETCH ALL REVIEWS FOR THE ADMIN MODERATION PANEL
@app.get("/api/admin/reviews")
def get_all_reviews_for_admin(db: Session = Depends(get_db), current_user: str = Depends(verify_admin_token)):
    # Pulls all reviews using your models setup, ordered by creation date descending
    # (Make sure 'Review' matches the class name inside your models.py file!)
    records = db.query(models.Review).order_by(models.Review.created_at.desc()).all()
    
    reviews_list = []
    for row in records:
        reviews_list.append({
            "id": row.id,
            "name": row.reviewer_name,
            "comment": row.review_text,
            "is_approved": row.is_approved,
            # Format the datetime cleanly for the Angular table view layout
            "date": row.created_at.strftime('%Y-%m-%d') if row.created_at else ''
        })
        
    return reviews_list

# 2. UPDATE A REVIEW STATUS (APPROVE OR DELETE)
@app.put("/api/admin/reviews/{review_id}")
def moderate_review(review_id: int, payload: ModerationPayload, db: Session = Depends(get_db), current_user: str = Depends(verify_admin_token)):
    # Query your model to find the matching review record parameter
    review_record = db.query(models.Review).filter(models.Review.id == review_id).first()
    
    if not review_record:
        raise HTTPException(status_code=404, detail="Review entry target not found in PostgreSQL records")
    
    if payload.is_approved:
        # If approved, flip the schema flag parameter to true so it pops up live on the storefront stream
        review_record.is_approved = True
        message = "Review approved and pushed live."
    else:
        # If denied, delete it from the object pool mapping framework entirely
        db.delete(review_record)
        message = "Review removed from system."
        
    db.commit() # Save the state transition changes safely down to the PostgreSQL database layers
    return {"message": message}


@app.get("/")
def read_root():
    return {"message": "Welcome to Totaro's & Sons API. Go to /docs for interactive API documeentations."}

# --- PUBLIC ENDPOINTS ---
@app.get("/api/events", response_model=List[dict])
def get_public_events(db: Session = Depends(get_db)):
    # Pull all upcoming stops for the dynamic mapping component
    events = db.query(models.Event).order_by(models.Event.start_time.asc()).all()
    return [
        {
            "id": e.id,
            "title": e.title,
            "location_name": e.location_name,
            "address": e.address,
            "start_time": e.start_time,
            "end_time": e.end_time,
            "description": e.description
        } for e in events
    ]

@app.get("/api/photos", response_model=List[dict])
def get_public_photos(db: Session = Depends(get_db)):
    # Returns the photo URLs for the main storefront screen gallery
    photos = db.query(models.Photo).order_by(models.Photo.created_at.desc()).all()
    return [
        {
            "id": p.id,
            "image_url": p.image_url,
            "caption": p.caption,
            "is_featured": p.is_featured
        }for p in photos
    ]

# Create Pydantic model to validate incoming data
class ReviewCreatePayload(BaseModel):
    customer_name: str
    comment_text: str
    rating: int = 5

@app.post("/api/reviews")
def create_public_review(payload: ReviewCreatePayload, db: Session = Depends(get_db)):
    #Create the database record using SQLAlchemy architecture
    new_review = models.Review(
        reviewer_name=payload.customer_name,
        review_text=payload.comment_text,
        rating = payload.rating,
        is_approved=False,
        created_at=datetime.now(timezone.utc)
    )

    # Check if the database model requires

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return {"status": "Review successfully submitted for moderation", "id": new_review.id}

@app.get("/api/reviews", response_model=List[dict])
def get_public_reviews(db: Session = Depends(get_db)):
    # Explicitly filter reviews so only admin approved testimonials disply on the front page
    reviews = db.query(models.Review).filter(models.Review.is_approved == True).order_by(models.Review.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "reviewer_name": r.reviewer_name,
            "review_text": r.review_text,
            "rating": r.rating
        }for r in reviews
    ]

# ---Admin Management Endpoints---
@app.post("/api/admin/events", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_event(event_data: dict, db: Session = Depends(get_db)):
    """Add new food truck stop location to the schedule."""
    #1. Parse the incoming string from the frontend date picker safely
    from datetime import datetime
    try:
        parsed_date = datetime.strptime(event_data.get("event_date"), "%Y-%m-%d")
    except Exception:
        parsed_date = datetime.now()

    #@ Build the event using your models architecture
    new_event = models.Event(
        title=event_data.get("title"),
        location_name=event_data.get("location", "Food Truck Location"),
        address=event_data.get("location", "See Title"),
        start_time=parsed_date,
        end_time=parsed_date,
        description="Scheduled via Admin Console"
    )


    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return {"status": "Event successfully created", "id": new_event.id}

@app.delete("/api/admin/events/{event_id}", status_code=status.HTTP_200_OK)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    """Remove a food truck stop from the schedule."""
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
    return {"status": f"Event {event_id} successfully deleted"}

@app.post("/api/admin/photos", response_model=dict, status_code=status.HTTP_201_CREATED)
def add_photo(photo_data: dict, db: Session = Depends(get_db)):
    """Save a new cloud storage image link to the database."""
    new_photo = models.Photo(
        image_url=photo_data.get("image_url"),
        caption=photo_data.get("caption"),
        is_featured=photo_data.get("is_featured", False)
    )
    db.add(new_photo)
    db.commit()
    db.refresh(new_photo)
    return {"status": "Photo reference successfully saved", "id": new_photo.id}
@app.delete("/api/admin/photos/{photo_id}", status_code=status.HTTP_200_OK)
def delete_photo(photo_id: int, db: Session = Depends(get_db)):
    """Remove an image link from the database."""
    photo = db.query(models.Photo).filter(models.Photo.id == photo_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo reference not found")
    db.delete(photo)
    db.commit()
    return {"status": f"Photo {photo_id} successfully removed"}

@app.put("/api/admin/reviews/{review_id}", response_model=dict)
def toggle_review_approval(review_id: int, review_update: dict, db: Session = Depends(get_db)):
    """Approve or hide a customer review on the public page."""
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    review.is_approved = review_update.get("is_approved", review.is_approved)
    db.commit()
    return {"status": f"Review {review_id} approval status updated", "is_approved": review.is_approved}

# Create a data model for the incoming login request
class LoginPayload(BaseModel):
    username: str
    password: str

# ADMIN FETCH PATHS 

@app.get("/api/admin/photos", response_model=List[dict])
def get_admin_photos(db: Session = Depends(get_db), current_user: str = Depends(verify_admin_token)):
    # Pulls all photos out of the database for administration management
    records = db.query(models.Photo).order_by(models.Photo.created_at.desc()).all()
    return [{"id": p.id, "image_url": p.image_url, "caption": p.caption, "is_featured": p.is_featured} for p in records]

@app.get("/api/admin/events", response_model=List[dict])
def get_admin_events(db: Session = Depends(get_db), current_user: str = Depends(verify_admin_token)):
    # Pulls all scheduled events out of the database for administration management
    records = db.query(models.Event).order_by(models.Event.start_time.asc()).all()
    return [
        {
            "id": e.id,
            "title": e.title,
            "location": f"{e.location_name} ({e.addess})",
            "event_date": e.start_time.strftime('%Y-%m-%d') if e.start_time else ''
        }
        for e in records
    ]


@app.post("/api/auth/login")
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    #Temorary Override: Bypass the database hash check entirely
    if payload.username == "admin_totaro" and payload.password == "Password123!":
        from datetime import timezone
        token_expiry = datetime.now(timezone.utc) + timedelta(hours=2)
        token_data = {
            "sub": payload.username,
            "exp": token_expiry
        }
        token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
        return {
            "access_token": token,
            "token_type": "bearer"
        }
    # 1. Look up the admin user in the PostgreSQL database table
    # (Make sure 'Admin' matches the class name inside your models.py file)
    admin = db.query(models.Admin).filter(models.Admin.username == payload.username).first()
    
    # 2. Check if the user exists
    if not admin:
        raise HTTPException(status_code=404, detail="Admin user not found")
        
    # 3. Verify the password hash matches 'Password123!' securely
    # (Using the variable names we imported/defined at the top of the file)
    password_bytes = payload.password.encode('utf-8')
    hashed_bytes = admin.hashed_password.encode('utf-8') if isinstance(admin.hashed_password, str) else admin.hashed_password
    
    if not bcrypt.checkpw(password_bytes, hashed_bytes):
        raise HTTPException(status_code=401, detail="Invalid account security key password credentials")
        
    # 4. Generate and sign the secure JWT token for the frontend to hold onto
    token_expiry = datetime.now(timezone.utc) + timedelta(hours=2)
    token_data = {
        "sub": admin.username,
        "exp": token_expiry
    }
    
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    
    return {
        "access_token": token,
        "token_type": "bearer"
    }
