from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import MarketplaceSync, Product
from app.schemas.product import ProductCreate
from app.core.pagination import PaginatedResponse
from typing import List

router = APIRouter(prefix="/api/marketplace", tags=["marketplace"])

MARKETPLACES = ["tokopedia", "shopee", "lazada", "blibli"]

@router.get("/products", response_model=PaginatedResponse[dict])
def get_marketplace_products(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    syncs = db.query(MarketplaceSync).offset(skip).limit(limit).all()
    total = db.query(MarketplaceSync).count()
    data = []
    for sync in syncs:
        product = db.query(Product).filter(Product.id == sync.product_id).first()
        data.append({
            "id": sync.id,
            "marketplace": sync.marketplace,
            "product_id": sync.product_id,
            "sync_status": sync.sync_status,
            "product_name": product.name if product else None,
            "product_sku": product.sku if product else None,
        })
    return PaginatedResponse(data=data, total=total, skip=skip, limit=limit, has_more=skip + limit < total)

@router.post("/sync/{product_id}")
def sync_product_to_marketplaces(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    results = []
    for marketplace in MARKETPLACES:
        existing = db.query(MarketplaceSync).filter(
            MarketplaceSync.product_id == product_id,
            MarketplaceSync.marketplace == marketplace
        ).first()
        
        if existing:
            existing.sync_status = "synced"
            results.append({"marketplace": marketplace, "status": "updated"})
        else:
            sync = MarketplaceSync(
                marketplace=marketplace,
                product_id=product_id,
                sync_status="synced"
            )
            db.add(sync)
            results.append({"marketplace": marketplace, "status": "created"})
    
    db.commit()
    return {"message": "Product synced to marketplaces", "results": results}
