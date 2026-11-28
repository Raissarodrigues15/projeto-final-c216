from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.exceptions import ConflictError, NotFoundError
from app.routers import category, transaction

app = FastAPI(
    title="Sistema de Gestão Financeira",
    description="API para gerenciamento de receitas e despesas.",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(category.router)
app.include_router(transaction.router)


@app.get("/")
def home():
    return {"mensagem": "Bem-vindo ao Sistema de Gestão Financeira!"}


@app.get("/health")
def health_check():
    return {"status": "online"}


@app.exception_handler(NotFoundError)
async def not_found_handler(request: Request, exc: NotFoundError):
    return JSONResponse(status_code=404, content={"detail": str(exc)})


@app.exception_handler(ConflictError)
async def conflict_handler(request: Request, exc: ConflictError):
    return JSONResponse(status_code=409, content={"detail": str(exc)})
