
.PHONY: up down logs restart test test-backend test-frontend test-e2e lint format build migrate

# Iniciar os serviços
up:
	docker compose up -d --build

# Encerrar os serviços
down:
	docker compose down

# Exibir logs
logs:
	docker compose logs -f

# Reiniciar os serviços
restart:
	docker compose down
	docker compose up -d --build

# Executar todos os testes locais
test: test-backend test-frontend

test-backend:
	cd backend && poetry run pytest

test-frontend:
	cd frontend && npm run test

# Executar testes E2E (aplicação precisa estar rodando)
test-e2e:
	cd frontend && npm run test:e2e

# Verificar código
lint:
	cd backend && poetry run ruff check .
	cd frontend && npm run check

# Verificar formatação
format:
	cd backend && poetry run ruff format --check .
	cd frontend && npm run check

# Construir imagens Docker
build:
	docker compose build

# Aplicar migrations
migrate:
	cd backend && poetry run alembic upgrade head
