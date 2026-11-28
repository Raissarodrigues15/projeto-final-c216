from datetime import date

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import app.models
from app.database.session import get_db
from app.main import app
from app.models.base import Base

TEST_DATABASE_URL = "sqlite://"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)


def test_create_and_list_category(client):
    response = client.post(
        "/categories/",
        json={"name": "Alimentação", "description": "Gastos com comida"},
    )

    assert response.status_code == 201
    assert response.json()["name"] == "Alimentação"

    response = client.get("/categories/")

    assert response.status_code == 200
    assert len(response.json()) == 1


def test_get_category(client):
    created = client.post(
        "/categories/",
        json={"name": "Transporte"},
    ).json()

    response = client.get(f"/categories/{created['id']}")

    assert response.status_code == 200
    assert response.json()["name"] == "Transporte"


def test_create_and_list_transaction(client):
    category = client.post(
        "/categories/",
        json={"name": "Salário"},
    ).json()

    response = client.post(
        "/transactions/",
        json={
            "description": "Salário mensal",
            "amount": 3000.00,
            "type": "receita",
            "date": str(date(2026, 11, 1)),
            "category_id": category["id"],
        },
    )

    assert response.status_code == 201
    assert response.json()["description"] == "Salário mensal"

    response = client.get("/transactions/")

    assert response.status_code == 200
    assert len(response.json()) == 1


def test_update_transaction(client):
    category = client.post(
        "/categories/",
        json={"name": "Moradia"},
    ).json()

    transaction = client.post(
        "/transactions/",
        json={
            "description": "Aluguel",
            "amount": 1200.00,
            "type": "despesa",
            "date": "2026-11-05",
            "category_id": category["id"],
        },
    ).json()

    response = client.put(
        f"/transactions/{transaction['id']}",
        json={"amount": 1300.00},
    )

    assert response.status_code == 200
    assert response.json()["amount"] == 1300.00


def test_delete_transaction(client):
    category = client.post(
        "/categories/",
        json={"name": "Lazer"},
    ).json()

    transaction = client.post(
        "/transactions/",
        json={
            "description": "Cinema",
            "amount": 50.00,
            "type": "despesa",
            "date": "2026-11-10",
            "category_id": category["id"],
        },
    ).json()

    response = client.delete(f"/transactions/{transaction['id']}")

    assert response.status_code in (200, 204)

    response = client.get(f"/transactions/{transaction['id']}")

    assert response.status_code == 404
