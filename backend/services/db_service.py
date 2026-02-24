from typing import List, Dict
from db.supabase import get_supabase_client
from services.ai_service import analyze_article_text
import logging

logger = logging.getLogger(__name__)

def store_articles_in_db(articles: List[Dict]):
    """Stores fetched articles in the Supabase 'articles' table."""
    client = get_supabase_client()
    
    # Optional: Basic deduplication to avoid inserting same URL/title repeatedly
    # Supabase unique constraints would be better, but we handle it simply for now.
    
    inserted_count = 0
    
    for article in articles:
        try:
            # Call AI pipeline
            ai_data = analyze_article_text(article["content_summary"])
            
            # Upsert logic can be implemented if unique constraints are setup
            data, count = client.table("articles").insert({
                "title": article["title"],
                "source_domain": article["source_domain"],
                "content_summary": article["content_summary"],
                "sentiment": ai_data["sentiment"],
                "is_fake": ai_data["is_fake"],
                "credibility_score": ai_data["credibility_score"],
                "category": article.get("category", "general"),
                "ai_reasoning": ai_data.get("ai_reasoning", "")
            }).execute()
            inserted_count += 1
        except Exception as e:
            logger.error(f"Error inserting article '{article['title']}': {e}")
            
    logger.info(f"Successfully inserted {inserted_count} out of {len(articles)} articles into Supabase.")
    return inserted_count
