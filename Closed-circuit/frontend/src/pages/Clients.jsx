import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, User, Sparkles, Globe } from 'lucide-react';
import Hero from '../components/Hero';
import { apiRequest } from '../lib/api';
import { openDomainPreview } from '../lib/domain';

function formatOnboardDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function formatClientType(type) {
  if (!type) return '';
  return type.toUpperCase();
}

function ClientCardHeader({ logoUrl, profileUrl, clientType, name }) {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <div className="flex h-[90px] w-[180px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${name} logo`}
            className="h-full w-full object-contain px-4 py-2"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-indigo-600">
            {clientType === 'b2b' ? <Building2 size={36} /> : <User size={36} />}
          </div>
        )}
      </div>

      {profileUrl ? (
        <img
          src={profileUrl}
          alt=""
          className="h-[90px] w-[90px] shrink-0 rounded-full border-2 border-indigo-500/25 object-cover shadow-[0_4px_16px_rgba(99,102,241,0.2)]"
        />
      ) : null}
    </div>
  );
}

function DomainLink({ domainUrl }) {
  if (!domainUrl) return null;

  return (
    <button
      type="button"
      onClick={() => openDomainPreview(domainUrl)}
      className="inline-flex max-w-full items-center justify-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300 hover:underline cursor-pointer"
    >
      <Globe size={14} className="shrink-0" />
      <span className="truncate">{domainUrl}</span>
    </button>
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
        compact
        contentClassName="mx-auto max-w-6xl px-6 py-5 md:py-7 text-center"
      />

      <section className="relative mx-auto max-w-7xl px-4 pt-3 pb-12 sm:px-6 sm:pt-4 sm:pb-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 h-48 w-48 rounded-full bg-indigo-500/10 blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-purple-500/10 blur-[80px]" />
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

        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client, index) => (
            <motion.article
              key={client.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.35 }}
              className="group relative flex flex-col overflow-hidden rounded-[20px] border border-indigo-500/30 bg-gradient-to-b from-[#0f172a]/95 via-[#0c1425]/90 to-[#060d1f]/95 p-5 text-center shadow-[0_8px_32px_rgba(99,102,241,0.15),0_0_0_1px_rgba(139,92,246,0.12)] backdrop-blur-md transition duration-300 hover:border-indigo-400/45 hover:shadow-[0_12px_40px_rgba(99,102,241,0.22)]"
            >
              <ClientCardHeader
                logoUrl={client.logo_url}
                profileUrl={client.profile_pic_url}
                clientType={client.client_type}
                name={client.name}
              />

              <div className="mt-2.5 flex flex-col items-center gap-2">
                <h3 className="text-xl font-bold leading-tight text-white transition-colors group-hover:text-indigo-100">
                  {client.name}
                </h3>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/35 bg-[#0f172a]/80 px-3.5 py-1 text-sm font-bold uppercase tracking-wider text-indigo-300">
                  <Sparkles size={13} />
                  {formatClientType(client.client_type)}
                </span>

                {client.business_type && (
                  <p className="text-sm leading-snug text-white">
                    {client.business_type}
                  </p>
                )}

                {client.onboard_date && (
                  <p className="text-sm leading-snug text-white/90">
                    Partner since {formatOnboardDate(client.onboard_date)}
                  </p>
                )}

                <DomainLink domainUrl={client.domain_url} />
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
