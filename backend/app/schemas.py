from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr, ConfigDict


class ServiceCreate(BaseModel):
    title: str = Field(..., min_length=3)
    category: str
    description: str
    price_per_sqm: float = Field(..., gt=0)
    image_url: Optional[str] = "https://placehold.co"


class ServiceOut(ServiceCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


class ProjectCreate(BaseModel):
    title: str
    location: str
    area_sqm: float
    description: str
    image_url: str


class ProjectOut(ProjectCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


class ProjectUpdate(BaseModel):
    title: str | None = None
    location: str | None = None
    area_sqm: float| None = None
    description: str | None = None
    image_url: str | None = None
    is_published: bool | None = None


class ApplicationCreate(BaseModel):
    client_name: str = Field(min_length=2, max_length=100)
    phone: str = Field(min_length=6, max_length=30)
    email: EmailStr | None = Field(default=None, max_length=100)
    description: str = Field(..., min_length=5)
    estimated_cost: Optional[float] = None


class ApplicationOut(ApplicationCreate):
    id: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class StatusUpdate(BaseModel):
    status: str


class UserLogin(BaseModel):
    email: EmailStr = Field(max_length=100)
    password: str


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    password: str = Field(min_length=8, max_length=128)
    email: EmailStr = Field(max_length=100)


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"