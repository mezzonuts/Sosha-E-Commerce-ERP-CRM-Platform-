from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CustomerBase(BaseModel):
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None

class CustomerCreate(CustomerBase):
    user_id: int

class CustomerResponse(CustomerBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
