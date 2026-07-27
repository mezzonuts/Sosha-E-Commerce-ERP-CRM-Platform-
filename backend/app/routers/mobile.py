from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.user import Product, Order, Customer, User
from app.schemas.product import ProductResponse
from app.schemas.customer import CustomerResponse
from app.schemas.order import OrderResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/mobile", tags=["mobile"])

@router.post("/auth")
def mobile_auth():
    return {"message": "Mobile auth endpoint - implement JWT token generation"}

@router.get("/products", response_model=List[ProductResponse])
def mobile_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = db.query(Product).offset(skip).limit(limit).all()
    return products

@router.get("/orders", response_model=List[OrderResponse])
def mobile_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer profile not found")
    orders = db.query(Order).filter(Order.customer_id == customer.id).all()
    return orders
