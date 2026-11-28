from getpass import getpass

from sqlalchemy import select

from app.database import SessionLocal
from app.models import User
from app.security import hash_password


def create_admin():
    name = input("Имя: ").strip()
    email = input("Email: ").strip().lower()
    password = getpass("Пароль: ")

    if not name or len(name) > 100 or not email or len(email) > 100:
        print("Некорректное имя или email")
        return

    if not 8 <= len(password) <= 128:
        print("Пароль должен содержать от 8 до 128 символов")
        return

    with SessionLocal() as db:
        existing_user = db.scalar(
            select(User).where(User.email == email)
        )

        if existing_user:
            print("Пользователь уже существует")
            return

        admin = User(
            name=name,
            email=email,
            password_hash=hash_password(password),
            role="admin",
            is_active=True
        )

        db.add(admin)
        db.commit()

        print("Администратор успешно создан")


if __name__ == "__main__":
    create_admin()