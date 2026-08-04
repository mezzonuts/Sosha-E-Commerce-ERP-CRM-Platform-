import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.user import User, Customer, Product
from app.core.security import get_password_hash

def test_get_cart_empty(client: TestClient, db_session: Session):
    user = User(email="cartuser@test.com", password_hash=get_password_hash("password"), role="customer")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    customer = Customer(user_id=user.id, name="Cart User")
    db_session.add(customer)
    db_session.commit()

    login_response = client.post("/api/auth/login", json={"email": "cartuser@test.com", "password": "password"})
    token = login_response.json()["access_token"]

    response = client.get("/api/cart", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["customer_id"] == customer.id
    assert response.json()["items"] == []

def test_add_to_cart(client: TestClient, db_session: Session):
    user = User(email="cartuser2@test.com", password_hash=get_password_hash("password"), role="customer")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    customer = Customer(user_id=user.id, name="Cart User 2")
    db_session.add(customer)
    db_session.commit()

    product = Product(sku="CART-001", name="Cart Test Product", price=10000, stock=10)
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)

    login_response = client.post("/api/auth/login", json={"email": "cartuser2@test.com", "password": "password"})
    token = login_response.json()["access_token"]

    response = client.post("/api/cart/items", headers={"Authorization": f"Bearer {token}"}, json={"product_id": product.id, "qty": 2})
    assert response.status_code == 201
    assert response.json()["qty"] == 2
    assert response.json()["price"] == 10000

def test_update_cart_item(client: TestClient, db_session: Session):
    user = User(email="cartuser3@test.com", password_hash=get_password_hash("password"), role="customer")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    customer = Customer(user_id=user.id, name="Cart User 3")
    db_session.add(customer)
    db_session.commit()

    product = Product(sku="CART-002", name="Cart Test Product 2", price=5000, stock=10)
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)

    login_response = client.post("/api/auth/login", json={"email": "cartuser3@test.com", "password": "password"})
    token = login_response.json()["access_token"]

    add_response = client.post("/api/cart/items", headers={"Authorization": f"Bearer {token}"}, json={"product_id": product.id, "qty": 1})
    assert add_response.status_code == 201
    item_id = add_response.json()["id"]

    update_response = client.put(f"/api/cart/items/{item_id}", headers={"Authorization": f"Bearer {token}"}, json={"qty": 5})
    assert update_response.status_code == 200
    assert update_response.json()["qty"] == 5

def test_delete_cart_item(client: TestClient, db_session: Session):
    user = User(email="cartuser4@test.com", password_hash=get_password_hash("password"), role="customer")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    customer = Customer(user_id=user.id, name="Cart User 4")
    db_session.add(customer)
    db_session.commit()

    product = Product(sku="CART-003", name="Cart Test Product 3", price=15000, stock=10)
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)

    login_response = client.post("/api/auth/login", json={"email": "cartuser4@test.com", "password": "password"})
    token = login_response.json()["access_token"]

    add_response = client.post("/api/cart/items", headers={"Authorization": f"Bearer {token}"}, json={"product_id": product.id, "qty": 1})
    assert add_response.status_code == 201
    item_id = add_response.json()["id"]

    delete_response = client.delete(f"/api/cart/items/{item_id}", headers={"Authorization": f"Bearer {token}"})
    assert delete_response.status_code == 204

def test_clear_cart(client: TestClient, db_session: Session):
    user = User(email="cartuser5@test.com", password_hash=get_password_hash("password"), role="customer")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    customer = Customer(user_id=user.id, name="Cart User 5")
    db_session.add(customer)
    db_session.commit()

    product = Product(sku="CART-004", name="Cart Test Product 4", price=20000, stock=10)
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)

    login_response = client.post("/api/auth/login", json={"email": "cartuser5@test.com", "password": "password"})
    token = login_response.json()["access_token"]

    client.post("/api/cart/items", headers={"Authorization": f"Bearer {token}"}, json={"product_id": product.id, "qty": 1})
    client.post("/api/cart/items", headers={"Authorization": f"Bearer {token}"}, json={"product_id": product.id, "qty": 2})

    clear_response = client.delete("/api/cart", headers={"Authorization": f"Bearer {token}"})
    assert clear_response.status_code == 204

    cart_response = client.get("/api/cart", headers={"Authorization": f"Bearer {token}"})
    assert cart_response.status_code == 200
    assert len(cart_response.json()["items"]) == 0
