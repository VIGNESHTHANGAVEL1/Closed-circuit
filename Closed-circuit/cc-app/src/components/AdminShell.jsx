import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Users, LogOut, ArrowLeft } from 'lucide-react';
import { clearAuthSession, getStoredUser } from '../lib/auth';

const navLinks = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
  { label: 'Clients', path: '/admin/clients', icon: Users },
];

export default function AdminShell({ title, subtitle, children, showBack }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#030712] px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-white/10 pb-4">
          {navLinks.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 border border-transparent hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            {showBack && (
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="mb-2 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"
              >
                <ArrowLeft size={14} />
                Back to dashboard
              </button>
            )}
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
            {user?.username && (
              <p className="text-slate-500 text-xs mt-1">
                Signed in as <span className="text-slate-300">{user.username}</span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
