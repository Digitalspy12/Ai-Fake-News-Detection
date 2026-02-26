'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

interface AnalyticsData {
    sentiment: {
        positive: number;
        neutral: number;
        negative: number;
    };
    credibility: {
        verified: number;
        suspicious: number;
    };
}

const SENTIMENT_COLORS = ['#22d3ee', '#a78bfa', '#475569'];
const CRED_VERIFIED_COLOR = '#22d3ee';
const CRED_SUSPICIOUS_COLOR = '#f43f5e';

// Custom tooltip for dark bg
const DarkTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'rgba(10,20,45,0.95)',
                border: '1px solid rgba(34,211,238,0.2)',
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                color: '#e2e8f0'
            }}>
                {label && <p style={{ color: '#94a3b8', marginBottom: '4px' }}>{label}</p>}
                {payload.map((p: any, i: number) => (
                    <p key={i} style={{ color: p.fill || p.color }}>
                        {p.name}: <strong>{p.value}</strong>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function DashboardAnalytics({ data }: { data: AnalyticsData }) {
    const total = data.sentiment.positive + data.sentiment.neutral + data.sentiment.negative;
    const sentimentData = [
        { name: 'Positive', value: data.sentiment.positive },
        { name: 'Neutral', value: data.sentiment.neutral },
        { name: 'Negative', value: data.sentiment.negative },
    ];

    const credibilityData = [
        {
            name: 'Articles',
            Verified: data.credibility.verified,
            Suspicious: data.credibility.suspicious
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-8">
            {/* Sentiment Pie */}
            <div className="analytics-card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">
                        Sentiment Analysis
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: 'rgba(34,211,238,0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(34,211,238,0.2)' }}>
                        {total} Articles
                    </span>
                </div>
                <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={sentimentData}
                                cx="50%" cy="50%"
                                innerRadius={52}
                                outerRadius={75}
                                paddingAngle={4}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {sentimentData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip content={<DarkTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-5 mt-1">
                    {sentimentData.map((s, i) => (
                        <div key={s.name} className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: SENTIMENT_COLORS[i] }} />
                            <span className="text-xs text-slate-400">{s.name}</span>
                            <span className="text-xs font-bold" style={{ color: SENTIMENT_COLORS[i] }}>{s.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Credibility Bar */}
            <div className="analytics-card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">
                        Real vs Fake
                    </h3>
                    <div className="flex gap-3 text-xs">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: CRED_VERIFIED_COLOR }} />
                            <span className="text-slate-400">Verified</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: CRED_SUSPICIOUS_COLOR }} />
                            <span className="text-slate-400">Suspicious</span>
                        </span>
                    </div>
                </div>
                <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={credibilityData} barSize={40}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,211,238,0.06)" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(34,211,238,0.04)' }} />
                            <Bar dataKey="Verified" fill={CRED_VERIFIED_COLOR} radius={[6, 6, 0, 0]} />
                            <Bar dataKey="Suspicious" fill={CRED_SUSPICIOUS_COLOR} radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
