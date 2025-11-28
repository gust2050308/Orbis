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
import { UserInfo } from "@/modules/User/Views/UserInfo";
import { LogoutButton } from "@/components/LogoutButton";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header con logo */}
      <SidebarHeader className="border-b border-[#256EFF]/20">
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#256EFF]">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col gap-0.5">
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
        <LogoutButton />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}