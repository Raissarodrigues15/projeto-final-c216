class NotFoundError(Exception):
    """Recurso não encontrado."""


class ConflictError(Exception):
    """Conflito com uma regra de negócio."""
