import {
  LayoutDashboard,
  MapPin,
  Calendar,
  Settings,
  Users,
  FileText,
  Send
} from "lucide-react";

export interface MenuItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  subItems?: SubMenuItem[];
}

export interface SubMenuItem {
  title: string;
  href: string;
}

export const menuList: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/Views/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Destinos",
    href: "/Views/destinations",
    icon: MapPin,
  },
  {
    title: "Excursiones",
    href: "/Views/Excursions",
    icon: Calendar,
  },
  {
    title: "Usuarios",
    href: "/modules/Auth",
    icon: Users,
  },
  {
    title: 'Mis viajes',
    href: '/Views/MyJourneys',
    icon: Send,
  }
];