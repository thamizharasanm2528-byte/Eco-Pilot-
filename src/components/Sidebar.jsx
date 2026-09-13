import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  BookOpen,
  Bot,
  User,
  Settings,
  X,
  Leaf,
  ArrowUpDown,
} from "lucide-react";

const Sidebar = ({ isMobileOpen, closeMobileSidebar }) => {
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Assessments",
      path: "/assessments",
      icon: ClipboardList,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Comparison",
      path: "/comparison",
      icon: ArrowUpDown,
    },
    {
      name: "Knowledge Base",
      path: "/knowledge",
      icon: BookOpen,
    },
    {
      name: "AI Intelligence",
      path: "/ai",
      icon: Bot,
    },
    {
      name: "User Profile",
      path: "/profile",
      icon: User,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between py-6 px-4 bg-white border-r border-eco-border">
      <div className="space-y-6">
        <div>
          <span className="px-3 text-[10px] font-heading font-bold tracking-widest text-eco-muted uppercase">
            Campus Navigation
          </span>
          <nav className="mt-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `flex items-center px-3.5 py-2.5 rounded-2xl text-xs font-heading transition-all ${
                      isActive
                        ? "bg-eco-soft text-eco-primary font-bold border-l-4 border-eco-primary shadow-eco-sm"
                        : "text-eco-muted font-medium hover:bg-eco-bg hover:text-eco-text"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 mr-3 text-eco-primary shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Platform Foundation Footer Card */}
      <div className="p-4 bg-eco-soft rounded-2xl border border-eco-border text-xs space-y-1">
        <div className="flex items-center space-x-2 text-eco-primary font-heading font-bold">
          <img src="/logo.png" alt="EcoPilot Logo" className="w-4 h-4 rounded object-cover" />
          <span>EcoPilot Intelligence</span>
        </div>
        <p className="text-[11px] text-eco-muted leading-relaxed font-sans">
          Sustainability Analytics & AI Decision Intelligence.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-[calc(100vh-4.5rem)] sticky top-18">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Menu */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-eco-dark/60 backdrop-blur-xs transition-opacity"
            onClick={closeMobileSidebar}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-eco-lg z-50 flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-eco-border">
              <span className="font-heading font-bold text-eco-text text-sm">EcoPilot Menu</span>
              <button
                onClick={closeMobileSidebar}
                className="p-1 rounded-xl text-eco-muted hover:bg-eco-soft"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
