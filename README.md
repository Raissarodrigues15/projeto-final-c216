# Meu Financeiro

Sistema web de gestão financeira pessoal, desenvolvido como projeto final da disciplina C216.

## Objetivo

Permitir que o usuário organize suas finanças pessoais, cadastrando receitas, despesas e categorias, além de acompanhar seu saldo financeiro.

## Funcionalidades

- Cadastro, edição, listagem e exclusão de transações.
- Cadastro, listagem e exclusão de categorias.
- Associação de transações às categorias.
- Identificação de receitas e despesas.
- Painel com total de receitas, despesas e saldo.
- Persistência dos dados em PostgreSQL.

## Tecnologias

**Backend:** Python, FastAPI, SQLAlchemy, Alembic, Poetry e Pydantic.

**Frontend:** React, JavaScript, Vite e Biome.

**Banco de dados:** PostgreSQL.

**Testes:** Pytest, Vitest, Testing Library e Playwright.

**Infraestrutura:** Docker, Docker Compose e GitHub Actions.

## Estrutura do projeto

```text
projeto-final-c216/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── database/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routers/
│   │   ├── schemas/
│   │   └── services/
│   ├── migrations/
│   ├── tests/
│   └── Dockerfile
├── frontend/
│   ├── e2e/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── test/
│   ├── Dockerfile
│   └── playwright.config.js
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
├── Makefile
└── README.md
```

## Pré-requisitos

- Docker e Docker Compose.
- Git.

Para executar testes fora dos containers, também são necessários Python, Poetry e Node.js.

## Configuração

As configurações de ambiente estão documentadas nos arquivos `.env.example` do projeto.

Não coloque senhas ou informações sensíveis no repositório.

## Como executar

Na raiz do projeto, execute:

```bash
docker compose up -d --build
```

A aplicação ficará disponível em:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Documentação da API: http://localhost:8000/docs

O Docker Compose inicia o PostgreSQL, aplica as migrations do Alembic pelo backend e disponibiliza a aplicação.

## Migrations

Para aplicar as migrations manualmente:

```bash
cd backend
poetry run alembic upgrade head
```

## Testes

Backend:

```bash
cd backend
poetry run pytest
```

Frontend:

```bash
cd frontend
npm run test
```

Testes E2E:

```bash
cd frontend
npm run test:e2e
```

Os testes E2E precisam da aplicação e do banco de dados em execução.

## Makefile

Os principais comandos podem ser executados na raiz:

| Comando | Descrição |
|---|---|
| `make up` | Inicia os containers |
| `make down` | Encerra os containers |
| `make logs` | Exibe os logs |
| `make test` | Executa testes do backend e frontend |
| `make test-e2e` | Executa testes E2E |
| `make lint` | Verifica o código |
| `make build` | Constrói as imagens Docker |

## Integração contínua

O GitHub Actions executa verificações de lint, formatação, testes do backend e frontend, build e teste E2E com Docker Compose.

## Demonstração

**Vídeo de demonstração:** adicionar o link após a gravação.

