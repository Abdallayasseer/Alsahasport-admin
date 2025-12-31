import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Ticket, MonitorPlay, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import clsx from 'clsx';

const Sidebar = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  
  const isMaster = user?.role === 'MASTER_ADMIN';

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Codes', path: '/admin/codes', icon: Ticket },
    ...(isMaster ? [
      { name: 'Channels', path: '/admin/channels', icon: MonitorPlay },
      { name: 'Sessions', path: '/admin/sessions', icon: Users },
    ] : []),
  ];

  return (
    <div className="hidden h-[calc(100vh-2rem)] w-72 flex-col rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/5 md:flex ml-4 my-4 shadow-2xl shadow-black/40">
      {/* Header */}
      <div className="flex h-24 items-center px-8 border-b border-white/5">
        <div className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent text-2xl font-black tracking-tight">
          ALSAHA
        </div>
        <div className="ml-2 rounded-full bg-white/5 px-2 py-0.5 text-[0.6rem] font-bold tracking-wider text-zinc-400 uppercase">
          Studio
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2 px-4 py-8">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={clsx(
                'group relative flex items-center rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 ease-out',
                isActive
                  ? 'bg-white/5 text-white shadow-lg shadow-indigo-500/10'
                  : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-200'
              )}
            >
              {/* Active Indicator Glow */}
              {isActive && (
                <div className="absolute left-0 h-8 w-1rounded-r-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)]" /> 
              )}
              
              <Icon 
                className={clsx(
                  "mr-4 h-5 w-5 transition-all duration-300", 
                  isActive ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" : "text-zinc-600 group-hover:text-zinc-300 scale-95 group-hover:scale-100"
                )} 
              />
              <span className="tracking-wide">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4">
        <div className="rounded-xl bg-gradient-to-br from-white/5 to-transparent p-4 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
              {(user?.username?.[0] || 'A').toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">{user?.username || 'Admin'}</p>
              <p className="text-xs text-zinc-500 mt-1">{user?.role === 'MASTER_ADMIN' ? 'Master Access' : 'Daily Access'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="group flex w-full items-center justify-center rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-300"
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
