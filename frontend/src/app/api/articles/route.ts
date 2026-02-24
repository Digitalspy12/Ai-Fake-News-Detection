import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';

    const offset = (page - 1) * limit;

    let supabaseQuery = supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (query) {
        supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,content_summary.ilike.%${query}%`);
    }

    if (category && category.toLowerCase() !== 'all') {
        supabaseQuery = supabaseQuery.eq('category', category.toLowerCase());
    }

    const { data, error } = await supabaseQuery;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ articles: data });
}
