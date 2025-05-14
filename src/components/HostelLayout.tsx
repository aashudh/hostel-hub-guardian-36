
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { HostelSidebar } from "./HostelSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function HostelLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <HostelSidebar />
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto p-4 md:p-6">
                <div className="flex items-center mb-6">
                  <SidebarTrigger className="bg-transparent hover:bg-transparent mr-2">
                    <Button variant="outline" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SidebarTrigger>
                  <h1 className="text-2xl font-bold text-hostel-dark">Hostel Management System</h1>
                </div>
                <Outlet />
              </div>
            </main>
          </div>
        </SidebarProvider>
      ) : (
        <Outlet />
      )}
    </>
  );
}
