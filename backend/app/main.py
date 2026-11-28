import os
import secrets
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from app.security import (hash_password, verify_password, create_access_token)
from app.dependencies import get_current_user, require_admin
from . import models, schemas
from .database import get_db

app = FastAPI(title="СтройПрофи Москва API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/services",
         response_model=List[schemas.ServiceOut],
         )
def list_services(db: Session = Depends(get_db)):
    return db.query(models.Service).all()


@app.get("/api/projects",
         response_model=List[schemas.ProjectOut],
         )
def list_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).filter(models.Project.is_published.is_(True)).all()


@app.post("/api/applications",
          response_model=schemas.ApplicationOut,
          )
def create_application(payload: schemas.ApplicationCreate,
                       db: Session = Depends(get_db),
                       ):
    new_app = models.Application(**payload.model_dump())
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app


@app.post(
    "/api/auth/register",
    response_model=schemas.UserOut,
    status_code=201
)
def register(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    email = user.email.lower()

    existing_user = db.scalar(
        select(models.User).where(models.User.email == email)
    )

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Пользователь с такой почтой уже существует"
        )

    new_user = models.User(
        name=user.name,
        email=email,
        password_hash=hash_password(user.password),
        role="user",
        is_active=True
    )

    db.add(new_user)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Не удалось зарегистрировать пользователя"
        )

    db.refresh(new_user)

    return new_user


@app.post("/api/auth/login", response_model=schemas.Token)
def login(
    user: schemas.UserLogin,
    db: Session = Depends(get_db)
):
    db_user = db.scalar(
        select(models.User).where(
            models.User.email == user.email.lower()
        )
    )

    if not db_user or not verify_password(
        user.password, db_user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Неверная почта или пароль"
        )

    if not db_user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Аккаунт заблокирован"
        )

    token = create_access_token(db_user.id)

    return schemas.Token(access_token=token)


@app.get("/api/auth/me", response_model=schemas.UserOut)
def get_me(
    current_user: models.User = Depends(get_current_user)
):
    return current_user


@app.get("/api/admin/check")
def check_admin(
    admin: models.User = Depends(require_admin)
):
    return {"message": "Доступ разрешён"}


@app.get("/api/admin/applications",
         response_model=List[schemas.ApplicationOut],
         dependencies=[Depends(require_admin)],
         )
def admin_list_applications(db: Session = Depends(get_db)):
    return db.query(models.Application).order_by(models.Application.created_at.desc()).all()


@app.patch("/api/admin/applications/{app_id}",
           response_model=schemas.ApplicationOut,
           dependencies=[Depends(require_admin)],
           )
def admin_update_status(app_id: int,
                        payload: schemas.StatusUpdate,
                        db: Session = Depends(get_db),
                        ):
    item = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Заявка не найдена")
    item.status = payload.status
    db.commit()
    db.refresh(item)
    return item


@app.post("/api/admin/projects",
          response_model=schemas.ProjectOut,
          dependencies=[Depends(require_admin)],
          )
def add_project(payload: schemas.ProjectCreate,
                db: Session = Depends(get_db),
                ):
    new_project = models.Project(**payload.model_dump())
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project


@app.patch("/api/admin/projects/{project_id}",
           response_model=schemas.ProjectOut,
           dependencies=[Depends(require_admin)],
           )
def update_projects(project_id: int,
                    payload: schemas.ProjectUpdate,
                    db: Session = Depends(get_db)
                    ):
    item = db.query(models.Project).filter(models.Project.id == project_id).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Проект не найден")

    changes = payload.model_dump(exclude_unset=True)
    for field, value in changes.items():
        if value is None:
            raise HTTPException(
                status_code=422,
                detail=f"Поле {field} не может быть null",
            )

    for field, value in changes.items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


@app.post("/api/admin/services",
          response_model=schemas.ServiceOut,
          dependencies=[Depends(require_admin)],
          )
def admin_create_service(payload: schemas.ServiceCreate,
                         db: Session = Depends(get_db),
                         ):
    srv = models.Service(**payload.model_dump())
    db.add(srv)
    db.commit()
    db.refresh(srv)
    return srv



@app.delete("/api/admin/services/{service_id}",
            dependencies=[Depends(require_admin)],
            )
def delete_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(models.Service).filter(
        models.Service.id == service_id).first()

    if not service:
        raise HTTPException(status_code=404, detail= "услуга не найденна")
    db.delete(service)
    db.commit()
    return {"message": "Услуга удаленна"}



