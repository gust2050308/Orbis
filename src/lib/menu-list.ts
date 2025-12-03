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
  roles?: ('admin' | 'customer' | 'employee' | 'guest')[];
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
    roles: ['admin'],
  },
  {
    title: "Destinos",
    href: "/Views/destinations",
    icon: MapPin,
    roles: ['admin'],
  },
  {
    title: "Excursiones",
    href: "/Views/Excursions",
    icon: Calendar,
  },
  {
    title: 'Mis viajes',
    href: '/Views/MyJourneys',
    icon: Send,
    roles: ['admin', 'customer'],
  }, {
    title: 'Compras',
    href: '/Views/Admin/Purchases',
    icon: FileText,
    roles: ['admin'],
  }, {
    title: 'Usuarios',
    href: '/Views/Admin/Users',
    icon: Users,
    roles: ['admin'],
  },{
    title: 'Pagina Principal',
    href: '/Views/landing',
    icon: LayoutDashboard,
    roles: ['customer' , 'guest'],
  }
];