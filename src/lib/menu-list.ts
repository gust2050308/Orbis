import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  Settings,
  Users,
  FileText
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
    badge: "Nuevo",
  },
  {
    title: "Excursiones",
    href: "/modules/Excursions",
    icon: Calendar,
    subItems: [
      {
        title: "Ver todas",
        href: "/modules/Excursions/list",
      },
      {
        title: "Crear nueva",
        href: "/modules/Excursions/create",
      },
    ],
  },
  {
    title: "Usuarios",
    href: "/modules/Auth",
    icon: Users,
  },
  {
    title: "Documentos",
    href: "/documents",
    icon: FileText,
  },
  {
    title: "Configuración",
    href: "/settings",
    icon: Settings,
  },
];