from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class ServiceCreate(BaseModel):
    title: str = Field(..., min_length=3)
    category: str
    description: str
    price_per_sqm: float = Field(..., gt=0)
    image_url: Optional[str] = "https://placehold.co"

class ServiceOut(ServiceCreate):
    id: int
    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    title: str
    location: str
    area_sqm: float
    description: str
    image_url: str

class ProjectOut(ProjectCreate):
    id: int
    class Config:
        from_attributes = True

class ProjectUpdate(BaseModel):
    title: str | None = None
    location: str | None = None
    area_sqm: float| None = None
    description: str | None = None
    image_url: str | None = None
    is_published: bool | None = None

class ApplicationCreate(BaseModel):
    client_name: str = Field(..., min_length=2)
    phone: str = Field(..., min_length=6)
    email: Optional[str] = None
    description: str = Field(..., min_length=5)
    estimated_cost: Optional[float] = None

class ApplicationOut(ApplicationCreate):
    id: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class StatusUpdate(BaseModel):
    status: str
