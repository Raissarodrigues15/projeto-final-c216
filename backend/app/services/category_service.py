from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, NotFoundError
from app.models.category import Category
from app.repositories.category_repository import CategoryRepository
from app.schemas.category import CategoryCreate


class CategoryService:
    @staticmethod
    def create(db: Session, data: CategoryCreate):
        repository = CategoryRepository(db)

        existing = repository.get_by_name(data.name)
        if existing:
            raise ConflictError("Já existe uma categoria com esse nome.")

        category = Category(**data.model_dump())
        return repository.create(category)

    @staticmethod
    def get_by_id(db: Session, category_id: int):
        repository = CategoryRepository(db)
        category = repository.get_by_id(category_id)

        if not category:
            raise NotFoundError("Categoria não encontrada.")

        return category

    @staticmethod
    def list_all(db: Session):
        repository = CategoryRepository(db)
        return repository.get_all()

    @staticmethod
    def delete(db: Session, category_id: int):
        category = CategoryService.get_by_id(db, category_id)
        repository = CategoryRepository(db)

        if repository.has_transactions(category_id):
            raise ConflictError(
                "Não é possível excluir uma categoria que possui lançamentos."
            )

        repository.delete(category)
