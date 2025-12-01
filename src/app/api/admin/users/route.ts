import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/Supabase/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check admin auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        // Check admin role
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json(
                { error: 'No autorizado - Se requiere rol de administrador' },
                { status: 403 }
            );
        }

        // Fetch all users
        const { data: users, error } = await supabase
            .from('user_profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json(
                { error: 'Error al obtener usuarios' },
                { status: 500 }
            );
        }

        // Get emails from auth.users
        const usersWithEmails = await Promise.all(
            (users || []).map(async (userProfile) => {
                const { data: authUser } = await supabase.auth.admin.getUserById(userProfile.id);
                return {
                    ...userProfile,
                    email: authUser?.user?.email || '',
                };
            })
        );

        return NextResponse.json({ users: usersWithEmails });

    } catch (error) {
        console.error('Error in users API:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
