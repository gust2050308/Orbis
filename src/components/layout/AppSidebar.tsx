"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarNav } from "./SidebarNav";
import UserInfo from "@/modules/User/Views/UserInfo";
import { LogoutButton } from "@/components/LogoutButton";
import { useRouter } from "next/navigation";
import { useAuth } from "@/Core/CustomHooks/useAuth";
import { Button } from "@/components/ui/button";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {


  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <Sidebar className="" collapsible="icon" {...props}>
      {/* Header con logo */}
      <SidebarHeader className="border-b border-[#256EFF]/20">
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className='' width={24} height={24} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="m9.474 16l9.181 3.284a1.1 1.1 0 0 0 1.462-.887L21.99 4.239c.114-.862-.779-1.505-1.567-1.13L2.624 11.605c-.88.42-.814 1.69.106 2.017l2.44.868l1.33.467M13 17.26l-1.99 3.326c-.65.808-1.959.351-1.959-.683V17.24a2 2 0 0 1 .53-1.356l3.871-4.2"></path></svg>
          </div>
          <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-[#102542]">
              Orbis Travel
            </span>
            <span className="text-xs text-[#102542]/60">
              Gestión de Destinos
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Contenido principal */}
      <SidebarContent>
        <SidebarNav />
      </SidebarContent>

      {/* Footer con info de usuario */}
      <SidebarFooter className="border-t border-[#256EFF]/20 gap-2">
        <UserInfo />

        {isAuthenticated ? (
          <LogoutButton />
        ) : (
          <div className='w-full flex items-center justify-center'>
            <Button className="w-4/5" onClick={() => router.push('/Views/auth')}>Iniciar Sesión</Button>
          </div>
        )}


      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}