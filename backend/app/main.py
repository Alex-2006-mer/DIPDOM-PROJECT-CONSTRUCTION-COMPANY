import os
import secrets
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas
from .database import get_db

app = FastAPI(title="СтройПрофи Москва API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def require_admin_password() -> str:
    password = os.getenv("ADMIN_PASSWORD")
    if not password or not password.strip():
        raise RuntimeError("Пароль не задан !!!(Переменная ADMIN_PASSWORD обязательна)!!!")
    return password

ADMIN_PASSWORD = require_admin_password()


def verify_admin(x_admin_token: Optional[str] = Header(default=None)):
    if not x_admin_token or not secrets.compare_digest(
        x_admin_token, ADMIN_PASSWORD
    ):
        raise HTTPException(
            status_code=401,
            detail="Неверный токен администратора",
        )


@app.get("/api/services", response_model=List[schemas.ServiceOut])
def list_services(db: Session = Depends(get_db)):
    return db.query(models.Service).all()

@app.get("/api/projects", response_model=List[schemas.ProjectOut])
def list_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()

@app.post("/api/applications", response_model=schemas.ApplicationOut)
def create_application(payload: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    new_app = models.Application(**payload.model_dump())
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app

@app.post("/api/admin/login")
def admin_login(data: dict):
    if data.get("password") == ADMIN_PASSWORD:
        return {"token": ADMIN_PASSWORD}
    raise HTTPException(status_code=401, detail="Неверный пароль")

@app.get("/api/admin/applications", response_model=List[schemas.ApplicationOut], dependencies=[Depends(verify_admin)])
def admin_list_applications(db: Session = Depends(get_db)):
    return db.query(models.Application).order_by(models.Application.created_at.desc()).all()

@app.patch("/api/admin/applications/{app_id}", response_model=schemas.ApplicationOut, dependencies=[Depends(verify_admin)])
def admin_update_status(app_id: int, payload: schemas.StatusUpdate, db: Session = Depends(get_db)):
    item = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Заявка не найдена")
    item.status = payload.status
    db.commit()
    db.refresh(item)
    return item

@app.post("/api/admin/projects", response_model=schemas.ProjectOut, dependencies=[Depends(verify_admin)])
def add_project(payload: schemas.ProjectCreate, db: Session = Depends(get_db)):
    new_project = models.Project(**payload.model_dump())
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@app.post("/api/admin/services", response_model=schemas.ServiceOut, dependencies=[Depends(verify_admin)])
def admin_create_service(payload: schemas.ServiceCreate, db: Session = Depends(get_db)):
    srv = models.Service(**payload.model_dump())
    db.add(srv)
    db.commit()
    db.refresh(srv)
    return srv


@app.delete("/api/admin/services/{service_id}", dependencies=[Depends(verify_admin)])
def delete_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(models.Service).filter(
        models.Service.id == service_id).first()

    if not service:
        raise HTTPException(status_code=404, detail= "услуга не найденна")
    db.delete(service)
    db.commit()
    return {"message": "Услуга удаленна"}



