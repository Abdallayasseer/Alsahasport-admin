import { useAuth } from "../../context/useAuth";
import { Menu, X, Bell, Search, User } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / Brand Area (Optional) */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            AdminPanel
          </span>
        </div>

        {/* Desktop Navigation & Actions */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-64 rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-semibold text-gray-700">
                {user?.username || "Admin"}
              </p>
              <p className="text-xs text-gray-500 font-medium">
                {user?.role || "Guest"}
              </p>
            </div>
            <div className="group relative h-10 w-10 cursor-pointer overflow-hidden rounded-full border-2 border-emerald-100 bg-emerald-50 transition-transform hover:scale-105 hover:shadow-lg hover:border-emerald-300">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="User"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-emerald-600 font-bold">
                  {(user?.username?.[0] || "A").toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 animate-in spin-in-90 duration-200" />
            ) : (
              <Menu className="h-6 w-6 animate-in fade-in duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-64 opacity-100 border-b"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-4 px-4 py-6 bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                {(user?.username?.[0] || "A").toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {user?.username || "Admin"}
                </p>
                <p className="text-xs text-gray-500">{user?.role || "Guest"}</p>
              </div>
            </div>
            <button className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
