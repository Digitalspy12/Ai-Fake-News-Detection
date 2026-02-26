'use client';

import React, { useState, useEffect } from 'react';
import NameAuthModal from '@/components/ui/NameAuthModal';

interface ClientLayoutProps {
    children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const [user, setUser] = useState<string | null>(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('ai_news_user');
        if (stored) {
            setUser(stored);
        }
        setChecked(true);
    }, []);

    const handleAuthenticated = (name: string) => {
        setUser(name);
    };

    // Don't render anything until we've checked localStorage (prevents flash)
    if (!checked) {
        return (
            <div className="min-h-screen bg-[#060d1f] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
            {/* Show modal if user not authenticated */}
            {!user && (
                <NameAuthModal onAuthenticated={handleAuthenticated} />
            )}

            {/* Always render children but blur them when modal is active */}
            <div className={!user ? 'pointer-events-none select-none blur-sm opacity-30' : ''}>
                {/* Pass user context via data attribute for header to read */}
                <div data-user={user || ''}>
                    {children}
                </div>
            </div>
        </>
    );
}
