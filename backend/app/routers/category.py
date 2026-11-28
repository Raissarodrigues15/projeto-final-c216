# ruff: noqa: B008
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.category import CategoryCreate, CategoryResponse
from app.services.category_service import CategoryService

router = APIRouter(prefix="/categories", tags=["Categorias"])


@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(data: CategoryCreate, db: Session = Depends(get_db)):
    return CategoryService.create(db, data)


@router.get("/", response_model=list[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return CategoryService.list_all(db)


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    return CategoryService.get_by_id(db, category_id)


@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    CategoryService.delete(db, category_id)
    return {"message": "Categoria excluida com sucesso."}
