import { useState } from "react";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Image, 
  Calendar, 
  BarChart3, 
  Settings,
  Sparkles,
  Users,
  TrendingUp
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Criar Post", url: "/dashboard/create", icon: PlusCircle },
  { title: "Templates", url: "/dashboard/templates", icon: Image },
  { title: "Banco de Templates", url: "/dashboard/template-manager", icon: Sparkles },
  { title: "Agendamento", url: "/dashboard/schedule", icon: Calendar },
  { title: "Análises", url: "/dashboard/analytics", icon: BarChart3 },
];

const secondaryItems = [
  { title: "Configurações", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" : "hover:bg-muted/50";

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      className={isCollapsed ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        {/* Logo Section */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                PostCraft
              </span>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary Navigation */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Stats (when expanded) */}
        {!isCollapsed && (
          <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-sidebar-foreground/70">Posts criados</span>
                <span className="font-medium text-sidebar-foreground">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sidebar-foreground/70">Este mês</span>
                <span className="font-medium text-sidebar-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  +12%
                </span>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}