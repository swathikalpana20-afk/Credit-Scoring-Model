"""
CreditWise AI — Unified API response schemas
"""

from typing import Any, Optional
from pydantic import BaseModel


class SuccessResponse(BaseModel):
    success: bool = True
    data: Any


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    detail: Optional[str] = None
