from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.user import CRMActivity, Customer
from app.schemas.crm import CRMActivityCreate, CRMActivityResponse

router = APIRouter(prefix="/api/crm", tags=["crm"])

@router.get("/", response_model=List[CRMActivityResponse])
def get_crm_activities(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    activities = db.query(CRMActivity).offset(skip).limit(limit).all()
    return activities

@router.post("/", response_model=CRMActivityResponse, status_code=status.HTTP_201_CREATED)
def create_crm_activity(activity: CRMActivityCreate, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == activity.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    db_activity = CRMActivity(**activity.dict())
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.get("/customer/{customer_id}", response_model=List[CRMActivityResponse])
def get_crm_by_customer(customer_id: int, db: Session = Depends(get_db)):
    activities = db.query(CRMActivity).filter(CRMActivity.customer_id == customer_id).all()
    return activities
