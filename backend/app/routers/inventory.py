from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import Inventory, Product
from app.schemas.inventory import InventoryCreate, InventoryResponse
from app.core.pagination import PaginatedResponse

router = APIRouter(prefix="/api/inventory", tags=["inventory"])

@router.get("/", response_model=PaginatedResponse[InventoryResponse])
def get_inventory(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    total = db.query(Inventory).count()
    inventory = db.query(Inventory).offset(skip).limit(limit).all()
    return PaginatedResponse(data=inventory, total=total, skip=skip, limit=limit, has_more=skip + limit < total)

@router.post("/", response_model=InventoryResponse, status_code=status.HTTP_201_CREATED)
def create_inventory(item: InventoryCreate, db: Session = Depends(get_db)):
    db_item = Inventory(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/product/{product_id}", response_model=PaginatedResponse[InventoryResponse])
def get_inventory_by_product(product_id: int, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    query = db.query(Inventory).filter(Inventory.product_id == product_id)
    total = query.count()
    inventory = query.offset(skip).limit(limit).all()
    return PaginatedResponse(data=inventory, total=total, skip=skip, limit=limit, has_more=skip + limit < total)
