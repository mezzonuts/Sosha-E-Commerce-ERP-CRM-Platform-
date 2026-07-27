import pytest
from sqlalchemy.orm import Session
from app.models.user import User, Customer, Category, Product, Order, OrderItem, UserRole, OrderStatus
from app.core.security import get_password_hash, verify_password

def test_user_creation(db_session: Session):
    user = User(
        email="test@example.com",
        password_hash=get_password_hash("testpass123"),
        role=UserRole.CUSTOMER,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    assert user.id is not None
    assert user.email == "test@example.com"
    assert user.role == UserRole.CUSTOMER
    assert verify_password("testpass123", user.password_hash)

def test_user_email_unique(db_session: Session):
    user1 = User(
        email="unique@example.com",
        password_hash=get_password_hash("pass123"),
        role=UserRole.CUSTOMER,
    )
    db_session.add(user1)
    db_session.commit()

    with pytest.raises(Exception):
        user2 = User(
            email="unique@example.com",
            password_hash=get_password_hash("pass456"),
            role=UserRole.CUSTOMER,
        )
        db_session.add(user2)
        db_session.commit()

def test_customer_creation(db_session: Session):
    user = User(
        email="customer@example.com",
        password_hash=get_password_hash("pass123"),
        role=UserRole.CUSTOMER,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    customer = Customer(
        user_id=user.id,
        name="John Doe",
        phone="081234567890",
        address="Jl. Sudirman No. 1, Jakarta",
    )
    db_session.add(customer)
    db_session.commit()
    db_session.refresh(customer)

    assert customer.id is not None
    assert customer.name == "John Doe"
    assert customer.user_id == user.id

def test_category_creation(db_session: Session):
    category = Category(name="Electronics")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    assert category.id is not None
    assert category.name == "Electronics"

def test_product_creation(db_session: Session):
    category = Category(name="Clothing")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    product = Product(
        sku="CLOTH-001",
        name="Cotton T-Shirt",
        category_id=category.id,
        price=99000,
        stock=100,
        weight=0.2,
        image="https://example.com/tshirt.jpg",
        status="active",
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)

    assert product.id is not None
    assert product.sku == "CLOTH-001"
    assert product.price == 99000
    assert product.category_id == category.id

def test_order_creation(db_session: Session):
    user = User(
        email="order@example.com",
        password_hash=get_password_hash("pass123"),
        role=UserRole.CUSTOMER,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    customer = Customer(user_id=user.id, name="Jane Doe")
    db_session.add(customer)
    db_session.commit()
    db_session.refresh(customer)

    order = Order(
        customer_id=customer.id,
        status=OrderStatus.PENDING,
        total_amount=0.0,
    )
    db_session.add(order)
    db_session.commit()
    db_session.refresh(order)

    assert order.id is not None
    assert order.status == OrderStatus.PENDING
    assert order.customer_id == customer.id

def test_order_item_creation(db_session: Session):
    category = Category(name="Food")
    db_session.add(category)
    db_session.commit()

    product = Product(
        sku="FOOD-001",
        name="Green Tea",
        category_id=category.id,
        price=5000,
        stock=200,
    )
    db_session.add(product)
    db_session.commit()

    user = User(
        email="item@example.com",
        password_hash=get_password_hash("pass123"),
        role=UserRole.CUSTOMER,
    )
    db_session.add(user)
    db_session.commit()

    customer = Customer(user_id=user.id, name="Bob")
    db_session.add(customer)
    db_session.commit()

    order = Order(customer_id=customer.id)
    db_session.add(order)
    db_session.commit()

    order_item = OrderItem(
        order_id=order.id,
        product_id=product.id,
        qty=2,
        price=5000,
    )
    db_session.add(order_item)
    db_session.commit()
    db_session.refresh(order_item)

    assert order_item.id is not None
    assert order_item.qty == 2
    assert order_item.price == 5000
