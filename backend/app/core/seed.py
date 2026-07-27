from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.user import User, Customer, Category, Product, OrderStatus, UserRole
from app.core.security import get_password_hash

def seed_database(db: Session):
    if db.query(User).filter(User.email == "admin@sosha.com").first():
        print("Seed data already exists")
        return

    admin_user = User(
        email="admin@sosha.com",
        password_hash=get_password_hash("admin123"),
        role=UserRole.ADMIN,
    )
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)

    manager_user = User(
        email="manager@sosha.com",
        password_hash=get_password_hash("manager123"),
        role=UserRole.MANAGER,
    )
    db.add(manager_user)
    db.commit()
    db.refresh(manager_user)

    warehouse_user = User(
        email="warehouse@sosha.com",
        password_hash=get_password_hash("warehouse123"),
        role=UserRole.WAREHOUSE,
    )
    db.add(warehouse_user)
    db.commit()
    db.refresh(warehouse_user)

    customer_user = User(
        email="customer@sosha.com",
        password_hash=get_password_hash("customer123"),
        role=UserRole.CUSTOMER,
    )
    db.add(customer_user)
    db.commit()
    db.refresh(customer_user)

    customer = Customer(
        user_id=customer_user.id,
        name="John Doe",
        phone="081234567890",
        address="Jl. Sudirman No. 1, Jakarta",
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)

    categories = [
        Category(name="Electronics"),
        Category(name="Clothing"),
        Category(name="Food & Beverage"),
        Category(name="Home & Living"),
    ]
    db.add_all(categories)
    db.commit()
    for cat in categories:
        db.refresh(cat)

    products = [
        Product(
            sku="ELEC-001",
            name="Wireless Headphones",
            category_id=categories[0].id,
            price=299000,
            stock=50,
            weight=0.3,
            image="https://example.com/headphones.jpg",
            status="active",
        ),
        Product(
            sku="CLOTH-001",
            name="Cotton T-Shirt",
            category_id=categories[1].id,
            price=99000,
            stock=100,
            weight=0.2,
            image="https://example.com/tshirt.jpg",
            status="active",
        ),
        Product(
            sku="FOOD-001",
            name="Green Tea 500ml",
            category_id=categories[2].id,
            price=5000,
            stock=200,
            weight=0.5,
            image="https://example.com/greentea.jpg",
            status="active",
        ),
    ]
    db.add_all(products)
    db.commit()

    print("Seed data created successfully")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
