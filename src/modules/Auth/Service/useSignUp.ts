"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/Supabase/supabaseClient";
import { toast } from "sonner";
import { SignUpFormType } from "../Types/FormTypes";

export function useSignUp() {
  const router = useRouter();
  const supabase = createClient();

  // --- REGISTRO NORMAL ---
  const SignUp = async (formData: FormData) => {
    try {
      const firstName = formData.get("first-name") as string;
      const lastName = formData.get("last-name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
            email,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        console.error(error);
        toast.error(error.message);
        router.push("/error");
        return;
      }

      toast.success("¡Cuenta creada! Revisa tu correo para confirmar.");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error al registrarse:", error);
      toast.error("Error inesperado al crear cuenta");
    }
  };

  // --- REGISTRO CON GOOGLE ---
  const SignUpWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/confirm`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error(error);
        toast.error("Error al registrarse con Google");
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error en registro con Google:", error);
      toast.error("Error inesperado al registrarse con Google");
    }
  };

  return { SignUp, SignUpWithGoogle };
}
