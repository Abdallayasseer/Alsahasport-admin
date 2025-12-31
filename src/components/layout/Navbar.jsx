import { useAuth } from '../../context/useAuth';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
      <div className="flex items-center md:hidden">
        <button className="text-gray-500 hover:text-gray-700">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="ml-auto flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{user?.username || 'Admin'}</p>
          <p className="text-xs text-gray-500">{user?.role || 'Guest'}</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
          {(user?.username?.[0] || 'A').toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
