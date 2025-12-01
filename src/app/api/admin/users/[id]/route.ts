import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/Supabase/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const userId = params.id;

        // Check admin auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
        }

        // Fetch user
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // Get email
        const { data: authUser } = await supabase.auth.admin.getUserById(userId);

        const userWithEmail = {
            ...data,
            email: authUser?.user?.email || '',
        };

        return NextResponse.json({ user: userWithEmail });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const userId = params.id;

        // Check admin auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
        }

        const updates = await request.json();

        // Remove fields that should never be updated
        const { id, created_at, ...allowedUpdates } = updates;

        const { data, error } = await supabase
            .from('user_profiles')
            .update({
                ...allowedUpdates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
        }

        return NextResponse.json({ user: data });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
