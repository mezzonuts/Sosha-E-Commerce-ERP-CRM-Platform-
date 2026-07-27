import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_rate_limit_root():
    responses = []
    for _ in range(10):
        response = client.get("/")
        responses.append(response.status_code)
    
    assert all(status == 200 for status in responses)

def test_rate_limit_auth_login():
    payload = {"email": "test@example.com", "password": "password"}
    responses = []
    for _ in range(10):
        response = client.post("/api/auth/login", json=payload)
        responses.append(response.status_code)
    
    assert all(status in [401, 422] for status in responses)

def test_rate_limit_products():
    responses = []
    for _ in range(10):
        response = client.get("/api/products?skip=0&limit=20")
        responses.append(response.status_code)
    
    assert all(status == 200 for status in responses)
