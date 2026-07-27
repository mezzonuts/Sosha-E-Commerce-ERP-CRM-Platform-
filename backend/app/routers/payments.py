from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import Payment, Order
from app.schemas.payment import PaymentCreate, PaymentResponse
from app.core.pagination import PaginatedResponse

router = APIRouter(prefix="/api/payments", tags=["payments"])

@router.get("/", response_model=PaginatedResponse[PaymentResponse])
def get_payments(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    total = db.query(Payment).count()
    payments = db.query(Payment).offset(skip).limit(limit).all()
    return PaginatedResponse(data=payments, total=total, skip=skip, limit=limit, has_more=skip + limit < total)

@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def create_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == payment.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    db_payment = Payment(**payment.dict())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.get("/order/{order_id}", response_model=PaginatedResponse[PaymentResponse])
def get_payments_by_order(order_id: int, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    query = db.query(Payment).filter(Payment.order_id == order_id)
    total = query.count()
    payments = query.offset(skip).limit(limit).all()
    return PaginatedResponse(data=payments, total=total, skip=skip, limit=limit, has_more=skip + limit < total)
