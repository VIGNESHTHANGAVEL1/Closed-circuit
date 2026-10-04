import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Eye, X, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import AdminShell from '../../components/AdminShell';
import StatusBadge from '../../components/StatusBadge';
import { StarRatingDisplay } from '../../components/entrepreneurshipWebinar/StarRatingInput';
import { WEBINAR_STATUSES } from '../../constants/webinarStatus';
import { apiRequest } from '../../lib/api';
import { clearAuthSession, getStoredToken } from '../../lib/auth';

function formatDateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
}

export default function WebinarCandidatesDashboard({ title, subtitle, apiBase }) {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [statusToast, setStatusToast] = useState(null);
  const [modalStatus, setModalStatus] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  const showStatusToast = (type, message) => {
    setStatusToast({ type, message });
    setTimeout(() => setStatusToast(null), 3000);
  };

  const loadRows = useCallback(
    async (pageOverride) => {
      const token = getStoredToken();
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      const currentPage = pageOverride ?? page;
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({ page: String(currentPage), limit: String(limit) });
        if (search.trim()) params.set('search', search.trim());
        if (statusFilter) params.set('status', statusFilter);
        if (dateFrom) params.set('dateFrom', dateFrom);
        if (dateTo) params.set('dateTo', dateTo);

        const data = await apiRequest(`${apiBase}?${params.toString()}`, { token });
        setRows(data.rows || []);
        setTotal(data.total || 0);
      } catch (err) {
        if (err.status === 401) {
          clearAuthSession();
          navigate('/login', { replace: true });
          return;
        }
        setError(err.data?.message || 'Unable to load candidates.');
      } finally {
        setLoading(false);
      }
    },
    [apiBase, page, limit, search, statusFilter, dateFrom, dateTo, navigate]
  );

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    loadRows(1);
  };

  const openRow = async (row) => {
    const token = getStoredToken();
    if (!token) return;
    try {
      const data = await apiRequest(`${apiBase}/${row.id}`, { token });
      setSelected(data.application || row);
      setModalStatus((data.application || row).status || 'New');
    } catch {
      setSelected(row);
      setModalStatus(row.status || 'New');
    }
  };

  const handleSaveStatus = async () => {
    if (!selected) return;
    const token = getStoredToken();
    if (!token) return;

    setSavingStatus(true);
    try {
      const data = await apiRequest(`${apiBase}/${selected.id}/status`, {
        token,
        method: 'PATCH',
        body: JSON.stringify({ status: modalStatus }),
      });
      const updated = data.application;
      const newStatus = updated?.status || modalStatus;
      setRows((current) => current.map((row) => (row.id === selected.id ? { ...row, status: newStatus } : row)));
      setSelected((prev) => (prev ? { ...prev, status: newStatus } : prev));
      showStatusToast('success', data.message || 'Status updated.');
    } catch (err) {
      showStatusToast('error', err.data?.message || 'Status update failed.');
    } finally {
      setSavingStatus(false);
    }
  };

  const inputClasses =
    'px-3 py-2 bg-[#0f172a]/80 text-white border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40';

  const detailFields = selected
    ? [
        ['Full Name', selected.fullName || selected.name],
        ['Email', selected.emailId || selected.email],
        ['Mobile', selected.mobileNumber || selected.phone],
        ['Branch', selected.branch],
        ['Year of Pass-out', selected.yearOfPassout],
        ['College', selected.college],
        ['University', selected.university],
        ['City', selected.city],
        ['State', selected.state],
        ['PIN Code', selected.pinCode],
        ['Webinar Attendance Date', formatDate(selected.webinarAttendanceDate)],
        ['Rating', selected.rating ? `${selected.rating} / 5` : '-'],
        ['Applied On', formatDateTime(selected.created_at)],
      ]
    : [];

  return (
    <AdminShell title={title} subtitle={subtitle}>
      {statusToast && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
            statusToast.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-red-500/30 bg-red-500/10 text-red-300'
          }`}
        >
          {statusToast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {statusToast.message}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-[#0f172a]/60 p-6 shadow-2xl backdrop-blur-xl"
      >
        <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-2 xl:grid-cols-6 mb-6">
          <div className="xl:col-span-2 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, college..."
              className={`${inputClasses} w-full pl-9`}
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClasses}>
            <option value="">All statuses</option>
            {WEBINAR_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={`${inputClasses} [color-scheme:dark]`} />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={`${inputClasses} [color-scheme:dark]`} />
          <button type="submit" className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600">
            Apply Filters
          </button>
        </form>

        {error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">S.No</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">College</th>
                <th className="px-4 py-3 font-semibold">Attendance Date</th>
                <th className="px-4 py-3 font-semibold">Submitted</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    No candidates found.
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={row.id} className="border-t border-white/5 text-slate-300">
                    <td className="px-4 py-3">{(page - 1) * limit + index + 1}</td>
                    <td className="px-4 py-3 text-white">{row.name}</td>
                    <td className="px-4 py-3">{row.college}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(row.webinarAttendanceDate)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(row.created_at)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => openRow(row)}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-white/5"
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            Showing {rows.length} of {total} candidates
          </p>
          <div className="flex items-center gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 disabled:opacity-40">
              <ChevronLeft size={16} /> Prev
            </button>
            <span className="text-sm text-slate-400">
              Page {page} of {totalPages}
            </span>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 disabled:opacity-40">
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSelected(null)} />
          <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold text-white">Candidate Details</h2>
              <button type="button" onClick={() => setSelected(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-300 mb-4">
              {detailFields.map(([label, value]) => (
                <p key={label}>
                  <span className="text-slate-500 block text-xs mb-0.5">{label}</span>
                  {label === 'Rating' && selected.rating ? (
                    <StarRatingDisplay rating={selected.rating} size={16} />
                  ) : (
                    value || '-'
                  )}
                </p>
              ))}
            </div>

            {selected.reviewComment && (
              <div className="mb-4">
                <p className="text-slate-500 text-xs mb-1">Review Comment</p>
                <pre className="whitespace-pre-wrap rounded-lg border border-white/10 bg-black/20 p-4 text-slate-200 max-h-40 overflow-y-auto">
                  {selected.reviewComment}
                </pre>
              </div>
            )}

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <label htmlFor="webinar-modal-status" className="block text-xs font-semibold text-slate-400 mb-2">
                Certificate Status
              </label>
              <select
                id="webinar-modal-status"
                value={modalStatus}
                onChange={(e) => setModalStatus(e.target.value)}
                disabled={savingStatus}
                className={`${inputClasses} w-full`}
              >
                {WEBINAR_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => void handleSaveStatus()}
                disabled={savingStatus || modalStatus === (selected.status || 'New')}
                className="mt-3 w-full rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-50"
              >
                {savingStatus ? 'Updating…' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
