"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = ["All", "General", "Politics", "Business", "Technology", "Sports"];

export default function SearchAndFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialQuery = searchParams.get('q') || '';
    const initialCategory = searchParams.get('category') || 'All';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [activeCategory, setActiveCategory] = useState(initialCategory);

    useEffect(() => {
        setSearchQuery(searchParams.get('q') || '');
        setActiveCategory(searchParams.get('category') || 'All');
    }, [searchParams]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUrlParams(searchQuery, activeCategory);
    };

    const handleCategoryClick = (category: string) => {
        setActiveCategory(category);
        updateUrlParams(searchQuery, category);
    };

    const updateUrlParams = (q: string, category: string) => {
        const params = new URLSearchParams();
        if (q.trim()) params.set('q', q.trim());
        if (category && category !== 'All') params.set('category', category.toLowerCase());
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="search-glass p-4 sm:p-5">
            <div className="flex flex-col md:flex-row gap-4 items-center">

                {/* Category Pills */}
                <div className="flex overflow-x-auto w-full md:w-auto gap-2 pb-1 md:pb-0 hide-scrollbar">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryClick(cat)}
                            className={`category-pill ${activeCategory.toLowerCase() === cat.toLowerCase()
                                    ? 'category-pill-active'
                                    : 'category-pill-inactive'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative flex-shrink-0">
                    <input
                        type="text"
                        placeholder="Search news..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-cyan)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>
                </form>

            </div>
        </div>
    );
}
