from datetime import date as Date

from pydantic import BaseModel, ConfigDict


class TransactionCreate(BaseModel):
    description: str
    amount: float
    type: str
    date: Date
    category_id: int


class TransactionUpdate(BaseModel):
    description: str | None = None
    amount: float | None = None
    type: str | None = None
    date: Date | None = None
    category_id: int | None = None


class TransactionResponse(BaseModel):
    id: int
    description: str
    amount: float
    type: str
    date: Date
    category_id: int

    model_config = ConfigDict(from_attributes=True)
