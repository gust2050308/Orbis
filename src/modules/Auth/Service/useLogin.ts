"use client";

import { useAuth } from "@/Core/CustomHooks/useAuth";

export function useLogin() {
  const { signIn, signInWithGoogle } = useAuth();

  // --- LOGIN NORMAL ---
  const Login = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // El AuthContext maneja el toast, router.push y errores automáticamente
    await signIn(email, password);
  };

  // --- LOGIN CON GOOGLE ---
  const LoginWithGoogle = async () => {
    // El AuthContext maneja la redirección y errores automáticamente
    await signInWithGoogle();
  };

  return { Login, LoginWithGoogle };
}
