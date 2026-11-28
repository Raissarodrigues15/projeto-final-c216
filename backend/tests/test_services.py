from datetime import date
from unittest.mock import Mock

import pytest

from app.core.exceptions import ConflictError, NotFoundError
from app.repositories.category_repository import CategoryRepository
from app.repositories.transaction_repository import TransactionRepository
from app.schemas.category import CategoryCreate
from app.schemas.transaction import TransactionCreate, TransactionUpdate
from app.services.category_service import CategoryService
from app.services.transaction_service import TransactionService


def test_criar_categoria_com_sucesso(monkeypatch):
    monkeypatch.setattr(CategoryRepository, "get_by_name", Mock(return_value=None))
    monkeypatch.setattr(
        CategoryRepository,
        "create",
        Mock(side_effect=lambda category: category),
    )

    data = CategoryCreate(name="Alimentação", description="Gastos com comida")
    result = CategoryService.create(None, data)

    assert result.name == "Alimentação"
    assert result.description == "Gastos com comida"


def test_nao_criar_categoria_duplicada(monkeypatch):
    monkeypatch.setattr(CategoryRepository, "get_by_name", Mock(return_value=object()))

    data = CategoryCreate(name="Alimentação")

    with pytest.raises(ConflictError):
        CategoryService.create(None, data)


def test_buscar_categoria_inexistente(monkeypatch):
    monkeypatch.setattr(CategoryRepository, "get_by_id", Mock(return_value=None))

    with pytest.raises(NotFoundError):
        CategoryService.get_by_id(None, 999)


def test_nao_excluir_categoria_com_lancamentos(monkeypatch):
    monkeypatch.setattr(CategoryService, "get_by_id", Mock(return_value=object()))
    monkeypatch.setattr(CategoryRepository, "has_transactions", Mock(return_value=True))
    delete_mock = Mock()
    monkeypatch.setattr(CategoryRepository, "delete", delete_mock)

    with pytest.raises(ConflictError):
        CategoryService.delete(None, 1)

    delete_mock.assert_not_called()


def test_excluir_categoria_sem_lancamentos(monkeypatch):
    category = object()
    monkeypatch.setattr(CategoryService, "get_by_id", Mock(return_value=category))
    monkeypatch.setattr(
        CategoryRepository, "has_transactions", Mock(return_value=False)
    )
    delete_mock = Mock()
    monkeypatch.setattr(CategoryRepository, "delete", delete_mock)

    CategoryService.delete(None, 1)

    delete_mock.assert_called_once_with(category)


def test_criar_lancamento_com_sucesso(monkeypatch):
    monkeypatch.setattr(CategoryRepository, "get_by_id", Mock(return_value=object()))
    monkeypatch.setattr(
        TransactionRepository,
        "create",
        Mock(side_effect=lambda transaction: transaction),
    )

    data = TransactionCreate(
        description="Conta de luz",
        amount=150.0,
        type="despesa",
        date=date(2026, 11, 17),
        category_id=1,
    )

    result = TransactionService.create(None, data)

    assert result.description == "Conta de luz"
    assert result.amount == 150.0
    assert result.category_id == 1


def test_nao_criar_lancamento_com_categoria_inexistente(monkeypatch):
    monkeypatch.setattr(CategoryRepository, "get_by_id", Mock(return_value=None))

    data = TransactionCreate(
        description="Conta de luz",
        amount=150.0,
        type="despesa",
        date=date(2026, 11, 17),
        category_id=999,
    )

    with pytest.raises(NotFoundError):
        TransactionService.create(None, data)


def test_buscar_lancamento_inexistente(monkeypatch):
    monkeypatch.setattr(TransactionRepository, "get_by_id", Mock(return_value=None))

    with pytest.raises(NotFoundError):
        TransactionService.get_by_id(None, 999)


def test_atualizar_lancamento_com_sucesso(monkeypatch):
    transaction = Mock()
    transaction.description = "Conta antiga"

    monkeypatch.setattr(TransactionService, "get_by_id", Mock(return_value=transaction))
    monkeypatch.setattr(
        TransactionRepository,
        "update",
        Mock(side_effect=lambda item: item),
    )

    data = TransactionUpdate(description="Conta atualizada")
    result = TransactionService.update(None, 1, data)

    assert result.description == "Conta atualizada"


def test_atualizar_lancamento_com_categoria_inexistente(monkeypatch):
    transaction = Mock()

    monkeypatch.setattr(TransactionService, "get_by_id", Mock(return_value=transaction))
    monkeypatch.setattr(CategoryRepository, "get_by_id", Mock(return_value=None))

    data = TransactionUpdate(category_id=999)

    with pytest.raises(NotFoundError):
        TransactionService.update(None, 1, data)


def test_excluir_lancamento_com_sucesso(monkeypatch):
    transaction = object()

    monkeypatch.setattr(TransactionService, "get_by_id", Mock(return_value=transaction))
    delete_mock = Mock()
    monkeypatch.setattr(TransactionRepository, "delete", delete_mock)

    TransactionService.delete(None, 1)

    delete_mock.assert_called_once_with(transaction)
