"""
CreditWise AI — FastAPI Application Entry Point
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from api.routes import analytics, health, model, prediction
from database.database import init_db

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    logger.info("CreditWise AI backend starting...")
    init_db()
    logger.info("Database ready.")
    yield
    logger.info("CreditWise AI backend shutting down.")


app = FastAPI(
    title="CreditWise AI API",
    description=(
        "Intelligent Credit Risk & Creditworthiness Assessment Platform. "
        "AI-generated risk assessment for demonstration purposes only."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all: never expose stack traces to frontend."""
    logger.exception(f"Unhandled exception on {request.url}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "An unexpected error occurred. Please try again.",
            "detail": None,
        },
    )


# Register routers
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(prediction.router, prefix="/api", tags=["Prediction"])
app.include_router(model.router, prefix="/api", tags=["Model"])
app.include_router(analytics.router, prefix="/api", tags=["Analytics"])


@app.get("/")
async def root():
    return {
        "service": "CreditWise AI",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running",
    }
