from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import Product, Category
from app.schemas.product import ProductCreate, ProductResponse, CategoryCreate, CategoryResponse
from app.core.pagination import PaginatedResponse

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/", response_model=PaginatedResponse[ProductResponse])
def get_products(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    total = db.query(Product).count()
    products = db.query(Product).offset(skip).limit(limit).all()
    return PaginatedResponse(data=products, total=total, skip=skip, limit=limit, has_more=skip + limit < total)

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
