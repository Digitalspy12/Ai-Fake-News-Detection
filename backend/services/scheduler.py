import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from services.rss_fetcher import fetch_articles
from services.db_service import store_articles_in_db
import logging
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fetch_and_store_job():
    logger.info("Starting background fetching job...")
    articles = fetch_articles()
    if articles:
        store_articles_in_db(articles)
    logger.info("Background fetching job completed.")

def start_scheduler():
    scheduler = BackgroundScheduler()
    # Run every 30 minutes
    scheduler.add_job(
        fetch_and_store_job,
        trigger=IntervalTrigger(minutes=30),
        id='fetch_rss_job',
        name='Fetch RSS feeds every 30 mins',
        replace_existing=True
    )
    scheduler.start()
    logger.info("Scheduler started.")
    return scheduler

if __name__ == "__main__":
    # For testing standalone
    scheduler = start_scheduler()
    fetch_and_store_job() # Run once immediately
    try:
        while True:
            time.sleep(2)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
