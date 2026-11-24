from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from .database import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    price_per_sqm = Column(Float, nullable=False)  # Тариф за 1 кв.м для калькулятора
    image_url = Column(String(255), default="/images/default-service.jpg")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    location = Column(String(150), nullable=False)
    area_sqm = Column(Float, nullable=False)
    description = Column(Text, nullable=False)
    image_url = Column(String(255), nullable=False)

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String(100), nullable=False)
    phone = Column(String(30), nullable=False)
    email = Column(String(100), nullable=True)
    description = Column(Text, nullable=False)
    estimated_cost = Column(Float, nullable=True)
    status = Column(String(30), default="Новая заявка")
    created_at = Column(DateTime, default=datetime.utcnow)
