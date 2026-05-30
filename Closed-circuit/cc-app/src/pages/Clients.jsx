import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, User, Sparkles } from 'lucide-react';
import Hero from '../components/Hero';
import { apiRequest } from '../lib/api';

function formatOnboardDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function ClientAvatar({ logoUrl, profileUrl, clientType, name }) {
  return (
    <div className="relative mx-auto mb-6 h-24 w-24">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/40 to-purple-600/30 blur-md" />
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="relative h-24 w-24 rounded-2xl object-contain border border-white/15 bg-[#0f172a] p-2 shadow-lg"
        />
      ) : (
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-600/40 to-purple-700/30 text-white">
          {clientType === 'b2b' ? <Building2 size={36} /> : <User size={36} />}
        </div>
      )}
      {profileUrl && (
        <img
          src={profileUrl}
          alt=""
          className="absolute -bottom-1 -right-1 h-11 w-11 rounded-full border-2 border-[#0f172a] object-cover shadow-lg ring-2 ring-indigo-500/40"
        />
      )}
    </div>
  );
}

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/api/clients')
      .then((data) => setClients(data.clients || []))
      .catch(() => setError('Unable to load clients at the moment.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#030712]">
      <Hero
        title="Our Clients"
        subtitle="Trusted partners who chose Closed Circuit for private, secure community experiences"
        eyebrow="Partners"
      />

      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-indigo-500/10 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />
        </div>

        {loading && (
          <p className="relative text-center text-slate-400">Loading clients...</p>
        )}

        {error && !loading && (
          <p className="relative text-center text-red-400">{error}</p>
        )}

        {!loading && !error && clients.length === 0 && (
          <p className="relative text-center text-slate-400">
            Client profiles will appear here soon.
          </p>
        )}

        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client, index) => (
            <motion.article
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0f172a]/90 to-[#030712]/90 p-6 text-center shadow-[0_0_40px_rgba(99,102,241,0.08)] backdrop-blur-sm transition duration-300 hover:border-indigo-500/30 hover:shadow-[0_0_50px_rgba(99,102,241,0.15)]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

              <ClientAvatar
                logoUrl={client.logo_url}
                profileUrl={client.profile_pic_url}
                clientType={client.client_type}
                name={client.name}
              />

              <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">
                {client.name}
              </h3>

              <span className="mt-3 inline-flex self-center items-center gap-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                <Sparkles size={10} />
                {client.client_type}
              </span>

              {client.business_type && (
                <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                  {client.business_type}
                </p>
              )}

              {client.onboard_date && (
                <p className="mt-3 text-xs text-slate-500">
                  Partner since {formatOnboardDate(client.onboard_date)}
                </p>
              )}
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
