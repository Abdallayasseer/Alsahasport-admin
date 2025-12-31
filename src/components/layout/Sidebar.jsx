import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  MonitorPlay,
  Users,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import clsx from "clsx";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isMaster = user?.role === "MASTER_ADMIN";

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const links = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Codes", path: "/admin/codes", icon: Ticket },
    ...(isMaster
      ? [
          { name: "Channels", path: "/admin/channels", icon: MonitorPlay },
          { name: "Sessions", path: "/admin/sessions", icon: Users },
        ]
      : []),
  ];

  return (
    <>
      {/* Mobile Trigger Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-zinc-900 border border-white/10 text-white shadow-lg shadow-black/50"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <div
        className={clsx(
          "fixed md:static inset-y-0 right-0 z-50 flex flex-col h-full md:h-[calc(100vh-2rem)] md:my-4 md:ml-4",
          "bg-zinc-900/80 backdrop-blur-xl border-l md:border border-white/5 md:rounded-2xl shadow-2xl shadow-black/40",
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-72",
          // Mobile positioning
          isMobileOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        )}
      >
        {/* Toggle Button (Desktop Only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-8 h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-white border border-indigo-400 shadow-lg shadow-indigo-500/20 hover:scale-110 transition-transform cursor-pointer z-50"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Close Button (Mobile Only) */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden absolute top-4 right-4 p-1 text-zinc-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div
          className={clsx(
            "flex h-24 items-center border-b border-white/5 transition-all duration-300",
            isCollapsed ? "justify-center px-0" : "px-8"
          )}
        >
          {isCollapsed ? (
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-black text-xl">A</span>
            </div>
          ) : (
            <div className="overflow-hidden whitespace-nowrap">
              <div className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent text-2xl font-black tracking-tight">
                ALSAHA
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-indigo-500" />
                <span className="text-[0.65rem] font-bold tracking-[0.2em] text-zinc-500 uppercase">
                  Studio Admin
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-2 px-3 py-6 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  "group relative flex items-center rounded-xl transition-all duration-300 ease-out",
                  isCollapsed ? "justify-center px-0 py-3" : "px-4 py-3.5",
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-white shadow-lg shadow-indigo-500/5 border border-indigo-500/10"
                    : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200 hover:border-white/5 border border-transparent"
                )}
                title={isCollapsed ? link.name : ""}
              >
                {/* Active Indicator Line */}
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 h-6 w-1 rounded-r-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
                )}

                <Icon
                  className={clsx(
                    "transition-all duration-300",
                    isCollapsed ? "h-6 w-6" : "mr-4 h-5 w-5",
                    isActive
                      ? "text-indigo-400"
                      : "text-zinc-500 group-hover:text-zinc-300"
                  )}
                />

                {!isCollapsed && (
                  <span
                    className={clsx(
                      "text-sm font-medium tracking-wide transition-all duration-300",
                      isActive
                        ? "text-white"
                        : "text-zinc-400 group-hover:text-zinc-200"
                    )}
                  >
                    {link.name}
                  </span>
                )}

                {/* Hover Tooltip for Collapsed State */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 hidden group-hover:block z-50">
                    <div className="bg-zinc-900 border border-white/10 text-white text-xs px-2 py-1 rounded shadow-xl whitespace-nowrap">
                      {link.name}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div
          className={clsx(
            "p-3 transition-all duration-300",
            isCollapsed ? "px-2" : "px-4"
          )}
        >
          <div
            className={clsx(
              "rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 overflow-hidden transition-all duration-300",
              isCollapsed ? "p-2" : "p-4"
            )}
          >
            <div
              className={clsx(
                "flex items-center gap-3",
                isCollapsed ? "justify-center" : "mb-4"
              )}
            >
              <div className="h-9 w-9 min-w-[2.25rem] rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 ring-2 ring-zinc-900">
                {(user?.username?.[0] || "A").toUpperCase()}
              </div>

              {!isCollapsed && (
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white leading-none truncate">
                    {user?.username || "Admin"}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 truncate">
                    {user?.role === "MASTER_ADMIN" ? "Master Access" : "Daily"}
                  </p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={logout}
                className="group flex w-full items-center justify-center rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-300"
              >
                <LogOut className="mr-2 h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
