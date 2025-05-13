
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  Home,
  User,
  Calendar,
  FileText,
  LogOut,
  Settings,
  MessageSquare,
  Bell,
  AlarmClock,
  Bed,
  Shield,
  Clock,
  UserPlus
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function HostelSidebar() {
  const { user, logout, isWarden, isStudent } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Common menu items for both roles
  const commonMenuItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/"
    },
    {
      title: "Profile",
      icon: User,
      path: "/profile"
    },
    {
      title: "Complaints",
      icon: MessageSquare,
      path: "/complaints"
    },
    {
      title: "Emergency",
      icon: Bell,
      path: "/emergency"
    },
    {
      title: "Announcements",
      icon: Bell,
      path: "/announcements"
    }
  ];

  // Student specific menu items
  const studentMenuItems = [
    {
      title: "Outings",
      icon: Clock,
      path: "/outings"
    },
    {
      title: "Laundry",
      icon: AlarmClock,
      path: "/laundry"
    }
  ];

  // Warden specific menu items
  const wardenMenuItems = [
    {
      title: "Room Allocation",
      icon: Bed,
      path: "/allocations"
    },
    {
      title: "Students",
      icon: UserPlus,
      path: "/students"
    },
    {
      title: "Reports",
      icon: FileText,
      path: "/reports"
    },
    {
      title: "Approvals",
      icon: Shield,
      path: "/approvals"
    }
  ];

  // Combine menu items based on role
  const menuItems = [
    ...commonMenuItems,
    ...(isStudent ? studentMenuItems : []),
    ...(isWarden ? wardenMenuItems : [])
  ];

  if (!user) return null;

  return (
    <Sidebar className={cn("transition-all duration-300", isMobile ? "w-16" : "w-64")}>
      <SidebarHeader className="px-4 py-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback className="bg-hostel-blue text-white">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!isMobile && (
            <div className="flex flex-col">
              <span className="font-medium text-white">{user.name}</span>
              <span className="text-xs text-gray-300 capitalize">{user.role}</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    location.pathname === item.path
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon size={20} />
                  {!isMobile && <span>{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="px-3 py-2">
        <Button 
          variant="ghost" 
          className="w-full flex items-center gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50 justify-start"
          onClick={logout}
        >
          <LogOut size={20} />
          {!isMobile && <span>Logout</span>}
        </Button>
        {!isMobile && (
          <div className="mt-4 px-3 py-2 text-xs text-sidebar-foreground/60 text-center">
            Hostel Management System<br />v1.0.0
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
