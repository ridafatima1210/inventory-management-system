import os
import time
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/inventory")

# Retry connection logic for Docker Compose startup sequence
for _ in range(5):
    try:
        engine = create_engine(DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        Base = declarative_base()
        break
    except Exception:
        time.sleep(2)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()