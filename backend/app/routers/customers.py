from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import Customer
from app.schemas.customer import CustomerCreate, CustomerResponse
from app.core.pagination import PaginatedResponse

router = APIRouter(prefix="/api/customers", tags=["customers"])

@router.get("/", response_model=PaginatedResponse[CustomerResponse])
def get_customers(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    total = db.query(Customer).count()
    customers = db.query(Customer).offset(skip).limit(limit).all()
    return PaginatedResponse(data=customers, total=total, skip=skip, limit=limit, has_more=skip + limit < total)
