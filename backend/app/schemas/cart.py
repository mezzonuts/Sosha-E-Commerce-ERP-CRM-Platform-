from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.product import ProductResponse

class CartItemBase(BaseModel):
    product_id: int
    qty: int

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    qty: int

class CartItemResponse(CartItemBase):
    id: int
    cart_id: int
    price: float
    product: Optional[ProductResponse] = None
    created_at: datetime

    class Config:
        from_attributes = True

class CartResponse(BaseModel):
    id: int
    customer_id: int
    items: list[CartItemResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
