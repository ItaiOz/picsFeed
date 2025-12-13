import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from main import app
from models import Image, Vote

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_get_images_empty():
    response = client.get("/images")
    assert response.status_code == 200
    assert response.json() == []


def test_get_images_with_data():
    db = TestingSessionLocal()
    image = Image(id=1, url="https://example.com/image.jpg")
    db.add(image)
    db.commit()
    db.close()

    response = client.get("/images")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == 1
    assert data[0]["likes"] == 0
    assert data[0]["dislikes"] == 0


def test_vote_success():
    db = TestingSessionLocal()
    image = Image(id=1, url="https://example.com/image.jpg")
    db.add(image)
    db.commit()
    db.close()

    response = client.post("/vote", json={"image_id": 1, "vote_type": "like"})
    assert response.status_code == 200
    assert response.json() == {"message": "Vote recorded successfully"}


def test_vote_invalid_type():
    response = client.post("/vote", json={"image_id": 1, "vote_type": "invalid"})
    assert response.status_code == 400
    assert "Invalid vote type" in response.json()["detail"]


def test_vote_image_not_found():
    response = client.post("/vote", json={"image_id": 999, "vote_type": "like"})
    assert response.status_code == 404
    assert "Image not found" in response.json()["detail"]


def test_export_csv():
    db = TestingSessionLocal()
    image = Image(id=1, url="https://example.com/image.jpg")
    vote = Vote(image_id=1, vote_type="like")
    db.add(image)
    db.add(vote)
    db.commit()
    db.close()

    response = client.get("/export-votes")
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/csv; charset=utf-8"
    assert "image_id" in response.text
    assert "url" in response.text
