import React from 'react';
import NewsCard from '@/components/ui/NewsCard';
import DashboardAnalytics from '@/components/dashboard/DashboardAnalytics';
import { supabase } from '@/lib/supabase';

// Helper to deduce overall stats
function calculateAnalytics(articles: any[]) {
  const stats = {
    sentiment: { positive: 0, neutral: 0, negative: 0 },
    credibility: { verified: 0, suspicious: 0 }
  };

  articles.forEach(a => {
    // Sentiment
    if (a.sentiment === 'positive') stats.sentiment.positive++;
    else if (a.sentiment === 'negative') stats.sentiment.negative++;
    else stats.sentiment.neutral++;

    // Credibility
    if (a.is_fake || a.credibility_score < 0.6) stats.credibility.suspicious++;
    else stats.credibility.verified++;
  });

  return stats;
}

export const revalidate = 60; // Revalidate cache every minute

export default async function Home() {

  // Fetch from supabase 
  // In a robust application we would use the Next.js API route or RLS 
  // For now using the simple browser client server-side works as a read-only fetch
  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error("DB Fetch Error:", error.message);
  }

  const safeArticles = articles || [];
  const analyticsData = calculateAnalytics(safeArticles);

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden">

      {/* Premium aesthetic decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-blue-600 to-indigo-900 -skew-y-3 transform origin-top-left z-0 shadow-xl opacity-90"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10">

        <header className="mb-12 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-md font-sans">
            AI News Aggregator
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl font-medium">
            Real-time global news curated, analyzed, and verified by AI.
            We filter the noise so you read the truth.
          </p>
        </header>

        {/* Analytics Section */}
        {safeArticles.length > 0 && (
          <DashboardAnalytics data={analyticsData} />
        )}

        {/* Feed Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-l-4 border-indigo-600 pl-4">Latest Feed</h2>
            <span className="text-sm font-medium bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
              {safeArticles.length} Articles
            </span>
          </div>

          {safeArticles.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium text-gray-600 mb-2">No articles found in database</h3>
              <p className="text-gray-400">Please run the Python backend pipeline to fetch news.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {safeArticles.map((article: any) => (
                <NewsCard
                  key={article.id}
                  title={article.title}
                  source_domain={article.source_domain || new URL(article.source_url || 'https://unknown.com').hostname}
                  summary={article.content_summary}
                  sentiment={article.sentiment || 'neutral'}
                  is_fake={article.is_fake || false}
                  credibility_score={article.credibility_score || 0.5}
                  ai_reasoning={article.ai_reasoning}
                  published_at={article.published_at}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
