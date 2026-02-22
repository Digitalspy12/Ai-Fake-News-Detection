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

const COLORS = ['#22c55e', '#ef4444', '#94a3b8']; // Green, Red, Gray

export default function DashboardAnalytics({ data }: { data: AnalyticsData }) {

    const sentimentData = [
        { name: 'Positive', value: data.sentiment.positive },
        { name: 'Negative', value: data.sentiment.negative },
        { name: 'Neutral', value: data.sentiment.neutral },
    ];

    const credibilityData = [
        { name: 'Verified', Suspicious: data.credibility.suspicious, Verified: data.credibility.verified }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
            {/* Sentiment Overview */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Overall Sentiment</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={sentimentData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {sentimentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 text-sm mt-2">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div> Positive</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Negative</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gray-400"></div> Neutral</div>
                </div>
            </div>

            {/* Credibility Overview */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Real vs Fake News Breakdown</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={credibilityData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip cursor={{ fill: '#f8fafc' }} />
                            <Bar dataKey="Verified" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Suspicious" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
