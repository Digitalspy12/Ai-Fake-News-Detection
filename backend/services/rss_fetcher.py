import feedparser
from bs4 import BeautifulSoup
from typing import List, Dict

# Example free sources that provide RSS feeds
RSS_SOURCES = {
    "BBC": "http://feeds.bbci.co.uk/news/rss.xml",
    "CNN": "http://rss.cnn.com/rss/edition_world.rss",
    "AlJazeera": "http://www.aljazeera.com/xml/rss/all.xml",
    "Yahoo": "https://news.yahoo.com/rss/"
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
    
    for source_domain, feed_url in RSS_SOURCES.items():
        try:
            feed = feedparser.parse(feed_url)
            for entry in feed.entries[:10]:  # Limit to top 10 per source for now
                title = entry.get('title', '')
                raw_summary = entry.get('summary', '')
                clean_summary = clean_html(raw_summary)
                
                # Sometime summary is empty or too short. We fall back to title if needed
                content = clean_summary if clean_summary else title
                
                published_at = entry.get('published', '')
                
                if title and content:
                    articles.append({
                        "title": title,
                        "source_domain": source_domain,
                        "content_summary": content,
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
