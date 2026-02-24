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

    // Reset when filters change
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
            const params = new URLSearchParams({
                page: nextPage.toString(),
                limit: '50',
            });

            if (searchQuery) params.append('q', searchQuery);
            if (category && category !== 'All') params.append('category', category);

            const res = await fetch(`/api/articles?${params.toString()}`);
            const data = await res.json();

            if (data.articles) {
                if (data.articles.length < 50) {
                    setHasMore(false);
                }
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
            <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-medium text-gray-600 mb-2">No articles found</h3>
                <p className="text-gray-400">Try adjusting your search or category filters.</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 border-l-4 border-indigo-600 pl-4">Latest Feed</h2>
                <span className="text-sm font-medium bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                    {articles.length} Articles Loaded
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article: any) => (
                    <NewsCard
                        key={article.id}
                        title={article.title}
                        source_domain={article.source_domain || new URL(article.source_url || 'https://unknown.com').hostname || 'Unknown'}
                        summary={article.content_summary}
                        sentiment={article.sentiment || 'neutral'}
                        is_fake={article.is_fake || false}
                        credibility_score={article.credibility_score || 0.5}
                        ai_reasoning={article.ai_reasoning}
                        published_at={article.published_at}
                    />
                ))}
            </div>

            {hasMore && (
                <div className="mt-12 text-center">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Load Older News'}
                    </button>
                </div>
            )}

            {!hasMore && articles.length > 0 && (
                <div className="mt-12 text-center text-gray-400 text-sm">
                    You've reached the end of the feed.
                </div>
            )}
        </>
    );
}
