from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.user import Shipment, Order
from app.schemas.shipment import ShipmentCreate, ShipmentResponse

router = APIRouter(prefix="/api/shipments", tags=["shipments"])

@router.get("/", response_model=List[ShipmentResponse])
def get_shipments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    shipments = db.query(Shipment).offset(skip).limit(limit).all()
    return shipments

@router.post("/", response_model=ShipmentResponse, status_code=status.HTTP_201_CREATED)
def create_shipment(shipment: ShipmentCreate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == shipment.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    db_shipment = Shipment(**shipment.dict())
    db.add(db_shipment)
    db.commit()
    db.refresh(db_shipment)
    return db_shipment

@router.get("/order/{order_id}", response_model=List[ShipmentResponse])
def get_shipments_by_order(order_id: int, db: Session = Depends(get_db)):
    shipments = db.query(Shipment).filter(Shipment.order_id == order_id).all()
    return shipments
