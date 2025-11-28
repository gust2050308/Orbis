import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/Supabase/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null;

    // Verificar que tenemos los parámetros necesarios
    if (!token_hash || type !== 'recovery') {
        const errorUrl = new URL('/Views/auth', request.url);
        errorUrl.searchParams.set('error', 'invalid_link');
        errorUrl.searchParams.set('error_description', 'Link de recuperación inválido');
        return NextResponse.redirect(errorUrl);
    }

    const supabase = await createClient();

    try {
        // Verificar el OTP token
        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        });

        if (error) {
            console.error('Error verifying OTP:', error);

            // Redirigir con mensaje de error específico
            const errorUrl = new URL('/Views/auth', request.url);

            if (error.message.includes('expired')) {
                errorUrl.searchParams.set('error', 'link_expired');
                errorUrl.searchParams.set('error_description', 'El link ha expirado. Solicita uno nuevo.');
            } else if (error.message.includes('invalid')) {
                errorUrl.searchParams.set('error', 'invalid_link');
                errorUrl.searchParams.set('error_description', 'Link inválido o ya usado.');
            } else {
                errorUrl.searchParams.set('error', 'verification_failed');
                errorUrl.searchParams.set('error_description', error.message);
            }

            return NextResponse.redirect(errorUrl);
        }

        // Si la verificación fue exitosa, redirigir a la página de reset
        // El usuario ya está autenticado temporalmente después de verifyOtp
        return NextResponse.redirect(new URL('/Views/reset-password', request.url));

    } catch (err) {
        console.error('Error en reset password callback:', err);
        const errorUrl = new URL('/Views/auth', request.url);
        errorUrl.searchParams.set('error', 'server_error');
        errorUrl.searchParams.set('error_description', 'Error del servidor. Intenta de nuevo.');
        return NextResponse.redirect(errorUrl);
    }
}
