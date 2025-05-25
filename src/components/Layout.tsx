
import { Outlet } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Home, Package, ArrowRight, Users, Archive, Settings } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import UserNav from "./UserNav";
import RoleBasedControl from "./auth/RoleBasedControl";
import { useAuth } from "@/contexts/AuthContext";

export default function Layout() {
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const linkClasses = "flex items-center gap-2 py-2 px-4 w-full hover:bg-accent/50 rounded-md transition-colors";
  const activeLinkClasses = "bg-accent";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-military-navy flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-white"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-bold text-lg text-military-navy">Asset Manager</span>
            </div>
            {user && (
              <div className="mt-2 text-xs text-muted-foreground">
                {user.role === 'baseCommander' || user.role === 'logisticsOfficer' 
                  ? 'Base: ' + user.baseId 
                  : 'Access: All Bases'}
              </div>
            )}
          </SidebarHeader>
          <SidebarContent>
            <nav className="px-2 py-4">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        cn(linkClasses, isActive && activeLinkClasses)
                      }
                    >
                      <Home className="h-5 w-5" />
                      <span>Dashboard</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/inventory"
                      className={({ isActive }) =>
                        cn(linkClasses, isActive && activeLinkClasses)
                      }
                    >
                      <Archive className="h-5 w-5" />
                      <span>Inventory</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/purchases"
                      className={({ isActive }) =>
                        cn(linkClasses, isActive && activeLinkClasses)
                      }
                    >
                      <Package className="h-5 w-5" />
                      <span>Purchases</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/transfers"
                      className={({ isActive }) =>
                        cn(linkClasses, isActive && activeLinkClasses)
                      }
                    >
                      <ArrowRight className="h-5 w-5" />
                      <span>Transfers</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/assignments"
                      className={({ isActive }) =>
                        cn(linkClasses, isActive && activeLinkClasses)
                      }
                    >
                      <Users className="h-5 w-5" />
                      <span>Assignments</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <RoleBasedControl allowedRoles={['admin']}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                          cn(linkClasses, isActive && activeLinkClasses)
                        }
                      >
                        <Settings className="h-5 w-5" />
                        <span>Admin Panel</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </RoleBasedControl>
              </SidebarMenu>
            </nav>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col min-h-screen">
          <header className="h-16 border-b flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2">
              {!isMobile && <SidebarTrigger />}
            </div>
            <UserNav />
          </header>
          <div className="flex-1 p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
