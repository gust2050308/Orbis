"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/Supabase/supabaseClient";
import { toast } from "sonner";

export function useLogin() {
  const router = useRouter();
  const supabase = createClient();

  // --- LOGIN NORMAL ---
  const Login = async (formData: FormData) => {
    try {
      const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      const { error } = await supabase.auth.signInWithPassword(data);

      if (error) {
        console.error(error);
        toast.error("Credenciales incorrectas");
        router.push("/error");
        return;
      }

      toast.success("Inicio de sesión exitoso");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.error("Error inesperado al iniciar sesión");
    }
  };

  // --- LOGIN CON GOOGLE ---
  const LoginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          redirectTo: `${window.location.origin}/auth/confirm`, // Redirige al callback de tu app
        },
      });

      if (error) {
        console.error(error);
        toast.error("Error al iniciar sesión con Google");
        router.push("/error");
        return;
      }

      // Redirige al URL devuelto por Supabase (flujo OAuth)
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error en login con Google:", error);
      toast.error("Error inesperado al iniciar con Google");
    }
  };

  return { Login, LoginWithGoogle };
}
