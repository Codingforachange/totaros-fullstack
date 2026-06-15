from sqlalchemy import Column, Integer, String,Text, Boolean,DateTime, func
from datetime import datetime
from database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    location_name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    description = Column(Text, nullable=True)

class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String, nullable=False)
    caption = Column(String, nullable=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    reviewer_name = Column(String, nullable=False)
    review_text = Column(Text, nullable=False)
    rating = Column(Integer, nullable=False)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())