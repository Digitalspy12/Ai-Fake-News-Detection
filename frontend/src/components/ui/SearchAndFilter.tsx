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

    // Sync state with URL params
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 mt-[-3rem] relative z-20">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">

                {/* Category Filters */}
                <div className="flex overflow-x-auto w-full md:w-auto space-x-2 pb-2 md:pb-0 hide-scrollbar">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryClick(cat)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory.toLowerCase() === cat.toLowerCase()
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
                    <input
                        type="text"
                        placeholder="Search news..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm text-gray-700"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors p-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>
                </form>

            </div>
        </div>
    );
}
