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
  Video,
} from 'lucide-react';
import AdminShell from '../../components/AdminShell';
import MediaPlayer from '../../components/MediaPlayer';
import { apiRequest, apiUploadWithProgress } from '../../lib/api';
import { clearAuthSession, getStoredToken } from '../../lib/auth';

const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function DemoVideoManagement() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [title, setTitle] = useState('');
  const [displayOrder, setDisplayOrder] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [viewVideo, setViewVideo] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const loadVideos = useCallback(
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
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(limit),
        });
        if (search.trim()) params.set('search', search.trim());

        const data = await apiRequest(`/api/demo-videos?${params.toString()}`, { token });
        setRows(data.rows || []);
        setTotal(data.total || 0);
      } catch (err) {
        if (err.status === 401) {
          clearAuthSession();
          navigate('/login', { replace: true });
          return;
        }
        setError(err.data?.message || 'Unable to load demo videos.');
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search, navigate]
  );

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const openCreate = () => {
    setTitle('');
    setDisplayOrder('');
    setVideoFile(null);
    setUploadProgress(0);
    setModal('create');
  };

  const openEdit = (row) => {
    setTitle(row.title);
    setDisplayOrder(String(row.display_order));
    setVideoFile(null);
    setUploadProgress(0);
    setModal({ type: 'edit', id: row.id });
  };

  const validateVideoFile = (file) => {
    if (!file) return null;
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return 'Only MP4, MOV, and WebM formats are supported.';
    }
    return null;
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    const validationError = validateVideoFile(file);
    if (validationError) {
      setError(validationError);
      event.target.value = '';
      return;
    }
    setVideoFile(file);
    setError('');
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const token = getStoredToken();
    if (!token) return;

    if (!title.trim()) {
      setError('Video title is required.');
      return;
    }

    if (modal === 'create' && !videoFile) {
      setError('Video file is required.');
      return;
    }

    const fileError = validateVideoFile(videoFile);
    if (fileError) {
      setError(fileError);
      return;
    }

    setSaving(true);
    setError('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      if (displayOrder.trim()) {
        formData.append('display_order', displayOrder.trim());
      }
      if (videoFile) {
        formData.append('video_file', videoFile);
      }

      if (modal === 'create') {
        await apiUploadWithProgress('/api/demo-videos/upload', {
          token,
          method: 'POST',
          formData,
          onProgress: setUploadProgress,
        });
        showToast('success', 'Demo video uploaded successfully.');
      } else {
        await apiUploadWithProgress(`/api/demo-videos/${modal.id}`, {
          token,
          method: 'PUT',
          formData,
          onProgress: setUploadProgress,
        });
        showToast('success', 'Demo video updated successfully.');
      }

      setModal(null);
      loadVideos(page);
    } catch (err) {
      setError(err.message || 'Save failed.');
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const token = getStoredToken();
    if (!token) return;

    try {
      await apiRequest(`/api/demo-videos/${deleteTarget.id}`, { token, method: 'DELETE' });
      showToast('success', 'Demo video deleted.');
      setDeleteTarget(null);
      loadVideos(page);
    } catch (err) {
      setError(err.message || 'Delete failed.');
    }
  };

  const inputClasses =
    'w-full px-3 py-2 bg-[#0f172a]/80 text-white border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40';

  return (
    <AdminShell title="Manage Demo Videos" subtitle="Upload and manage feature demonstration videos">
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
            loadVideos(1);
          }}
          className="grid gap-4 md:grid-cols-2 mb-6"
        >
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search video title..."
              className={`${inputClasses} pl-9`}
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
          >
            Search
          </button>
        </form>

        <div className="mb-6">
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            Upload Video
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
                <th className="px-4 py-3 font-semibold">Video Title</th>
                <th className="px-4 py-3 font-semibold">Video Preview</th>
                <th className="px-4 py-3 font-semibold">Video URL</th>
                <th className="px-4 py-3 font-semibold">Display Order</th>
                <th className="px-4 py-3 font-semibold">Created Date</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    Loading demo videos...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    No demo videos found.
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={row.id} className="border-t border-white/5 text-slate-300">
                    <td className="px-4 py-3">{(page - 1) * limit + index + 1}</td>
                    <td className="px-4 py-3 text-white font-medium">{row.title}</td>
                    <td className="px-4 py-3">
                      <video
                        src={row.video_url}
                        className="h-12 w-20 rounded-lg object-cover border border-white/10"
                        muted
                        preload="metadata"
                      />
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <a
                        href={row.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-300 hover:underline break-all"
                      >
                        {row.video_url}
                      </a>
                    </td>
                    <td className="px-4 py-3">{row.display_order}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(row.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setViewVideo(row)}
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

        <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
          <span>
            Page {page} of {totalPages} ({total} total)
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 disabled:opacity-40"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 disabled:opacity-40"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Upload / Edit modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => !saving && setModal(null)} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Video size={20} className="text-indigo-400" />
                {modal === 'create' ? 'Upload Demo Video' : 'Edit Demo Video'}
              </h2>
              <button
                type="button"
                onClick={() => !saving && setModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Video Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className={inputClasses}
                  placeholder="Introduction to Closed Circuit"
                />
              </div>

              {modal !== 'create' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Video File {modal === 'create' && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-500/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-300"
                />
                <p className="mt-1.5 text-xs text-slate-500">Supported: MP4, MOV, WebM</p>
              </div>

              {saving && uploadProgress > 0 && (
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : modal === 'create' ? 'Upload' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  disabled={saving}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View modal */}
      {viewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setViewVideo(null)} />
          <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">{viewVideo.title}</h2>
              <button type="button" onClick={() => setViewVideo(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <MediaPlayer src={viewVideo.video_url} title={viewVideo.title} loop={false} />
            <p className="mt-4 text-xs text-slate-500 break-all">{viewVideo.video_url}</p>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-2">Delete Demo Video</h2>
            <p className="text-sm text-slate-400 mb-6">
              Are you sure you want to delete &quot;{deleteTarget.title}&quot;? This will also remove the file from
              DigitalOcean Spaces.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-500/80 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
