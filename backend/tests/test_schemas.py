import pytest
from pydantic import ValidationError

from app.schemas.category import CategoryCreate
from app.schemas.transaction import TransactionCreate, TransactionUpdate


def test_criar_categoria():
    category = CategoryCreate(
        name="Alimentação", description="Despesas com alimentação"
    )

    assert category.name == "Alimentação"


def test_criar_lancamento():
    transaction = TransactionCreate(
        description="Compra no mercado",
        amount=150.00,
        type="despesa",
        date="2026-11-17",
        category_id=1,
    )

    assert transaction.amount == 150.00
    assert transaction.category_id == 1


def test_lancamento_sem_descricao():
    with pytest.raises(ValidationError):
        TransactionCreate(
            amount=150.00, type="despesa", date="2026-11-17", category_id=1
        )


def test_atualizacao_parcial():
    transaction = TransactionUpdate(description="Nova descrição")

    assert transaction.model_dump(exclude_unset=True) == {
        "description": "Nova descrição"
    }
