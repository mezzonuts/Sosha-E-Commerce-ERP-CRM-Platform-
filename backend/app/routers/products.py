from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import Product, Category
from app.schemas.product import ProductCreate, ProductResponse, CategoryCreate, CategoryResponse
from app.core.pagination import PaginatedResponse

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/", response_model=PaginatedResponse[ProductResponse])
def get_products(
    skip: int = 0,
    limit: int = 20,
    category_id: int | None = None,
    search: str | None = None,
    sort_by: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product)

    if category_id is not None:
        query = query.filter(Product.category_id == category_id)

    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))

    if min_price is not None:
        query = query.filter(Product.price >= min_price)

    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    if sort_by == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort_by == "name_asc":
        query = query.order_by(Product.name.asc())
    elif sort_by == "name_desc":
        query = query.order_by(Product.name.desc())

    total = query.count()
    products = query.offset(skip).limit(limit).all()
    return PaginatedResponse(data=products, total=total, skip=skip, limit=limit, has_more=skip + limit < total)

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
