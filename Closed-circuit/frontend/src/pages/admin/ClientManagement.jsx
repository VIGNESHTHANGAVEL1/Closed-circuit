import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import AdminShell from '../../components/AdminShell';
import ClientImageThumb from '../../components/ClientImageThumb';
import { apiFormRequest, apiRequest } from '../../lib/api';
import { clearAuthSession, getStoredToken } from '../../lib/auth';

const emptyForm = {
  name: '',
  mobile_number: '',
  email_id: '',
  address: '',
  client_type: 'b2b',
  business_type: '',
  onboard_date: '',
};

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-IN', { timeZone: 'UTC' });
}

export default function ClientManagement() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [clientType, setClientType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [viewClient, setViewClient] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const loadClients = useCallback(async (pageOverride) => {
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
      if (clientType) params.set('clientType', clientType);

      const data = await apiRequest(`/api/admin/clients?${params.toString()}`, { token });
      setRows(data.rows || []);
      setTotal(data.total || 0);
    } catch (err) {
      if (err.status === 401) {
        clearAuthSession();
        navigate('/login', { replace: true });
        return;
      }
      setError(err.data?.message || 'Unable to load clients.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, clientType, navigate]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const openCreate = () => {
    setForm(emptyForm);
    setLogoFile(null);
    setProfileFile(null);
    setEditRow(null);
    setModal('create');
  };

  const openEdit = (row) => {
    setEditRow(row);
    setForm({
      name: row.name,
      mobile_number: row.mobile_number,
      email_id: row.email_id,
      address: row.address || '',
      client_type: row.client_type,
      business_type: row.business_type,
      onboard_date: row.onboard_date?.slice?.(0, 10) || row.onboard_date || '',
    });
    setLogoFile(null);
    setProfileFile(null);
    setModal({ type: 'edit', id: row.id });
  };

  const buildFormData = () => {
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => fd.append(key, value));
    if (logoFile) fd.append('client_logo', logoFile);
    if (profileFile) fd.append('client_profile_pic', profileFile);
    return fd;
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const token = getStoredToken();
    if (!token) return;

    setSaving(true);
    setError('');

    try {
      const formData = buildFormData();
      if (modal === 'create') {
        await apiFormRequest('/api/admin/clients', { token, method: 'POST', formData });
        showToast('success', 'Client created successfully.');
      } else {
        await apiFormRequest(`/api/admin/clients/${modal.id}`, {
          token,
          method: 'PUT',
          formData,
        });
        showToast('success', 'Client updated successfully.');
      }
      setModal(null);
      loadClients(page);
    } catch (err) {
      setError(err.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const token = getStoredToken();
    if (!token) return;

    try {
      await apiRequest(`/api/admin/clients/${deleteTarget.id}`, { token, method: 'DELETE' });
      showToast('success', 'Client deleted.');
      setDeleteTarget(null);
      loadClients(page);
    } catch (err) {
      setError(err.message || 'Delete failed.');
    }
  };

  const inputClasses =
    'w-full px-3 py-2 bg-[#0f172a]/80 text-white border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40';

  return (
    <AdminShell title="Client Management" subtitle="Manage clients shown on the public website">
      {toast && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
            toast.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-red-500/30 bg-red-500/10 text-red-300'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-[#0f172a]/60 p-6 shadow-2xl backdrop-blur-xl"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            loadClients(1);
          }}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6"
        >
          <div className="xl:col-span-2 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, mobile, email, business type..."
              className={`${inputClasses} pl-9`}
            />
          </div>
          <select
            value={clientType}
            onChange={(e) => setClientType(e.target.value)}
            className={inputClasses}
          >
            <option value="">All types</option>
            <option value="b2b">B2B</option>
            <option value="b2c">B2C</option>
          </select>
          <button
            type="submit"
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
          >
            Apply Filters
          </button>
        </form>

        <div className="mb-6">
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            Add Client
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
                <th className="px-4 py-3 font-semibold">Logo</th>
                <th className="px-4 py-3 font-semibold">Profile</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Business</th>
                <th className="px-4 py-3 font-semibold">Onboard</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                    Loading clients...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                    No clients found.
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={row.id} className="border-t border-white/5 text-slate-300">
                    <td className="px-4 py-3">{(page - 1) * limit + index + 1}</td>
                    <td className="px-4 py-3">
                      <ClientImageThumb url={row.client_logo_url} variant="logo" alt={`${row.name} logo`} />
                    </td>
                    <td className="px-4 py-3">
                      <ClientImageThumb url={row.client_profile_pic_url} variant="profile" alt={`${row.name} profile`} />
                    </td>
                    <td className="px-4 py-3 text-white">{row.name}</td>
                    <td className="px-4 py-3 uppercase">{row.client_type}</td>
                    <td className="px-4 py-3">{row.business_type}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(row.onboard_date)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setViewClient(row)}
                          className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-xs text-indigo-300 hover:bg-white/5"
                        >
                          <Eye size={12} /> View
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(row)}
                          className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-xs text-amber-300 hover:bg-white/5"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(row)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2 py-1 text-xs text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            Showing {rows.length} of {total} clients
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

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/70" onClick={() => !saving && setModal(null)} />
          <form
            onSubmit={handleSave}
            className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl my-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {modal === 'create' ? 'Add Client' : 'Edit Client'}
              </h2>
              <button type="button" onClick={() => setModal(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ['name', 'Name', 'text'],
                  ['mobile_number', 'Mobile', 'text'],
                  ['email_id', 'Email', 'email'],
                  ['business_type', 'Business Type', 'text'],
                  ['onboard_date', 'Onboard Date', 'date'],
                  ['client_type', 'Client Type', 'select'],
                ].map(([key, label, type]) => (
                  <div key={key} className={key === 'name' || key === 'email_id' ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</label>
                    {type === 'select' ? (
                      <select
                        value={form.client_type}
                        onChange={(e) => setForm((f) => ({ ...f, client_type: e.target.value }))}
                        className={inputClasses}
                      >
                        <option value="b2b">B2B</option>
                        <option value="b2c">B2C</option>
                      </select>
                    ) : (
                      <input
                        type={type}
                        required={key !== 'address'}
                        value={form[key]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        className={inputClasses}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className={inputClasses}
                />
              </div>
              {modal !== 'create' && editRow && (
                <div className="flex items-center justify-center gap-8 py-2 border-b border-white/10">
                  <div className="text-center">
                    <p className="text-[10px] uppercase text-slate-500 mb-2">Current logo</p>
                    <ClientImageThumb url={editRow.client_logo_url} variant="logo" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase text-slate-500 mb-2">Current profile</p>
                    <ClientImageThumb url={editRow.client_profile_pic_url} variant="profile" />
                  </div>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Client Logo</label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-400 file:mr-2 file:rounded-lg file:border-0 file:bg-indigo-500/20 file:px-3 file:py-1.5 file:text-indigo-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Profile Picture</label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(e) => setProfileFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-400 file:mr-2 file:rounded-lg file:border-0 file:bg-indigo-500/20 file:px-3 file:py-1.5 file:text-indigo-300"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Client'}
            </button>
          </form>
        </div>
      )}

      {viewClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setViewClient(null)} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f172a] p-6">
            <div className="flex justify-between items-start mb-5">
              <h2 className="text-lg font-bold text-white pr-4">{viewClient.name}</h2>
              <button type="button" onClick={() => setViewClient(null)} className="text-slate-400 hover:text-white shrink-0">
                <X size={20} />
              </button>
            </div>
            <div className="flex items-center gap-6 mb-6 pb-5 border-b border-white/10">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Logo</p>
                <ClientImageThumb url={viewClient.client_logo_url} variant="logo" alt="" />
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Profile</p>
                <ClientImageThumb url={viewClient.client_profile_pic_url} variant="profile" alt="" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-300">
              <p><span className="text-slate-500 block text-xs">Mobile</span>{viewClient.mobile_number}</p>
              <p><span className="text-slate-500 block text-xs">Email</span>{viewClient.email_id}</p>
              <p><span className="text-slate-500 block text-xs">Type</span>{viewClient.client_type?.toUpperCase()}</p>
              <p><span className="text-slate-500 block text-xs">Business</span>{viewClient.business_type}</p>
              <p><span className="text-slate-500 block text-xs">Onboard</span>{formatDate(viewClient.onboard_date)}</p>
              {viewClient.address && (
                <p className="sm:col-span-2"><span className="text-slate-500 block text-xs">Address</span>{viewClient.address}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-[#0f172a] p-6 text-center">
            <p className="text-white font-semibold mb-2">Delete client?</p>
            <p className="text-sm text-slate-400 mb-6">
              Remove <strong className="text-white">{deleteTarget.name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
