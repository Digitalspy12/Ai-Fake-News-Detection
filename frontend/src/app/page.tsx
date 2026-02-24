import React, { Suspense } from 'react';
import DashboardAnalytics from '@/components/dashboard/DashboardAnalytics';
import SearchAndFilter from '@/components/ui/SearchAndFilter';
import InfiniteFeed from '@/components/ui/InfiniteFeed';
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

export const dynamic = 'force-dynamic';

export default async function Home(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {

  const searchParams = await props.searchParams || {};
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';
  const category = typeof searchParams.category === 'string' ? searchParams.category : '';

  // Fetch from supabase 
  // In a robust application we would use the Next.js API route or RLS 
  // For now using the simple browser client server-side works as a read-only fetch

  let supabaseQuery = supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (query) {
    // Search in title or content
    supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,content_summary.ilike.%${query}%`);
  }

  if (category && category.toLowerCase() !== 'all') {
    supabaseQuery = supabaseQuery.eq('category', category.toLowerCase());
  }

  const { data: articles, error } = await supabaseQuery;

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

        <Suspense fallback={<div className="h-20 mb-8 mt-[-3rem] z-20 relative bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>}>
          <SearchAndFilter />
        </Suspense>

        {/* Analytics Section */}
        {safeArticles.length > 0 && (
          <DashboardAnalytics data={analyticsData} />
        )}

        {/* Feed Section */}
        <div className="mt-8 relative z-20">
          {safeArticles.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium text-gray-600 mb-2">No articles found in database</h3>
              <p className="text-gray-400">Please run the Python backend pipeline to fetch news.</p>
            </div>
          ) : (
            <InfiniteFeed
              initialArticles={safeArticles}
              searchQuery={query}
              category={category}
            />
          )}
        </div>
      </div>
    </main>
  );
}
