import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LogOut,
  Search,
  Download,
  FileSpreadsheet,
  FileText,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { apiDownload, apiRequest, triggerBlobDownload } from '../../lib/api';
import { clearAuthSession, getStoredToken, getStoredUser } from '../../lib/auth';

function formatDateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

export default function EnquiryDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getStoredUser());
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [exporting, setExporting] = useState(null);

  const loadEnquiries = useCallback(async (pageOverride) => {
    const token = getStoredToken();
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const currentPage = pageOverride ?? page;

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(limit),
      });

      if (search.trim()) params.set('search', search.trim());
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);

      const data = await apiRequest(`/api/admin/enquiries?${params.toString()}`, { token });
      setRows(data.rows || []);
      setTotal(data.total || 0);
      setUser(getStoredUser());
    } catch (err) {
      if (err.status === 401) {
        clearAuthSession();
        navigate('/login', { replace: true });
        return;
      }
      setError(err.data?.message || 'Unable to load enquiries.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, dateFrom, dateTo, navigate]);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    loadEnquiries(1);
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  const handleExport = async (type) => {
    const token = getStoredToken();
    if (!token) return;

    setExporting(type);

    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const path =
        type === 'excel'
          ? '/api/admin/enquiries/export/excel'
          : '/api/admin/enquiries/export/pdf';

      const { blob, filename } = await apiDownload(path, { token, params });
      triggerBlobDownload(blob, filename);
    } catch (err) {
      setError(err.message || 'Export failed.');
    } finally {
      setExporting(null);
    }
  };

  const inputClasses =
    'px-3 py-2 bg-[#0f172a]/80 text-white border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40';

  return (
    <div className="min-h-screen bg-[#030712] px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Enquiry Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Signed in as <span className="text-white">{user?.username}</span>
            </p>
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

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-[#0f172a]/60 p-6 shadow-2xl backdrop-blur-xl"
        >
          <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 mb-6">
            <div className="xl:col-span-2 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, phone..."
                className={`${inputClasses} w-full pl-9`}
              />
            </div>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={`${inputClasses} [color-scheme:dark]`}
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={`${inputClasses} [color-scheme:dark]`}
            />
            <button
              type="submit"
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
            >
              Apply Filters
            </button>
          </form>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleExport('excel')}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 disabled:opacity-60"
            >
              <FileSpreadsheet size={16} />
              {exporting === 'excel' ? 'Exporting...' : 'Download Excel'}
            </button>
            <button
              type="button"
              onClick={() => handleExport('pdf')}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300 disabled:opacity-60"
            >
              <FileText size={16} />
              {exporting === 'pdf' ? 'Exporting...' : 'Download PDF'}
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 text-left text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">S.No</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Message</th>
                  <th className="px-4 py-3 font-semibold">Submitted Date & Time</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                      Loading enquiries...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                      No enquiries found.
                    </td>
                  </tr>
                ) : (
                  rows.map((row, index) => (
                    <tr key={row.id} className="border-t border-white/5 text-slate-300">
                      <td className="px-4 py-3">{(page - 1) * limit + index + 1}</td>
                      <td className="px-4 py-3 text-white">{row.name}</td>
                      <td className="px-4 py-3">{row.email}</td>
                      <td className="px-4 py-3">{row.phone}</td>
                      <td className="px-4 py-3 max-w-xs truncate">{row.message}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(row.created_at)}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelected(row)}
                          className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-white/5"
                        >
                          <Eye size={14} />
                          View
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
              Showing {rows.length} of {total} enquiries
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Prev
              </button>
              <span className="text-sm text-slate-400">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSelected(null)} />
          <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold text-white">Enquiry Details</h2>
              <button type="button" onClick={() => setSelected(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3 text-sm text-slate-300">
              <p><span className="text-slate-500">Name:</span> {selected.name}</p>
              <p><span className="text-slate-500">Email:</span> {selected.email}</p>
              <p><span className="text-slate-500">Phone:</span> {selected.phone}</p>
              <p><span className="text-slate-500">Submitted:</span> {formatDateTime(selected.created_at)}</p>
              {selected.source_page && (
                <p><span className="text-slate-500">Source:</span> {selected.source_page}</p>
              )}
              <div>
                <p className="text-slate-500 mb-1">Message:</p>
                <pre className="whitespace-pre-wrap rounded-lg border border-white/10 bg-black/20 p-4 text-slate-200">
                  {selected.message}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
