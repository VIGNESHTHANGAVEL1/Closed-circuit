import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, User, Sparkles, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import Hero from '../components/Hero';
import { apiRequest } from '../lib/api';
import { openDomainPreview } from '../lib/domain';

const CARD_GAP = 16;
const LOGO_MAX_W = 180;
const LOGO_MAX_H = 90;

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

function useCardsPerView() {
  const [cardsPerView, setCardsPerView] = useState(4);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width >= 1200) setCardsPerView(4);
      else if (width >= 768) setCardsPerView(2);
      else setCardsPerView(1);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return cardsPerView;
}

function ClientLogo({ logoUrl, clientType, name }) {
  const [size, setSize] = useState({ w: LOGO_MAX_W, h: LOGO_MAX_H });
  const [imgScale, setImgScale] = useState(1);

  const handleLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (!naturalWidth || !naturalHeight) return;

    const imageRatio = naturalWidth / naturalHeight;
    const boxRatio = LOGO_MAX_W / LOGO_MAX_H;

    let fitW;
    let fitH;
    if (imageRatio >= boxRatio) {
      fitW = LOGO_MAX_W;
      fitH = LOGO_MAX_W / imageRatio;
    } else {
      fitH = LOGO_MAX_H;
      fitW = LOGO_MAX_H * imageRatio;
    }

    const fillRatio = (fitW * fitH) / (LOGO_MAX_W * LOGO_MAX_H);

    if (fillRatio < 0.5) {
      const shrink = Math.max(0.72, Math.sqrt(fillRatio / 0.5));
      setSize({
        w: Math.round(LOGO_MAX_W * shrink),
        h: Math.round(LOGO_MAX_H * shrink),
      });
      setImgScale(Math.min(1.3, 1 / shrink));
    } else {
      setSize({ w: LOGO_MAX_W, h: LOGO_MAX_H });
      setImgScale(1);
    }
  };

  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
      style={{ width: size.w, height: size.h }}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${name} logo`}
          onLoad={handleLoad}
          className="h-full w-full object-contain px-3 py-1.5 transition-transform duration-200"
          style={{ transform: `scale(${imgScale})` }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-indigo-600">
          {clientType === 'b2b' ? <Building2 size={36} /> : <User size={36} />}
        </div>
      )}
    </div>
  );
}

function ClientCardHeader({ logoUrl, profileUrl, clientType, name }) {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <ClientLogo logoUrl={logoUrl} clientType={clientType} name={name} />

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

function ClientCard({ client, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-indigo-500/30 bg-gradient-to-b from-[#0f172a]/95 via-[#0c1425]/90 to-[#060d1f]/95 p-5 text-center shadow-[0_8px_32px_rgba(99,102,241,0.15),0_0_0_1px_rgba(139,92,246,0.12)] backdrop-blur-md transition duration-300 hover:border-indigo-400/45 hover:shadow-[0_12px_40px_rgba(99,102,241,0.22)]"
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
          <p className="text-sm leading-snug text-white">{client.business_type}</p>
        )}

        {client.onboard_date && (
          <p className="text-sm leading-snug text-white/90">
            Partner since {formatOnboardDate(client.onboard_date)}
          </p>
        )}

        <DomainLink domainUrl={client.domain_url} />
      </div>
    </motion.article>
  );
}

function CarouselArrow({ direction, onClick, disabled }) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'Previous clients' : 'Next clients'}
      className={`absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-indigo-500/35 bg-[#0f172a]/85 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] backdrop-blur-sm transition-all duration-300 hover:border-indigo-400/55 hover:bg-[#0f172a] hover:shadow-[0_0_28px_rgba(99,102,241,0.45)] disabled:pointer-events-none disabled:opacity-25 md:flex ${
        direction === 'left' ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'
      }`}
    >
      <Icon size={22} strokeWidth={2.5} />
    </button>
  );
}

function ClientCarousel({ clients }) {
  const cardsPerView = useCardsPerView();
  const [currentPage, setCurrentPage] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const containerRef = useRef(null);
  const touchStartX = useRef(null);

  const totalPages = Math.max(1, Math.ceil(clients.length / cardsPerView));
  const needsCarousel = clients.length > cardsPerView;
  const isMobile = cardsPerView === 1;
  const showArrows = !isMobile && needsCarousel;
  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  const updateCardWidth = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const width = el.offsetWidth;
    setCardWidth((width - CARD_GAP * (cardsPerView - 1)) / cardsPerView);
  }, [cardsPerView]);

  useEffect(() => {
    updateCardWidth();
    const el = containerRef.current;
    if (!el) return undefined;

    const observer = new ResizeObserver(updateCardWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateCardWidth]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages - 1));
  }, [cardsPerView, totalPages]);

  const goPrev = () => {
    if (canGoPrev) setCurrentPage((page) => page - 1);
  };

  const goNext = () => {
    if (canGoNext) setCurrentPage((page) => page + 1);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;

    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  const translateX = currentPage * cardsPerView * (cardWidth + CARD_GAP);

  return (
    <div className={`relative ${showArrows ? 'px-8 md:px-10' : ''}`}>
      {showArrows && (
        <>
          <CarouselArrow direction="left" onClick={goPrev} disabled={!canGoPrev} />
          <CarouselArrow direction="right" onClick={goNext} disabled={!canGoNext} />
        </>
      )}

      <div
        ref={containerRef}
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`flex transition-transform duration-500 ease-in-out ${
            !needsCarousel ? 'justify-center' : ''
          }`}
          style={{
            gap: CARD_GAP,
            transform: needsCarousel && cardWidth ? `translateX(-${translateX}px)` : undefined,
          }}
        >
          {clients.map((client, index) => (
            <div
              key={client.id}
              className="shrink-0"
              style={{ width: cardWidth || undefined, flexBasis: cardWidth || undefined }}
            >
              <ClientCard client={client} index={index} />
            </div>
          ))}
        </div>
      </div>
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

        {!loading && !error && clients.length > 0 && (
          <div className="relative">
            <ClientCarousel clients={clients} />
          </div>
        )}
      </section>
    </div>
  );
}
