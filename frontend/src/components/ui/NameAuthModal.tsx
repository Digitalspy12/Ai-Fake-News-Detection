'use client';

import React, { useState, useEffect } from 'react';

interface NameAuthModalProps {
    onAuthenticated: (name: string) => void;
}

export default function NameAuthModal({ onAuthenticated }: NameAuthModalProps) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) {
            setError('Please enter your name to continue.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: trimmedName }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.error || 'Something went wrong. Try again.');
                setLoading(false);
                return;
            }

            // Store in localStorage
            localStorage.setItem('ai_news_user', trimmedName);
            onAuthenticated(trimmedName);
        } catch {
            setError('Network error. Please try again.');
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center auth-overlay">
            {/* Animated grid background */}
            <div className="absolute inset-0 auth-grid-bg" />

            {/* Floating orbs */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full orb-blue" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full orb-violet" />

            {/* Modal Card */}
            <div className="relative z-10 w-full max-w-md mx-4 auth-card">
                {/* AI Icon */}
                <div className="flex justify-center mb-6">
                    <div className="ai-icon-ring">
                        <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4" />
                        </svg>
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-extrabold text-center text-white mb-1 tracking-tight">
                    AI News Aggregator
                </h1>
                <p className="text-center text-cyan-300/70 text-sm mb-8">
                    Enter your name to access the intelligence feed
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError(''); }}
                            placeholder="Your name..."
                            autoFocus
                            maxLength={60}
                            className="auth-input"
                            disabled={loading}
                        />
                        {/* Decorative scan line on focus */}
                        <div className="auth-input-line" />
                    </div>

                    {error && (
                        <p className="text-red-400 text-xs text-center animate-pulse">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !name.trim()}
                        className="auth-btn"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Authenticating...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                Enter
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </span>
                        )}
                    </button>
                </form>

                <p className="text-center text-white/20 text-xs mt-6">
                    No password required · Verified by AI
                </p>
            </div>
        </div>
    );
}
