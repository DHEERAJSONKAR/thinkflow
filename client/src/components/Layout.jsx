import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";

const Layout = ({ children, onSelectNote }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0 border-r border-white/10">
        <Sidebar onSelectNote={onSelectNote} onClose={closeSidebar} />
      </div>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeSidebar}
          ></div>
          
          {/* Sidebar Panel */}
          <div className="relative w-64 h-full bg-slate-900 border-r border-white/10 shadow-xl">
            <Sidebar onSelectNote={onSelectNote} onClose={closeSidebar} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-16 lg:pt-0 px-4 sm:px-6 lg:px-0">
        {children}
      </div>

    </div>
  );
};

export default Layout;