import { Outlet } from "react-router";
import {SidebarProvider,SidebarTrigger} from "../components/AppSidebar";
import {AppSidebar} from "../components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export default function DashboardLayout({ }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}