import pytest
from pydantic import ValidationError

from backend.app.schemas import ServiceCreate


def tests_service_rejects_zero_price():
    data = {
        "title": "Штукатурка стен",
        "category": "Отделка",
        "description": "Выравнивание стен",
        "price_per_sqm": 0,
    }

    with pytest.raises(ValidationError) as error:
        ServiceCreate(**data)


    first_error = error.value.errors()[0]
    assert first_error["loc"] == ("price_per_sqm",)


def test_service_accepts_positive_price():
    data = {
        "title": "Штукатурка стен",
        "category": "Отделка",
        "description": "Выравнивание стен",
        "price_per_sqm": 100,
    }

    service = ServiceCreate(**data)
    assert service.price_per_sqm == 100


def test_service_rejects_short_title():
    data = {
        "title": "Шт",
        "category": "Отделка",
        "description": "Выравнивание стен",
        "price_per_sqm": 150,
    }

    with pytest.raises(ValidationError) as error:
        ServiceCreate(**data)


    first_error = error.value.errors()[0]
    assert first_error["loc"] == ("title",)


def test_service_rejects_positive_title():
    data = {
        "title": "Штукатурка",
        "category": "Отделка",
        "description": "Выравнивание стен",
        "price_per_sqm": 150,
    }

    service = ServiceCreate(**data)
    assert service.title == "Штукатурка"