from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.product import ProductResponse

class OrderItemBase(BaseModel):
    product_id: int
    qty: int
    price: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemResponse(OrderItemBase):
    id: int
    order_id: int
    product: Optional[ProductResponse] = None

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    customer_id: int
    status: str = "pending"

class OrderCreate(OrderBase):
    items: list[OrderItemCreate]

class OrderUpdateStatus(BaseModel):
    status: str

class OrderResponse(OrderBase):
    id: int
    order_date: datetime
    total_amount: float
    items: list[OrderItemResponse] = []

    class Config:
        from_attributes = True
