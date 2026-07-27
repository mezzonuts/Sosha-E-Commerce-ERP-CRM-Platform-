from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import Shipment, Order
from app.schemas.shipment import ShipmentCreate, ShipmentResponse
from app.core.pagination import PaginatedResponse

router = APIRouter(prefix="/api/shipments", tags=["shipments"])

@router.get("/", response_model=PaginatedResponse[ShipmentResponse])
def get_shipments(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    total = db.query(Shipment).count()
    shipments = db.query(Shipment).offset(skip).limit(limit).all()
    return PaginatedResponse(data=shipments, total=total, skip=skip, limit=limit, has_more=skip + limit < total)

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

@router.get("/order/{order_id}", response_model=PaginatedResponse[ShipmentResponse])
def get_shipments_by_order(order_id: int, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    query = db.query(Shipment).filter(Shipment.order_id == order_id)
    total = query.count()
    shipments = query.offset(skip).limit(limit).all()
    return PaginatedResponse(data=shipments, total=total, skip=skip, limit=limit, has_more=skip + limit < total)
