from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ShipmentBase(BaseModel):
    order_id: int
    courier: Optional[str] = None
    tracking_number: Optional[str] = None
    status: str = "pending"

class ShipmentCreate(ShipmentBase):
    pass

class ShipmentResponse(ShipmentBase):
    id: int

    class Config:
        from_attributes = True
