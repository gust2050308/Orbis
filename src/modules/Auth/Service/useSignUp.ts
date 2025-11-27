"use client";

import { useAuth } from "@/Core/CustomHooks/useAuth";

export function useSignUp() {
  const { signUp, signInWithGoogle } = useAuth();

  // --- REGISTRO NORMAL ---
  const SignUp = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // El AuthContext maneja el toast, router.push y errores automáticamente
    await signUp(email, password, { full_name: name });
  };

  // --- REGISTRO CON GOOGLE ---
  const SignUpWithGoogle = async () => {
    // Mismo método que login con Google (OAuth no distingue entre login/signup)
    await signInWithGoogle();
  };

  return { SignUp, SignUpWithGoogle };
}
