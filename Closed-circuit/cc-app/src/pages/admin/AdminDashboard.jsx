import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Sparkles } from 'lucide-react';
import AdminShell from '../../components/AdminShell';
import { apiRequest } from '../../lib/api';
import { clearAuthSession, getStoredToken } from '../../lib/auth';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalEnquiries: 0, newEnquiries: 0, totalClients: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    apiRequest('/api/admin/dashboard/stats', { token })
      .then((data) => setStats(data.stats || {}))
      .catch((err) => {
        if (err.status === 401) {
          clearAuthSession();
          navigate('/login', { replace: true });
          return;
        }
        setError(err.data?.message || 'Unable to load dashboard stats.');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const cards = [
    {
      title: 'Enquiries / Contact Data',
      description: 'View and manage contact form submissions',
      path: '/admin/enquiries',
      icon: MessageSquare,
      stat: loading ? '…' : stats.totalEnquiries,
      statLabel: 'Total enquiries',
      accent: 'from-indigo-500/20 to-purple-600/10 border-indigo-500/30',
    },
    {
      title: 'Clients',
      description: 'Add and manage client profiles for the public site',
      path: '/admin/clients',
      icon: Users,
      stat: loading ? '…' : stats.totalClients,
      statLabel: 'Total clients',
      accent: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/30',
    },
  ];

  return (
    <AdminShell title="Dashboard" subtitle="Closed Circuit administration overview">
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5"
        >
          <div className="flex items-center gap-2 text-amber-300 mb-2">
            <Sparkles size={18} />
            <span className="text-sm font-semibold">New enquiries</span>
          </div>
          <p className="text-3xl font-bold text-white">{loading ? '…' : stats.newEnquiries}</p>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((card, index) => (
          <motion.div
            key={card.path}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Link
              to={card.path}
              className={`block rounded-2xl border bg-gradient-to-br p-6 shadow-2xl backdrop-blur-xl transition hover:scale-[1.01] ${card.accent}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-xl bg-white/10 p-3 text-white">
                  <card.icon size={24} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{card.stat}</p>
                  <p className="text-xs text-slate-400">{card.statLabel}</p>
                </div>
              </div>
              <h2 className="mt-4 text-lg font-bold text-white">{card.title}</h2>
              <p className="mt-1 text-sm text-slate-400">{card.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </AdminShell>
  );
}
