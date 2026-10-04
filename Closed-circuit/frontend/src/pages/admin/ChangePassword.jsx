import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import AdminShell from '../../components/AdminShell';
import { apiRequest } from '../../lib/api';
import { clearAuthSession, getStoredToken, getStoredUser } from '../../lib/auth';
import { ADMIN_ROLES, normalizeRole } from '../../lib/adminPermissions';

const ROLE_ACCOUNTS = [
  { username: 'admin', label: 'Admin' },
  { username: 'ise', label: 'ISE — Inside Sales Executive' },
  { username: 'hr', label: 'HR' },
  { username: 'webinar_admin', label: 'Webinar Admin' },
];

function PasswordField({ label, name, value, onChange, show, onToggle, autoComplete }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          required
          autoComplete={autoComplete}
          className="w-full px-3 py-2 pr-10 bg-[#0f172a]/80 text-white border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 text-white"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePassword() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const isAdmin = normalizeRole(user?.role) === ADMIN_ROLES.ADMIN;
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [rolePasswords, setRolePasswords] = useState(() =>
    Object.fromEntries(ROLE_ACCOUNTS.map(({ username }) => [username, '']))
  );
  const [roleSaving, setRoleSaving] = useState(null);

  const handleRolePasswordSave = async (username) => {
    const token = getStoredToken();
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const newPassword = rolePasswords[username];
    if (!newPassword || newPassword.length < 8) {
      setFeedback({ type: 'error', message: 'Each new password must be at least 8 characters.' });
      return;
    }

    setRoleSaving(username);
    setFeedback(null);
    try {
      const data = await apiRequest('/api/admin/role-password', {
        token,
        method: 'POST',
        body: JSON.stringify({ username, newPassword }),
      });
      setFeedback({ type: 'success', message: data.message || 'Password updated.' });
      setRolePasswords((prev) => ({ ...prev, [username]: '' }));
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.data?.message || 'Unable to update role password.',
      });
    } finally {
      setRoleSaving(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = getStoredToken();

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'New password and confirm password must match.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const data = await apiRequest('/api/admin/change-password', {
        token,
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      setFeedback({ type: 'success', message: data.message || 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.status === 401) {
        clearAuthSession();
        navigate('/login', { replace: true });
        return;
      }
      setFeedback({
        type: 'error',
        message: err.data?.message || 'Password update failed.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell title="Change Password" subtitle="Manage admin and role account passwords">
      {feedback && (
        <div
          className={`mb-6 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-red-500/30 bg-red-500/10 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {feedback.message}
        </div>
      )}

      {isAdmin && (
        <div className="mb-8 max-w-2xl rounded-2xl border border-white/10 bg-[#0f172a]/60 p-6 shadow-2xl backdrop-blur-xl space-y-5">
          <h2 className="text-lg font-bold text-white">Role account passwords</h2>
          <p className="text-sm text-slate-400">
            Fixed usernames: <span className="text-slate-200">admin</span>,{' '}
            <span className="text-slate-200">ise</span>, <span className="text-slate-200">hr</span>,{' '}
            <span className="text-slate-200">webinar_admin</span>. Set a new password for each role without
            the current password.
          </p>
          {ROLE_ACCOUNTS.map(({ username, label }) => (
            <div key={username} className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-white mb-1.5">{label}</label>
                <input
                  type="password"
                  value={rolePasswords[username]}
                  onChange={(e) =>
                    setRolePasswords((prev) => ({ ...prev, [username]: e.target.value }))
                  }
                  placeholder={`New password for ${username}`}
                  className="w-full px-3 py-2 bg-[#0f172a]/80 text-white border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>
              <button
                type="button"
                disabled={roleSaving === username}
                onClick={() => handleRolePasswordSave(username)}
                className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-60"
              >
                {roleSaving === username ? 'Saving…' : 'Update'}
              </button>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-md rounded-2xl border border-white/10 bg-[#0f172a]/60 p-6 shadow-2xl backdrop-blur-xl space-y-4"
      >
        <h2 className="text-lg font-bold text-white">Your admin password</h2>
        <PasswordField
          label="Current Password"
          name="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          show={showCurrent}
          onToggle={() => setShowCurrent((v) => !v)}
          autoComplete="current-password"
        />
        <PasswordField
          label="New Password"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          show={showNew}
          onToggle={() => setShowNew((v) => !v)}
          autoComplete="new-password"
        />
        <PasswordField
          label="Confirm New Password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          show={showConfirm}
          onToggle={() => setShowConfirm((v) => !v)}
          autoComplete="new-password"
        />

        <p className="text-xs text-white leading-relaxed">
          Your username stays the same. Passwords are stored securely and are never shown in logs
          or exports.
        </p>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-60"
        >
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </AdminShell>
  );
}
