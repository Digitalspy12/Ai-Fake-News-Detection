from transformers import pipeline
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

# Initialize pipelines globally so they load once on startup
logger.info("Loading AI pipelines. This might take a moment on first run...")

# 1. Fake News Detection
try:
    # We use mrm8488/bert-tiny-finetuned-fake-news-detection as per PRD
    fake_news_pipeline = pipeline("text-classification", model="mrm8488/bert-tiny-finetuned-fake-news-detection")
except Exception as e:
    logger.error(f"Failed to load fake news model: {e}")
    fake_news_pipeline = None

# 2. Sentiment Analysis
try:
    # A standard small model for sentiment
    sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
except Exception as e:
    logger.error(f"Failed to load sentiment model: {e}")
    sentiment_pipeline = None

def analyze_article_text(text: str) -> Dict[str, Any]:
    """
    Analyzes text and returns sentiment and credibility metrics.
    Truncates text to model limits (usually 512 tokens) to prevent crashes.
    """
    if not text:
        return {
            "sentiment": "neutral",
            "is_fake": False,
            "credibility_score": 0.5
        }
        
    # Truncate to safe length for BERT models (~512 words as rough heuristic)
    safe_text = " ".join(text.split()[:400])
    
    result = {
        "sentiment": "neutral",
        "is_fake": False,
        "credibility_score": 0.5
    }

    # Process fake news prediction
    if fake_news_pipeline:
        try:
            fn_preds = fake_news_pipeline(safe_text)
            if fn_preds:
                # Labels usually look like 'LABEL_0' (True) and 'LABEL_1' (Fake) 
                # or 'real', 'fake' depending on exact model configs. 
                # Let's inspect confidence:
                pred = fn_preds[0]
                label = pred['label'].lower()
                score = pred['score']
                
                # Heuristic mapping
                if "fake" in label or "1" in label:
                    result["is_fake"] = score > 0.6  # arbitrary confidence threshold
                    result["credibility_score"] = 1.0 - score if result["is_fake"] else score
                else:
                    result["is_fake"] = False
                    result["credibility_score"] = score
        except Exception as e:
            logger.error(f"Fake news pipeline error: {e}")

    # Process sentiment
    if sentiment_pipeline:
        try:
            sent_preds = sentiment_pipeline(safe_text)
            if sent_preds:
                pred = sent_preds[0]
                label = pred['label'].lower()
                # Ensure mapping to frontend expected values (positive/negative/neutral)
                if label == "positive":
                    result["sentiment"] = "positive"
                elif label == "negative":
                    result["sentiment"] = "negative"
                else:
                    result["sentiment"] = "neutral"
        except Exception as e:
            logger.error(f"Sentiment pipeline error: {e}")

    return result

if __name__ == "__main__":
    test_text = "Shocking news! The earth is actually flat and scientists have been lying to us."
    print("Testing pipeline on:", test_text)
    print(analyze_article_text(test_text))
