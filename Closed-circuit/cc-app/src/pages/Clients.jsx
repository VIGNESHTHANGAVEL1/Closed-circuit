import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, User } from 'lucide-react';
import Hero from '../components/Hero';
import Card from '../components/Card';
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
    <div className="bg-slate-50 min-h-screen">
      <Hero
        title="Our Clients"
        subtitle="Partners and organizations who trust Closed Circuit"
      />

      <section className="max-w-7xl mx-auto px-6 py-16">
        {loading && (
          <p className="text-center text-slate-500">Loading clients...</p>
        )}

        {error && !loading && (
          <p className="text-center text-red-600">{error}</p>
        )}

        {!loading && !error && clients.length === 0 && (
          <p className="text-center text-slate-500">Client profiles will appear here soon.</p>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
            >
              <Card className="h-full flex flex-col items-center text-center p-8">
                <div className="relative mb-5">
                  {client.logo_url ? (
                    <img
                      src={client.logo_url}
                      alt={`${client.name} logo`}
                      className="h-20 w-20 rounded-2xl object-contain border border-slate-200 bg-white p-2 shadow-sm"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                      {client.client_type === 'b2b' ? <Building2 size={32} /> : <User size={32} />}
                    </div>
                  )}
                  {client.profile_pic_url && (
                    <img
                      src={client.profile_pic_url}
                      alt=""
                      className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full border-2 border-white object-cover shadow-md"
                    />
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{client.name}</h3>
                <span className="mt-2 inline-block rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  {client.client_type}
                </span>
                {client.business_type && (
                  <p className="mt-3 text-sm text-slate-600">{client.business_type}</p>
                )}
                {client.onboard_date && (
                  <p className="mt-2 text-xs text-slate-400">
                    Partner since {formatOnboardDate(client.onboard_date)}
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
