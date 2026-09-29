import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, Star, X } from 'lucide-react';
import Card from '../Card';
import { StarRatingDisplay } from './StarRatingInput';
import { apiRequest, isApiEnabled } from '../../lib/api';

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
}

export default function WebinarReviewsPanel({ refreshKey = 0 }) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [averageRating, setAverageRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadReviews = useCallback(async () => {
    if (!isApiEnabled()) {
      setLoading(false);
      setError('Reviews require API configuration.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search.trim()) params.set('search', search.trim());
      const data = await apiRequest(`/api/entrepreneurship-webinar/reviews?${params.toString()}`);
      setRows(data.rows || []);
      setTotal(data.total || 0);
      setAverageRating(data.averageRating ?? null);
      setReviewCount(data.reviewCount || 0);
    } catch (err) {
      setError(err.message || 'Unable to load reviews.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, refreshKey]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const openReview = async (row) => {
    setDetailLoading(true);
    try {
      const data = await apiRequest(`/api/entrepreneurship-webinar/reviews/${row.id}`);
      setSelected(data.review || row);
    } catch {
      setSelected(row);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  return (
    <>
      <Card className="flex h-full flex-col border border-indigo-500/30 bg-gradient-to-br from-[#071028] via-[#0A1025] to-[#111827] p-5 sm:p-6 md:p-8 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
        <div className="mb-4 inline-flex max-w-full rounded-full border border-indigo-500/40 bg-[#0b1235] px-4 py-2">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
            Student Reviews
          </span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Webinar Feedback</h2>

        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <div className="flex items-center gap-2">
            <Star className="text-amber-400 fill-amber-400" size={22} />
            <span className="text-2xl font-bold text-white">
              {averageRating !== null ? averageRating.toFixed(1) : '—'}
            </span>
            <span className="text-sm text-slate-400">/ 5 overall</span>
          </div>
          <span className="text-sm text-slate-500">
            {reviewCount} review{reviewCount === 1 ? '' : 's'} shared
          </span>
        </div>

        <form onSubmit={handleSearch} className="mt-4 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search reviews, college, name…"
            className="w-full rounded-xl border border-white/10 bg-[#0f172a]/60 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-300">{error}</p>
        )}

        <div className="mt-4 flex-1 space-y-3 min-h-[200px]">
          {loading ? (
            <p className="text-slate-400 text-sm py-8 text-center">Loading reviews…</p>
          ) : rows.length === 0 ? (
            <p className="text-slate-400 text-sm py-8 text-center">
              No reviews yet. Be the first to share your experience after attending the webinar.
            </p>
          ) : (
            rows.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => openReview(row)}
                className="w-full text-left rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-indigo-500/30 hover:bg-white/[0.04]"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <p className="font-semibold text-white">{row.fullName}</p>
                  <StarRatingDisplay rating={row.rating} size={14} />
                </div>
                <p className="text-xs text-slate-500 mb-2">
                  {row.college} · {formatDate(row.webinarAttendanceDate)}
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">{row.reviewExcerpt}</p>
              </button>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 disabled:opacity-40"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 disabled:opacity-40"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </Card>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75" onClick={() => !detailLoading && setSelected(null)} />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{selected.fullName}</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {selected.college}
                  {selected.university ? ` · ${selected.university}` : ''}
                </p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <StarRatingDisplay rating={selected.rating} size={18} />
            <p className="mt-4 text-sm text-slate-500">
              Attended on {formatDate(selected.webinarAttendanceDate)}
              {selected.branch ? ` · ${selected.branch}` : ''}
              {selected.city ? ` · ${selected.city}, ${selected.state || ''}` : ''}
            </p>
            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm sm:text-base text-slate-200 whitespace-pre-wrap leading-relaxed">
                {selected.reviewComment || selected.reviewExcerpt}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
