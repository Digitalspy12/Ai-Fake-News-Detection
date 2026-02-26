import React, { Suspense } from 'react';
import DashboardAnalytics from '@/components/dashboard/DashboardAnalytics';
import SearchAndFilter from '@/components/ui/SearchAndFilter';
import InfiniteFeed from '@/components/ui/InfiniteFeed';
import { supabase } from '@/lib/supabase';

function calculateAnalytics(articles: any[]) {
  const stats = {
    sentiment: { positive: 0, neutral: 0, negative: 0 },
    credibility: { verified: 0, suspicious: 0 }
  };

  articles.forEach(a => {
    if (a.sentiment === 'positive') stats.sentiment.positive++;
    else if (a.sentiment === 'negative') stats.sentiment.negative++;
    else stats.sentiment.neutral++;

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

  let supabaseQuery = supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (query) {
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
    <main className="page-bg">
      {/* Ambient background orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-20 blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0891b2 0%, transparent 70%)' }} />
      <div className="absolute top-[20%] right-[-8%] w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6d28d9 0%, transparent 70%)' }} />
      <div className="absolute bottom-[10%] left-[30%] w-[350px] h-[350px] rounded-full opacity-10 blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #22d3ee 0%, transparent 70%)' }} />

      {/* Hero Header */}
      <div className="hero-gradient relative z-10 pb-20 pt-12">
        <div className="hero-grid" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-start justify-between">
            <div>
              {/* AI badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-semibold text-cyan-300 tracking-widest uppercase">
                  AI-Powered Live Feed
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                <span className="text-white">AI News</span>{' '}
                <span className="text-gradient-cyan">Aggregator</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
                Real-time global news curated, analyzed, and verified by AI.
                We filter the noise so you read the truth.
              </p>
            </div>

            {/* Stats chip */}
            <div className="hidden md:flex flex-col items-end gap-2">
              <div className="glass px-4 py-2 flex items-center gap-2 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-slate-300 font-medium">
                  {safeArticles.length} Live Articles
                </span>
              </div>
              <div className="glass px-4 py-2 flex items-center gap-2 rounded-xl">
                <span className="text-xs text-cyan-400">⚡ AI Classified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
        {/* Search floats up over hero */}
        <div className="mt-[-2.5rem] mb-8">
          <Suspense fallback={
            <div className="h-20 search-glass rounded-xl animate-pulse" />
          }>
            <SearchAndFilter />
          </Suspense>
        </div>

        {/* Analytics */}
        {safeArticles.length > 0 && (
          <DashboardAnalytics data={analyticsData} />
        )}

        {/* Feed */}
        <div className="mt-8">
          {safeArticles.length === 0 ? (
            <div className="glass p-12 text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                No articles in database
              </h3>
              <p className="text-slate-500">
                Run the Python backend pipeline to fetch and analyze news.
              </p>
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
