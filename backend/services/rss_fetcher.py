import feedparser
from bs4 import BeautifulSoup
from typing import List, Dict

# Grouped by category
RSS_SOURCES = {
    "sports": {
        "BBC Sport": "http://feeds.bbci.co.uk/sport/rss.xml",
        "Yahoo Sports": "https://sports.yahoo.com/rss/"
    },
    "politics": {
        "CNN Politics": "http://rss.cnn.com/rss/cnn_allpolitics.rss",
        "BBC Politics": "http://feeds.bbci.co.uk/news/politics/rss.xml"
    },
    "business": {
        "Yahoo Finance": "https://finance.yahoo.com/news/rss",
        "BBC Business": "http://feeds.bbci.co.uk/news/business/rss.xml"
    },
    "technology": {
        "CNN Tech": "http://rss.cnn.com/rss/cnn_tech.rss",
        "BBC Technology": "http://feeds.bbci.co.uk/news/technology/rss.xml"
    },
    "general": {
        "BBC": "http://feeds.bbci.co.uk/news/rss.xml",
        "CNN": "http://rss.cnn.com/rss/edition_world.rss",
        "AlJazeera": "http://www.aljazeera.com/xml/rss/all.xml"
    }
}

def clean_html(raw_html: str) -> str:
    """Removes HTML tags from the given string."""
    if not raw_html:
        return ""
    soup = BeautifulSoup(raw_html, "html.parser")
    return soup.get_text(separator=" ", strip=True)

def fetch_articles() -> List[Dict]:
    """Fetches articles from configured RSS sources and standardizes them."""
    articles = []
    
    for category, sources in RSS_SOURCES.items():
        for source_domain, feed_url in sources.items():
            try:
                feed = feedparser.parse(feed_url)
                for entry in feed.entries[:8]:  # Limit to top 8 per source for now
                    title = entry.get('title', '')
                    raw_summary = entry.get('summary', '')
                    clean_summary = clean_html(raw_summary)
                    
                    # Sometime summary is empty or too short. We fall back to title if needed
                    content = clean_summary if clean_summary else title
                    
                    published_at = entry.get('published', '')
                    source_url = entry.get('link', '')
                    
                    if title and content:
                        articles.append({
                            "title": title,
                            "source_domain": source_domain,
                            "source_url": source_url,
                            "content_summary": content,
                            "category": category,
                            "published_at": published_at
                        })
            except Exception as e:
                print(f"Error fetching from {source_domain}: {e}")
            
    return articles

if __name__ == "__main__":
    # Test fetch functionality locally
    data = fetch_articles()
    print(f"Fetched {len(data)} articles. Example:")
    if data:
        print(data[0])
