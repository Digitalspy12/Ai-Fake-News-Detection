"use client";

import React, { useState, useEffect } from 'react';
import NewsCard from '@/components/ui/NewsCard';

interface InfiniteFeedProps {
    initialArticles: any[];
    searchQuery?: string;
    category?: string;
}

export default function InfiniteFeed({ initialArticles, searchQuery = '', category = 'All' }: InfiniteFeedProps) {
    const [articles, setArticles] = useState(initialArticles);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialArticles.length === 50);

    useEffect(() => {
        setArticles(initialArticles);
        setPage(1);
        setHasMore(initialArticles.length === 50);
    }, [initialArticles, searchQuery, category]);

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const nextPage = page + 1;

        try {
            const params = new URLSearchParams({ page: nextPage.toString(), limit: '50' });
            if (searchQuery) params.append('q', searchQuery);
            if (category && category !== 'All') params.append('category', category);

            const res = await fetch(`/api/articles?${params.toString()}`);
            const data = await res.json();

            if (data.articles) {
                if (data.articles.length < 50) setHasMore(false);
                setArticles(prev => [...prev, ...data.articles]);
                setPage(nextPage);
            }
        } catch (error) {
            console.error("Error loading more articles:", error);
        } finally {
            setLoading(false);
        }
    };

    if (articles.length === 0) {
        return (
            <div className="glass p-12 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-semibold text-slate-300 mb-1">No articles found</h3>
                <p className="text-slate-500 text-sm">Try adjusting your search or category filters.</p>
            </div>
        );
    }

    return (
        <>
            {/* Header row */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-200 flex items-center gap-3">
                    <span className="w-1 h-5 rounded-full inline-block"
                        style={{ background: 'linear-gradient(180deg, #22d3ee, #6d28d9)' }} />
                    Latest Intelligence Feed
                </h2>
                <span className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: 'rgba(34,211,238,0.08)', color: 'var(--accent-cyan)', border: '1px solid rgba(34,211,238,0.2)' }}>
                    {articles.length} loaded
                </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {articles.map((article: any) => (
                    <NewsCard
                        key={article.id}
                        title={article.title}
                        source_domain={article.source_domain || new URL(article.source_url || 'https://unknown.com').hostname || 'Unknown'}
                        source_url={article.source_url}
                        summary={article.content_summary}
                        sentiment={article.sentiment || 'neutral'}
                        is_fake={article.is_fake || false}
                        credibility_score={article.credibility_score || 0.5}
                        ai_reasoning={article.ai_reasoning}
                        published_at={article.published_at}
                    />
                ))}
            </div>

            {/* Load more */}
            {hasMore && (
                <div className="mt-10 text-center">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold transition-all disabled:opacity-40"
                        style={{
                            background: 'rgba(34,211,238,0.08)',
                            border: '1px solid rgba(34,211,238,0.2)',
                            color: 'var(--accent-cyan)'
                        }}
                        onMouseEnter={e => {
                            if (!loading) {
                                (e.currentTarget as HTMLElement).style.background = 'rgba(34,211,238,0.14)';
                                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(34,211,238,0.15)';
                            }
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(34,211,238,0.08)';
                            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                        }}
                    >
                        {loading ? (
                            <>
                                <span className="w-3.5 h-3.5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                                Fetching...
                            </>
                        ) : (
                            <>↓ Load Older News</>
                        )}
                    </button>
                </div>
            )}

            {!hasMore && articles.length > 0 && (
                <div className="mt-10 text-center text-slate-600 text-sm">
                    — End of feed —
                </div>
            )}
        </>
    );
}
