import React from 'react';
import { ShieldAlert, ShieldCheck, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface NewsCardProps {
    title: string;
    source_domain: string;
    summary: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    is_fake: boolean;
    credibility_score: number;
    published_at: string;
}

export default function NewsCard({
    title,
    source_domain,
    summary,
    sentiment,
    is_fake,
    credibility_score,
    published_at,
}: NewsCardProps) {

    // Visual cues based on ML analysis
    const isSuspicious = is_fake || credibility_score < 0.6;

    const SentimentIcon =
        sentiment === 'positive' ? TrendingUp :
            sentiment === 'negative' ? TrendingDown : Minus;

    const sentimentColor =
        sentiment === 'positive' ? 'text-green-500' :
            sentiment === 'negative' ? 'text-red-500' : 'text-gray-400';

    return (
        <div className={`p-5 rounded-2xl shadow-lg border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${isSuspicious ? 'bg-red-50/50 border-red-200' : 'bg-white/70 border-gray-100'}`}>

            <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{source_domain}</span>

                <div className="flex gap-2">
                    {/* Sentiment Badge */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-white shadow-sm ${sentimentColor}`}>
                        <SentimentIcon size={14} />
                        <span className="capitalize">{sentiment}</span>
                    </div>

                    {/* Credibility Badge */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shadow-sm ${isSuspicious ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {isSuspicious ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                        <span>{isSuspicious ? 'Suspicious' : 'Verified'}</span>
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{summary}</p>

            <div className="flex justify-between items-center text-xs text-gray-400">
                <span>{new Date(published_at).toLocaleDateString()}</span>
                <span className="font-mono">Credibility Score: {(credibility_score * 100).toFixed(0)}%</span>
            </div>
        </div>
    );
}
