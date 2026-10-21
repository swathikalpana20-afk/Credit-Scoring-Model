"""
CreditWise AI — Health endpoint
"""

from fastapi import APIRouter
from datetime import datetime

router = APIRouter()


@router.get("/health")
async def health_check():
    """Returns service health status."""
    return {
        "status": "healthy",
        "service": "CreditWise AI Backend",
        "timestamp": datetime.utcnow().isoformat(),
    }
