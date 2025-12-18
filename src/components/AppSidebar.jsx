import React from "react";
import { useLocation } from "react-router";
import { Home, Inbox, Calendar, Search, Settings,LayoutDashboard,TriangleAlert,ChartSpline } from "lucide-react";

import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const items = [
  
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Anomalies",
    url: "/anomalies",
    icon: TriangleAlert,
  },
  {
    title: "Analytics",
    url: "#",
    icon: ChartSpline,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-6 py-4">
          <a href="/" className="block">
            <h2 className="text-xl font-bold hover:text-blue-600 cursor-pointer transition-colors">Aleora</h2>
          </a>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="space-y-2 px-3">
          {items.map((item) => {
            const isActive =
              item.url === "/" ? location.pathname === "/" : location.pathname.startsWith(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a
                    href={item.url}
                    className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-colors ${
                      isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-700"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
                    <span className="text-base font-medium">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export { SidebarProvider, SidebarTrigger };