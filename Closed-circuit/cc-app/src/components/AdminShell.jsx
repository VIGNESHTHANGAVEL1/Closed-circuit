import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Users, KeyRound, LogOut, Menu, X } from 'lucide-react';
import { clearAuthSession, getStoredUser } from '../lib/auth';

const navLinks = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
  { label: 'Clients', path: '/admin/clients', icon: Users },
  { label: 'Change Password', path: '/admin/change-password', icon: KeyRound },
];

export default function AdminShell({ title, subtitle, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  const closeSidebar = () => setSidebarOpen(false);

  const sidebarContent = (
    <>
      <div className="border-b border-white/10 px-5 py-5">
        <Link to="/admin/dashboard" onClick={closeSidebar} className="block">
          <p className="text-lg font-bold text-white">Closed Circuit</p>
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-indigo-400 mt-0.5">
            Admin Panel
          </p>
        </Link>
        {user?.username && (
          <p className="text-xs text-slate-500 mt-3 truncate">
            {user.username}
          </p>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navLinks.map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              onClick={closeSidebar}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? 'bg-gradient-to-r from-indigo-500/25 to-purple-600/15 text-white border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Icon size={18} className={active ? 'text-indigo-300' : 'text-slate-500'} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#030712]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#0a0f1a]/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          onClick={closeSidebar}
          className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
        {sidebarContent}
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-white/10 bg-[#030712]/90 px-4 py-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold text-white sm:text-2xl">{title}</h1>
            {subtitle && <p className="truncate text-sm text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
