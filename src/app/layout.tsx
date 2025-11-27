import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/Core/Context/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orbis - Gestión de Destinos",
  description: "Sistema de gestión de destinos turísticos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} `} >
        <Providers>
          <ConditionalLayout>
            {children}
            <Toaster />
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}