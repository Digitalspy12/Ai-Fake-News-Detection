'use client';

import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, TrendingDown, TrendingUp, Minus, X, ExternalLink } from 'lucide-react';

interface NewsCardProps {
    title: string;
    source_domain: string;
    source_url?: string;
    summary: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    is_fake: boolean;
    credibility_score: number;
    ai_reasoning?: string;
    published_at: string;
}

export default function NewsCard({
    title,
    source_domain,
    source_url,
    summary,
    sentiment,
    is_fake,
    credibility_score,
    ai_reasoning,
    published_at,
}: NewsCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Visual cues based on ML analysis
    const isSuspicious = is_fake || credibility_score < 0.6;

    const SentimentIcon =
        sentiment === 'positive' ? TrendingUp :
            sentiment === 'negative' ? TrendingDown : Minus;

    const sentimentColor =
        sentiment === 'positive' ? 'text-green-500' :
            sentiment === 'negative' ? 'text-red-500' : 'text-gray-400';

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className={`p-5 rounded-2xl shadow-lg border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col h-full ${isSuspicious ? 'bg-red-50/50 border-red-200' : 'bg-white/70 border-gray-100'}`}
            >
                <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{source_domain.replace('www.', '')}</span>

                    <div className="flex gap-2">
                        {/* Sentiment Badge */}
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-white shadow-sm ${sentimentColor}`}>
                            <SentimentIcon size={14} />
                        </div>

                        {/* Credibility Badge */}
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shadow-sm ${isSuspicious ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {isSuspicious ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                            <span className="hidden sm:inline">{isSuspicious ? 'Suspicious' : 'Verified'}</span>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{summary}</p>

                <div className="flex justify-between items-center text-xs text-gray-400 mt-auto pt-4 border-t border-gray-100/50">
                    <span>{new Date(published_at).toLocaleDateString()}</span>
                    <span className="font-medium text-indigo-500">Read Preview &rarr;</span>
                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}>
                    <div
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">
                                    {source_domain.replace('www.', '')}
                                </span>
                                <span className="text-sm text-gray-400">{new Date(published_at).toLocaleDateString()}</span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 leading-tight">
                                {title}
                            </h2>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className={`p-4 rounded-2xl border ${isSuspicious ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'} flex flex-col items-center justify-center text-center`}>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">AI Credibility</span>
                                    <div className={`flex items-center gap-2 font-bold text-lg ${isSuspicious ? 'text-red-700' : 'text-green-700'}`}>
                                        {isSuspicious ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
                                        {(credibility_score * 100).toFixed(0)}% Score
                                    </div>
                                    <span className={`text-xs mt-1 ${isSuspicious ? 'text-red-500' : 'text-green-600'}`}>
                                        {isSuspicious ? 'Likely Fake or Biased' : 'Highly Verified'}
                                    </span>
                                </div>
                                <div className="p-4 rounded-2xl border bg-gray-50 border-gray-100 flex flex-col items-center justify-center text-center">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tone Analysis</span>
                                    <div className={`flex items-center gap-2 font-bold text-lg capitalize ${sentimentColor}`}>
                                        <SentimentIcon size={20} />
                                        {sentiment}
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-indigo max-w-none mb-8">
                                <p className="text-gray-700 text-lg leading-relaxed">{summary}</p>
                            </div>

                            {ai_reasoning && (
                                <div className="mb-8 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-indigo-900 mb-2">
                                        <SparklesIcon /> AI Logic Reasoning
                                    </h4>
                                    <p className="text-indigo-800/80 text-sm leading-relaxed">
                                        {ai_reasoning}
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 font-medium text-gray-500 hover:text-gray-800 transition-colors w-full sm:w-auto"
                                >
                                    Close Preview
                                </button>

                                {source_url ? (
                                    <a
                                        href={source_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-md shadow-indigo-200 active:scale-95"
                                    >
                                        Read Full Story <ExternalLink size={18} />
                                    </a>
                                ) : (
                                    <span className="text-sm text-gray-400 italic flexitems-center justify-center py-3">Source URL unavailable</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// Simple spark icon for UI
function SparklesIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-indigo-500">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4M3 5h4" />
        </svg>
    );
}
