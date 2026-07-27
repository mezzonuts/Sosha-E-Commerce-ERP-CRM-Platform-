from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CRMActivityBase(BaseModel):
    customer_id: int
    activity_type: str
    notes: Optional[str] = None

class CRMActivityCreate(CRMActivityBase):
    pass

class CRMActivityResponse(CRMActivityBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
