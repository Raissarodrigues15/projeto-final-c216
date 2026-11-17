from sqlalchemy.orm import Session

from app.models.transaction import Transaction


class TransactionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, transaction: Transaction):
        self.db.add(transaction)
        self.db.commit()
        self.db.refresh(transaction)
        return transaction

    def get_all(self):
        return self.db.query(Transaction).all()

    def get_by_id(self, transaction_id: int):
        return (
            self.db.query(Transaction).filter(Transaction.id == transaction_id).first()
        )

    def update(self, transaction: Transaction):
        self.db.commit()
        self.db.refresh(transaction)
        return transaction

    def delete(self, transaction: Transaction):
        self.db.delete(transaction)
        self.db.commit()
