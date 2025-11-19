"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
    Collapsible,
    CollapsibleContent, 
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { menuList, MenuItem } from "@/lib/menu-list";

export function SidebarNav() {
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {menuList.map((item) => {
                        const isActive = pathname === item.href ||
                            pathname.startsWith(item.href);

                        // Menu con subítems
                        if (item.subItems && item.subItems.length > 0) {
                            return (
                                <Collapsible
                                    key={item.title}
                                    defaultOpen={isActive}
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title}>
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                                {item.badge && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="ml-auto bg-[#07BEB8] text-white"
                                                    >
                                                        {item.badge}
                                                    </Badge>
                                                )}
                                                <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.subItems.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton asChild>
                                                            <Link href={subItem.href}>
                                                                <span>{subItem.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            );
                        }

                        // Menu simple
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    isActive={isActive}
                                >
                                    <Link href={item.href}>
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                        {item.badge && (
                                            <Badge
                                                variant="secondary"
                                                className="ml-auto bg-[#07BEB8] text-white"
                                            >
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}