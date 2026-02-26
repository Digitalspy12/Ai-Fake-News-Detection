import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * POST /api/auth/profile
 * 
 * Simple name-based auth. Checks if the given name already exists
 * in the `named_visitors` table. If not, inserts it.
 * 
 * Required Supabase table (run once in SQL Editor):
 * 
 *   CREATE TABLE IF NOT EXISTS named_visitors (
 *     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *     name TEXT UNIQUE NOT NULL,
 *     created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
 *   );
 *   ALTER TABLE named_visitors ENABLE ROW LEVEL SECURITY;
 *   CREATE POLICY "Allow public read" ON named_visitors FOR SELECT USING (true);
 *   CREATE POLICY "Allow public insert" ON named_visitors FOR INSERT WITH CHECK (true);
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name } = body;

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const cleanName = name.trim();

        // Check if visitor already exists
        const { data: existingUser, error: checkError } = await supabase
            .from('named_visitors')
            .select('id, name, created_at')
            .eq('name', cleanName)
            .maybeSingle();

        if (checkError) {
            console.error('DB check error:', checkError);
            return NextResponse.json({ error: 'Database error: ' + checkError.message }, { status: 500 });
        }

        if (existingUser) {
            // Already registered — just return them
            return NextResponse.json({ success: true, user: existingUser, isNew: false });
        }

        // New visitor — insert
        const { data: newUser, error: insertError } = await supabase
            .from('named_visitors')
            .insert({ name: cleanName })
            .select()
            .single();

        if (insertError) {
            console.error('DB insert error:', insertError);
            return NextResponse.json({ error: 'Failed to save user: ' + insertError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, user: newUser, isNew: true });
    } catch (err) {
        console.error('Auth profile route error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
