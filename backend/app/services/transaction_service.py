from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.models.transaction import Transaction
from app.repositories.category_repository import CategoryRepository
from app.repositories.transaction_repository import TransactionRepository
from app.schemas.transaction import TransactionCreate, TransactionUpdate


class TransactionService:
    @staticmethod
    def create(db: Session, data: TransactionCreate):
        category_repository = CategoryRepository(db)

        category = category_repository.get_by_id(data.category_id)
        if not category:
            raise NotFoundError("Categoria não encontrada.")

        transaction = Transaction(**data.model_dump())
        repository = TransactionRepository(db)
        return repository.create(transaction)

    @staticmethod
    def get_by_id(db: Session, transaction_id: int):
        repository = TransactionRepository(db)
        transaction = repository.get_by_id(transaction_id)

        if not transaction:
            raise NotFoundError("Lançamento não encontrado.")

        return transaction

    @staticmethod
    def list_all(db: Session):
        repository = TransactionRepository(db)
        return repository.get_all()

    @staticmethod
    def update(
        db: Session,
        transaction_id: int,
        data: TransactionUpdate,
    ):
        transaction = TransactionService.get_by_id(db, transaction_id)
        changes = data.model_dump(exclude_unset=True)

        if "category_id" in changes:
            category_repository = CategoryRepository(db)
            category = category_repository.get_by_id(changes["category_id"])

            if not category:
                raise NotFoundError("Categoria não encontrada.")

        for field, value in changes.items():
            setattr(transaction, field, value)

        repository = TransactionRepository(db)
        return repository.update(transaction)

    @staticmethod
    def delete(db: Session, transaction_id: int):
        transaction = TransactionService.get_by_id(db, transaction_id)
        repository = TransactionRepository(db)
        repository.delete(transaction)
