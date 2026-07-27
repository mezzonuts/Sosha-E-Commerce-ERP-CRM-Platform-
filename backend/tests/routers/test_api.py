import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "Sosha Backend ERP CRM API Running"

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_login_missing_fields():
    response = client.post("/api/auth/login", json={})
    assert response.status_code == 422

def test_login_invalid_credentials():
    response = client.post(
        "/api/auth/login",
        json={"email": "nonexistent@example.com", "password": "wrongpass"},
    )
    assert response.status_code == 401

def test_get_products():
    response = client.get("/api/products?skip=0&limit=20")
    assert response.status_code == 200
    assert "data" in response.json()
    assert "total" in response.json()
    assert "skip" in response.json()
    assert "limit" in response.json()

def test_get_customers():
    response = client.get("/api/customers?skip=0&limit=20")
    assert response.status_code == 200
    assert "data" in response.json()

import uuid

def test_create_product_without_auth():
    response = client.post(
        "/api/products",
        json={
            "sku": f"TEST-{uuid.uuid4().hex[:8].upper()}",
            "name": "Test Product",
            "price": 10000,
            "stock": 10,
        },
    )
    assert response.status_code == 201
    assert "sku" in response.json()

def test_get_orders():
    response = client.get("/api/orders?skip=0&limit=20")
    assert response.status_code == 200
    assert "data" in response.json()

def test_get_inventory():
    response = client.get("/api/inventory?skip=0&limit=20")
    assert response.status_code == 200
    assert "data" in response.json()

def test_get_payments():
    response = client.get("/api/payments?skip=0&limit=20")
    assert response.status_code == 200
    assert "data" in response.json()

def test_get_shipments():
    response = client.get("/api/shipments?skip=0&limit=20")
    assert response.status_code == 200
    assert "data" in response.json()

def test_get_crm_activities():
    response = client.get("/api/crm?skip=0&limit=20")
    assert response.status_code == 200
    assert "data" in response.json()

def test_get_sales_report():
    response = client.get("/api/reporting/sales?period=month")
    assert response.status_code == 200
    assert "period" in response.json()
    assert "total_revenue" in response.json()
