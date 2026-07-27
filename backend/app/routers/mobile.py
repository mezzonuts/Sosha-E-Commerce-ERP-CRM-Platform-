from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import Product, Order, Customer, User
from app.schemas.product import ProductResponse
from app.schemas.customer import CustomerResponse
from app.schemas.order import OrderResponse
from app.dependencies import get_current_user
from app.core.pagination import PaginatedResponse

router = APIRouter(prefix="/api/mobile", tags=["mobile"])

@router.post("/auth")
def mobile_auth():
    return {"message": "Mobile auth endpoint - implement JWT token generation"}

@router.get("/products", response_model=PaginatedResponse[ProductResponse])
def mobile_products(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    total = db.query(Product).count()
    products = db.query(Product).offset(skip).limit(limit).all()
    return PaginatedResponse(data=products, total=total, skip=skip, limit=limit, has_more=skip + limit < total)

@router.get("/orders", response_model=PaginatedResponse[OrderResponse])
def mobile_orders(skip: int = 0, limit: int = 20, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer profile not found")
    query = db.query(Order).filter(Order.customer_id == customer.id)
    total = query.count()
    orders = query.offset(skip).limit(limit).all()
    return PaginatedResponse(data=orders, total=total, skip=skip, limit=limit, has_more=skip + limit < total)
