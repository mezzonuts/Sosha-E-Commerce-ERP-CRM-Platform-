from typing import Generic, TypeVar, List, Dict, Any
from pydantic import BaseModel

T = TypeVar("T")

class PaginationParams(BaseModel):
    skip: int = 0
    limit: int = 20

    class Config:
        json_schema_extra = {
            "example": {
                "skip": 0,
                "limit": 20
            }
        }

class PaginatedResponse(BaseModel, Generic[T]):
    data: List[T]
    total: int
    skip: int
    limit: int
    has_more: bool

    class Config:
        json_schema_extra = {
            "example": {
                "data": [],
                "total": 0,
                "skip": 0,
                "limit": 20,
                "has_more": False
            }
        }
