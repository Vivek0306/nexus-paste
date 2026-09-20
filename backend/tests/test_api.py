import os

import pytest

os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from app import create_app, db


@pytest.fixture
def app():
    app = create_app()
    app.config.update(
        TESTING=True,
    )

    with app.app_context():
        db.drop_all()
        db.create_all()

    yield app

    with app.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


def test_health(client):
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.get_json() == {
        "status": "ok"
    }


def test_create_paste(client):
    response = client.post(
        "/api/pastes",
        json={
            "title": "Test Paste",
            "content": "Hello from pytest!",
            "language": "text",
            "expiration": "never",
        },
    )

    assert response.status_code == 201

    data = response.get_json()

    assert data["title"] == "Test Paste"
    assert data["content"] == "Hello from pytest!"
    assert data["language"] == "text"
    assert data["expiration"] == "never"
    assert "id" in data


def test_get_paste(client):
    create_response = client.post(
        "/api/pastes",
        json={
            "title": "Get Test",
            "content": "Testing retrieval",
            "language": "python",
            "expiration": "never",
        },
    )

    paste_id = create_response.get_json()["id"]

    response = client.get(
        f"/api/pastes/{paste_id}"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["id"] == paste_id
    assert data["title"] == "Get Test"
    assert data["content"] == "Testing retrieval"


def test_get_nonexistent_paste(client):
    response = client.get(
        "/api/pastes/does-not-exist"
    )

    assert response.status_code == 404

    assert response.get_json() == {
        "error": "Paste not found"
    }


def test_create_paste_without_title(client):
    response = client.post(
        "/api/pastes",
        json={
            "title": "",
            "content": "Some content",
            "language": "text",
            "expiration": "never",
        },
    )

    assert response.status_code == 400

    assert response.get_json() == {
        "error": "Title is required"
    }


def test_create_paste_without_content(client):
    response = client.post(
        "/api/pastes",
        json={
            "title": "Test",
            "content": "",
            "language": "text",
            "expiration": "never",
        },
    )

    assert response.status_code == 400

    assert response.get_json() == {
        "error": "Content is required"
    }


def test_invalid_expiration(client):
    response = client.post(
        "/api/pastes",
        json={
            "title": "Test",
            "content": "Some content",
            "language": "text",
            "expiration": "999d",
        },
    )

    assert response.status_code == 400

    assert response.get_json() == {
        "error": "Invalid expiration option"
    }


def test_raw_paste(client):
    create_response = client.post(
        "/api/pastes",
        json={
            "title": "Raw Test",
            "content": "raw paste content",
            "language": "text",
            "expiration": "never",
        },
    )

    paste_id = create_response.get_json()["id"]

    response = client.get(
        f"/api/pastes/{paste_id}/raw"
    )

    assert response.status_code == 200
    assert response.data.decode() == "raw paste content"


def test_delete_paste(client):
    create_response = client.post(
        "/api/pastes",
        json={
            "title": "Delete Test",
            "content": "Delete me",
            "language": "text",
            "expiration": "never",
        },
    )

    paste_id = create_response.get_json()["id"]

    delete_response = client.delete(
        f"/api/pastes/{paste_id}"
    )

    assert delete_response.status_code == 200

    assert delete_response.get_json() == {
        "message": "Paste deleted"
    }

    get_response = client.get(
        f"/api/pastes/{paste_id}"
    )

    assert get_response.status_code == 404

