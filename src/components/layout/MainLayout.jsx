import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
// Removed Navbar import since user profile is now in Sidebar and we want a cleaner look

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden selection:bg-indigo-500/30">
      {/* Sidebar - Positioned with margin */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Top Gradient Haze */}
        <div className="pointer-events-none absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-[-10%] left-[10%] h-[300px] w-[300px] rounded-full bg-violet-500/5 blur-[80px]" />

        <main className="flex-1 overflow-y-auto p-8 relative z-10 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
