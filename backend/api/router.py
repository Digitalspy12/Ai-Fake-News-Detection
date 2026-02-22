from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from services.ai_service import analyze_article_text
from db.supabase import get_supabase_client

api_router = APIRouter()

class ArticleAnalyzeRequest(BaseModel):
    text: str

class ArticleAnalyzeResponse(BaseModel):
    sentiment: str
    is_fake: bool
    credibility_score: float

@api_router.post("/analyze", response_model=ArticleAnalyzeResponse)
def analyze_endpoint(request: ArticleAnalyzeRequest):
    """Analyze a single block of text for fake news and sentiment."""
    try:
        result = analyze_article_text(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/articles")
def get_articles(limit: int = 50, offset: int = 0):
    """Fetch recent articles from Supabase."""
    try:
        client = get_supabase_client()
        # Order by latest first
        response = client.table("articles").select("*").order("published_at", desc=True).limit(limit).offset(offset).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
