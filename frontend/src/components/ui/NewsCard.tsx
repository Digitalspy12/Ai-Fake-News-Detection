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

    const isSuspicious = is_fake || credibility_score < 0.6;

    const SentimentIcon =
        sentiment === 'positive' ? TrendingUp :
            sentiment === 'negative' ? TrendingDown : Minus;

    const sentimentColor =
        sentiment === 'positive' ? '#22d3ee' :
            sentiment === 'negative' ? '#f472b6' : '#94a3b8';

    const credScore = (credibility_score * 100).toFixed(0);

    return (
        <>
            {/* Card */}
            <div
                onClick={() => setIsModalOpen(true)}
                className={`news-card p-5 ${isSuspicious ? 'news-card-suspicious' : ''}`}
            >
                {/* Top Row */}
                <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--accent-cyan)', opacity: 0.7 }}>
                        {source_domain.replace('www.', '')}
                    </span>
                    <div className="flex gap-1.5">
                        {/* Sentiment badge */}
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{
                                background: `${sentimentColor}15`,
                                border: `1px solid ${sentimentColor}30`,
                                color: sentimentColor
                            }}>
                            <SentimentIcon size={11} />
                            <span className="hidden sm:inline capitalize">{sentiment}</span>
                        </div>
                        {/* Credibility badge */}
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={isSuspicious
                                ? { background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: '#f87171' }
                                : { background: 'rgba(34,211,238,0.10)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee' }
                            }>
                            {isSuspicious ? <ShieldAlert size={11} /> : <ShieldCheck size={11} />}
                            <span className="hidden sm:inline">{isSuspicious ? 'Fake' : 'Real'}</span>
                        </div>
                    </div>
                </div>

                <h3 className="text-base font-bold text-slate-100 mb-2 line-clamp-2 leading-snug">{title}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">{summary}</p>

                {/* Score bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">AI Credibility</span>
                        <span className="font-semibold" style={{ color: isSuspicious ? '#f87171' : '#22d3ee' }}>{credScore}%</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div
                            className="h-full rounded-full transition-all"
                            style={{
                                width: `${credScore}%`,
                                background: isSuspicious
                                    ? 'linear-gradient(90deg, #f43f5e, #fb923c)'
                                    : 'linear-gradient(90deg, #0891b2, #22d3ee)'
                            }}
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center text-xs mt-auto pt-3"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <span className="text-slate-600">{new Date(published_at).toLocaleDateString()}</span>
                    <span className="font-medium" style={{ color: 'var(--accent-cyan)' }}>
                        Preview →
                    </span>
                </div>
            </div>

            {/* Detail Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                    style={{ background: 'rgba(3,7,18,0.85)', backdropFilter: 'blur(12px)' }}
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
                        style={{
                            background: 'rgba(10,20,45,0.97)',
                            border: '1px solid rgba(34,211,238,0.18)',
                            borderRadius: '1.25rem',
                            boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(34,211,238,0.05)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all"
                            style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(244,63,94,0.15)'; (e.currentTarget as HTMLElement).style.color = '#f87171'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
                        >
                            <X size={18} />
                        </button>

                        <div className="p-6 sm:p-8">
                            {/* Source & date */}
                            <div className="flex items-center gap-3 mb-5">
                                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                                    style={{ background: 'rgba(34,211,238,0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(34,211,238,0.2)' }}>
                                    {source_domain.replace('www.', '')}
                                </span>
                                <span className="text-xs text-slate-500">
                                    {new Date(published_at).toLocaleDateString()}
                                </span>
                            </div>

                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 mb-6 leading-snug">
                                {title}
                            </h2>

                            {/* Score grid */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {/* Credibility */}
                                <div className="p-4 rounded-xl flex flex-col items-center text-center"
                                    style={isSuspicious
                                        ? { background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }
                                        : { background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.2)' }
                                    }>
                                    <span className="text-xs text-slate-500 uppercase tracking-widest mb-2">AI Credibility</span>
                                    <div className="flex items-center gap-1.5 font-bold text-lg"
                                        style={{ color: isSuspicious ? '#f87171' : '#22d3ee' }}>
                                        {isSuspicious ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
                                        {credScore}%
                                    </div>
                                    <span className="text-xs mt-1" style={{ color: isSuspicious ? '#f87171' : '#22d3ee' }}>
                                        {isSuspicious ? 'Likely Fake' : 'Verified'}
                                    </span>
                                </div>
                                {/* Sentiment */}
                                <div className="p-4 rounded-xl flex flex-col items-center text-center"
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <span className="text-xs text-slate-500 uppercase tracking-widest mb-2">Tone</span>
                                    <div className="flex items-center gap-1.5 font-bold text-lg capitalize"
                                        style={{ color: sentimentColor }}>
                                        <SentimentIcon size={18} />
                                        {sentiment}
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="mb-6">
                                <p className="text-slate-300 leading-relaxed">{summary}</p>
                            </div>

                            {/* AI reasoning */}
                            {ai_reasoning && (
                                <div className="mb-6 p-4 rounded-xl"
                                    style={{ background: 'rgba(109,40,217,0.08)', border: '1px solid rgba(109,40,217,0.2)' }}>
                                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2"
                                        style={{ color: 'var(--accent-violet)' }}>
                                        <SparklesIcon />
                                        AI Logic & Reasoning
                                    </h4>
                                    <p className="text-slate-300 text-sm leading-relaxed">{ai_reasoning}</p>
                                </div>
                            )}

                            {/* Footer actions */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-5"
                                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                                    style={{ color: '#64748b' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
                                    onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                                >
                                    ← Close
                                </button>

                                {source_url ? (
                                    <a
                                        href={source_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all w-full sm:w-auto"
                                        style={{ background: 'linear-gradient(135deg, #0891b2, #6d28d9)' }}
                                        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(8,145,178,0.3)')}
                                        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                                    >
                                        Read Full Story <ExternalLink size={16} />
                                    </a>
                                ) : (
                                    <span className="text-sm text-slate-600 italic">Source unavailable</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function SparklesIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4M3 5h4" />
        </svg>
    );
}
