import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

#1 Grab the database URL from Render's enviroment variables.
# Fallback to a local PostgreSQL connection string for development.
DATABASE_URL = os.getenv("DATABASE_URL","postgresql://postgres:haley413@localhost:5432/totaros_db")

print(f"---PRODUCTION DATABASE TARGET: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL} ---")

if not DATABASE_URL:
    DATABASE_URL ="postgresql://totaro_admin:E1P8jXS2HwNJd9kEhCLxh7MMwiknqHdE@dpg-d8o4efk8aovs73fg7isg-a.ohio-postgres.render.com/totaros_db"

# Render database URLs sometimes start with 'postgres://',
# but SQLAlchemy 1.4+ strictly requires "postgres://". This fix prevents crashes on deployed.
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql", 1)

#2 Create the SQLAlchemy Engine
engine = create_engine(DATABASE_URL)

#3 Create a Session factory for database operations
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#4 Base class that the database models (Events, Reviews, Photos) will inherit from
Base = declarative_base()

# Dependency provider to inject database sessions into our API routes safely
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()