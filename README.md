# AI News Aggregator

An intelligent, full-stack application that curates real-time news from multiple global sources, applies Natural Language Processing to detect fake news and assess sentiment, and visualizes insights on a responsive Next.js dashboard.

## 🌟 Features

- **Automated Data Pipeline**: A robust Python background scheduler fetches real-time articles every 30 minutes from trusted RSS feeds (BBC, CNN, Al Jazeera, etc.).
- **Local AI Processing**: Uses Hugging Face Transformers (`mrm8488/bert-tiny-finetuned-fake-news-detection`) running locally on CPU.
- **Sentiment & Fake News Detection**: Evaluates truthfulness and classifies text as Positive, Negative, or Neutral. 
- **Analytics Dashboard**: Next.js frontend integrated with Recharts provides a clear split of "Verified" vs "Suspicious" articles and macro-level sentiment breakdowns.
- **Modular & Component-Driven architecture**: Clear separation of React UI (Frontend) and FastAPI Python Services (Backend).

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS, Recharts, Vitest
- **Backend**: FastAPI, `apscheduler`, Uvicorn, Pytest
- **AI / ML**: Hugging Face `transformers`, PyTorch (`bert-tiny`)
- **Database**: Supabase (PostgreSQL)

---

## 🚀 Quick Setup Guide

### 1. Database Setup (Supabase)

1. Create a free account at [Supabase](https://supabase.com).
2. Create a new project. 
3. Run the following SQL in the Supabase SQL Editor to set up your tables:

```sql
CREATE TABLE articles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  source_domain text,
  content_summary text,
  sentiment text, -- 'positive', 'negative', 'neutral'
  is_fake boolean,
  credibility_score real,
  published_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Optional trigger for updating `created_at` or enforcing unique rules on URLs
```

4. Go to **Project Settings -> API** to get your `URL` and `anon key`.

### 2. Backend Setup (FastAPI & Python AI)

You need Python 3.9+ installed.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   
   # For Windows:
   .\venv\Scripts\activate
   # For MacOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure your environment variables. Open `.env` (or create one) in the `backend` directory:
   ```env
   SUPABASE_URL=your_project_url
   SUPABASE_KEY=your_anon_key
   ```
5. Run the Data Pipeline (Scheduler) to fetch initial articles:
   ```bash
   python services/scheduler.py
   ```
   *(Wait a few moments as it fetches RSS feeds and runs the AI models locally to save to Supabase).*
6. Start the FastAPI Server:
   ```bash
   uvicorn main:app --reload
   ```
   *(Backend will now run on `http://localhost:8000`)*

### 3. Frontend Setup (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Edit the `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *(Frontend will now run on `http://localhost:3000`)*

---

## 🧪 Testing

### Backend (pytest)
```bash
cd backend
.\venv\Scripts\activate
pytest tests/test_api.py -v
```

### Frontend (vitest)
```bash
cd frontend
npm run test
```

## Architecture Details
*   **RSS Fetcher**: Found in `backend/services/rss_fetcher.py`. Fetches standard generic news snippets from free global feeds.
*   **AI Service**: Found in `backend/services/ai_service.py`. Loads pipelines dynamically into RAM upon server initialization.
*   **Next.js Feed**: Rendered statically on the server (`page.tsx`) mapping cached data to reduce DB load, re-fetched seamlessly.

## License
MIT
