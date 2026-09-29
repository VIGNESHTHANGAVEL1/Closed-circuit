import { useState, useRef, useCallback } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Card from '../Card';
import OtpVerificationModal from '../OtpVerificationModal';
import StarRatingInput from './StarRatingInput';
import { INDIAN_STATES } from '../careers/careerFormConstants';
import { apiRequest, isApiEnabled } from '../../lib/api';

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getWebinarDateBounds() {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() - 3);
  return {
    min: formatDateInput(minDate),
    max: formatDateInput(today),
  };
}

export default function WebinarParticipationForm({ onSubmitted }) {
  const dateBounds = getWebinarDateBounds();
  const initialFormData = {
    fullName: '',
    mobileNumber: '',
    emailId: '',
    branch: '',
    yearOfPassout: '',
    college: '',
    university: '',
    city: '',
    state: '',
    pinCode: '',
    webinarAttendanceDate: '',
    reviewComment: '',
    rating: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerificationToken, setMobileVerificationToken] = useState('');
  const [emailVerificationToken, setEmailVerificationToken] = useState('');
  const [mobileVerifyStatus, setMobileVerifyStatus] = useState(null);
  const [emailVerifyStatus, setEmailVerifyStatus] = useState(null);
  const [mobileVerifyMessage, setMobileVerifyMessage] = useState('');
  const [emailVerifyMessage, setEmailVerifyMessage] = useState('');
  const [otpModal, setOtpModal] = useState(null);
  const [mobileSendingOtp, setMobileSendingOtp] = useState(false);
  const [emailSendingOtp, setEmailSendingOtp] = useState(false);
  const mobileVerifyInProgress = useRef(false);
  const emailVerifyInProgress = useRef(false);
  const mobileSendInProgress = useRef(false);
  const emailSendInProgress = useRef(false);

  const useBackendApi = isApiEnabled();
  const isValidMobile = (value) => String(value || '').replace(/\D/g, '').length === 10;
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
  const hasFullName = Boolean(formData.fullName.trim());

  const canEnterMobile = hasFullName;
  const canVerifyMobile = hasFullName && isValidMobile(formData.mobileNumber) && !mobileVerified;
  const canEnterEmail = useBackendApi ? mobileVerified : canEnterMobile && isValidMobile(formData.mobileNumber);
  const canVerifyEmail = mobileVerified && isValidEmail(formData.emailId) && !emailVerified;
  const canEnterDetails = useBackendApi ? emailVerified : canEnterEmail && isValidEmail(formData.emailId);
  const bothVerified = !useBackendApi || (mobileVerified && emailVerified);

  const allRequiredComplete =
    hasFullName &&
    isValidMobile(formData.mobileNumber) &&
    isValidEmail(formData.emailId) &&
    Boolean(formData.branch.trim()) &&
    Boolean(formData.yearOfPassout.trim()) &&
    Boolean(formData.college.trim()) &&
    Boolean(formData.university.trim()) &&
    Boolean(formData.city.trim()) &&
    Boolean(formData.state) &&
    String(formData.pinCode).replace(/\D/g, '').length === 6 &&
    Boolean(formData.webinarAttendanceDate);

  const canSubmit = allRequiredComplete && bothVerified;

  const labelClasses = 'block font-semibold text-white mb-1.5 text-sm sm:text-base';
  const inputClasses =
    'w-full px-4 py-3 bg-[#0f172a]/50 text-white border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-semibold placeholder-slate-500 disabled:cursor-not-allowed disabled:opacity-50 text-sm sm:text-base';
  const verifyButtonClasses = (verified) =>
    verified
      ? 'shrink-0 rounded-xl border border-green-500/40 bg-green-500/20 px-4 py-3 text-sm font-semibold text-green-300 w-full sm:w-auto'
      : 'shrink-0 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-3 text-sm font-semibold text-indigo-200 transition hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 w-full sm:w-auto';

  const resetMobileVerification = () => {
    setMobileOtp('');
    setMobileOtpSent(false);
    setMobileVerified(false);
    setMobileVerificationToken('');
    setMobileVerifyStatus(null);
    setMobileVerifyMessage('');
    setMobileSendingOtp(false);
  };

  const resetEmailVerification = () => {
    setEmailOtp('');
    setEmailOtpSent(false);
    setEmailVerified(false);
    setEmailVerificationToken('');
    setEmailVerifyStatus(null);
    setEmailVerifyMessage('');
    setEmailSendingOtp(false);
  };

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    let nextValue = value;

    if (name === 'mobileNumber') {
      nextValue = String(value).replace(/\D/g, '').slice(0, 10);
    }
    if (name === 'pinCode') {
      nextValue = String(value).replace(/\D/g, '').slice(0, 6);
    }

    setFormData((prev) => {
      const next = { ...prev, [name]: nextValue };
      if (name === 'fullName' && nextValue !== prev.fullName) {
        resetMobileVerification();
        resetEmailVerification();
      }
      if (name === 'mobileNumber' && nextValue !== prev.mobileNumber) {
        resetMobileVerification();
        resetEmailVerification();
      }
      if (name === 'emailId' && nextValue !== prev.emailId) {
        resetEmailVerification();
      }
      return next;
    });
  };

  const handleRatingChange = (value) => {
    setFormData((prev) => ({ ...prev, rating: value }));
  };

  const sendMobileOtp = async () => {
    if (mobileSendInProgress.current) return;
    mobileSendInProgress.current = true;
    setMobileSendingOtp(true);
    setMobileVerifyStatus(null);
    setMobileVerifyMessage('');
    try {
      await apiRequest('/api/verification/mobile/send', {
        method: 'POST',
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          mobileNumber: formData.mobileNumber.trim(),
          clientOrigin: typeof window !== 'undefined' ? window.location.origin : '',
        }),
      });
      setMobileOtpSent(true);
    } catch (err) {
      setMobileVerifyStatus('error');
      setMobileVerifyMessage(err.message || 'Unable to send mobile OTP.');
    } finally {
      mobileSendInProgress.current = false;
      setMobileSendingOtp(false);
    }
  };

  const sendEmailOtp = async () => {
    if (emailSendInProgress.current) return;
    emailSendInProgress.current = true;
    setEmailSendingOtp(true);
    setEmailVerifyStatus(null);
    setEmailVerifyMessage('');
    try {
      await apiRequest('/api/verification/email/send', {
        method: 'POST',
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          emailId: formData.emailId.trim(),
          mobileNumber: formData.mobileNumber.trim(),
        }),
      });
      setEmailOtpSent(true);
    } catch (err) {
      setEmailVerifyStatus('error');
      setEmailVerifyMessage(err.message || 'Unable to send email OTP.');
    } finally {
      emailSendInProgress.current = false;
      setEmailSendingOtp(false);
    }
  };

  const confirmMobileOtp = useCallback(async () => {
    if (mobileVerifyInProgress.current || mobileVerifyStatus === 'loading') return;
    if (!/^\d{4}$/.test(mobileOtp.trim())) {
      setMobileVerifyStatus('error');
      setMobileVerifyMessage('Please enter the 4-digit OTP.');
      return;
    }
    mobileVerifyInProgress.current = true;
    setMobileVerifyStatus('loading');
    try {
      const response = await apiRequest('/api/verification/mobile/verify', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber: formData.mobileNumber.trim(), otp: mobileOtp.trim() }),
      });
      setMobileVerified(true);
      setMobileVerificationToken(response.mobileVerificationToken || '');
      setMobileVerifyStatus('success');
      setOtpModal(null);
      setMobileOtp('');
    } catch (err) {
      setMobileVerifyStatus('error');
      setMobileVerifyMessage(err.message || 'Invalid OTP.');
    } finally {
      mobileVerifyInProgress.current = false;
    }
  }, [formData.mobileNumber, mobileOtp]);

  const confirmEmailOtp = useCallback(async () => {
    if (emailVerifyInProgress.current || emailVerifyStatus === 'loading') return;
    if (!/^\d{6}$/.test(emailOtp.trim())) {
      setEmailVerifyStatus('error');
      setEmailVerifyMessage('Please enter the 6-digit OTP.');
      return;
    }
    emailVerifyInProgress.current = true;
    setEmailVerifyStatus('loading');
    try {
      const response = await apiRequest('/api/verification/email/verify', {
        method: 'POST',
        body: JSON.stringify({ emailId: formData.emailId.trim(), otp: emailOtp.trim() }),
      });
      setEmailVerified(true);
      setEmailVerificationToken(response.emailVerificationToken || '');
      setEmailVerifyStatus('success');
      setOtpModal(null);
      setEmailOtp('');
    } catch (err) {
      setEmailVerifyStatus('error');
      setEmailVerifyMessage(err.message || 'Invalid OTP.');
    } finally {
      emailVerifyInProgress.current = false;
    }
  }, [emailOtp, formData.emailId]);

  const openMobileVerification = async () => {
    if (!canVerifyMobile) return;
    setOtpModal('mobile');
    setMobileOtp('');
    if (!mobileOtpSent) await sendMobileOtp();
  };

  const openEmailVerification = async () => {
    if (!canVerifyEmail) return;
    setOtpModal('email');
    setEmailOtp('');
    if (!emailOtpSent) await sendEmailOtp();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!useBackendApi) {
      setStatus('error');
      setMessage('Participation requires backend API configuration.');
      return;
    }
    if (!canSubmit) {
      setStatus('error');
      setMessage('Please complete all required fields and verifications.');
      return;
    }

    setStatus('loading');
    try {
      const payload = {
        ...formData,
        pinCode: String(formData.pinCode).replace(/\D/g, ''),
        rating: formData.rating === '' ? null : formData.rating,
        mobileVerificationToken,
        emailVerificationToken,
      };
      const response = await apiRequest('/api/entrepreneurship-webinar/participations', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setStatus('success');
      setMessage(response.message || 'Thank you for your participation.');
      setFormData(initialFormData);
      resetMobileVerification();
      resetEmailVerification();
      onSubmitted?.();
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Unable to submit participation.');
    }
  };

  return (
    <>
      <Card className="flex h-full flex-col border border-purple-500/30 bg-gradient-to-br from-[#071028] via-[#0A1025] to-[#111827] p-5 sm:p-6 md:p-8 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
        <div className="mb-4 inline-flex max-w-full rounded-full border border-purple-500/40 bg-[#0b1235] px-4 py-2">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-purple-200">
            Participation
          </span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Register Your Attendance</h2>
        <p className="mt-2 text-sm sm:text-base text-slate-400">
          Verify your mobile and email (same as Contact Us), then complete your details. Share an optional review to
          appear on the left panel.
        </p>

        {status === 'success' ? (
          <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
            <CheckCircle className="mb-4 h-12 w-12 text-green-400" />
            <p className="text-lg text-white font-semibold">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4 flex-1">
            <div>
              <label className={labelClasses}>Full Name *</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} className={inputClasses} required />
            </div>
            <div>
              <label className={labelClasses}>Mobile Number *</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  disabled={!canEnterMobile}
                  className={`${inputClasses} flex-1`}
                  required
                />
                <button type="button" disabled={!canVerifyMobile} onClick={openMobileVerification} className={verifyButtonClasses(mobileVerified)}>
                  {mobileVerified ? 'Verified' : 'Verify Mobile'}
                </button>
              </div>
            </div>
            <div>
              <label className={labelClasses}>Email Address *</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  name="emailId"
                  type="email"
                  value={formData.emailId}
                  onChange={handleChange}
                  disabled={!canEnterEmail}
                  className={`${inputClasses} flex-1`}
                  required
                />
                <button type="button" disabled={!canVerifyEmail} onClick={openEmailVerification} className={verifyButtonClasses(emailVerified)}>
                  {emailVerified ? 'Verified' : 'Verify Email'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Branch *</label>
                <input name="branch" value={formData.branch} onChange={handleChange} disabled={!canEnterDetails} className={inputClasses} required />
              </div>
              <div>
                <label className={labelClasses}>Year of Pass-out *</label>
                <input name="yearOfPassout" value={formData.yearOfPassout} onChange={handleChange} disabled={!canEnterDetails} className={inputClasses} required />
              </div>
              <div>
                <label className={labelClasses}>College *</label>
                <input name="college" value={formData.college} onChange={handleChange} disabled={!canEnterDetails} className={inputClasses} required />
              </div>
              <div>
                <label className={labelClasses}>University *</label>
                <input name="university" value={formData.university} onChange={handleChange} disabled={!canEnterDetails} className={inputClasses} required />
              </div>
              <div>
                <label className={labelClasses}>City *</label>
                <input name="city" value={formData.city} onChange={handleChange} disabled={!canEnterDetails} className={inputClasses} required />
              </div>
              <div>
                <label className={labelClasses}>State *</label>
                <select name="state" value={formData.state} onChange={handleChange} disabled={!canEnterDetails} className={inputClasses} required>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClasses}>PIN Code *</label>
                <input name="pinCode" value={formData.pinCode} onChange={handleChange} disabled={!canEnterDetails} className={inputClasses} required />
              </div>
              <div>
                <label className={labelClasses}>Webinar attendance date *</label>
                <input
                  type="date"
                  name="webinarAttendanceDate"
                  value={formData.webinarAttendanceDate}
                  onChange={handleChange}
                  min={dateBounds.min}
                  max={dateBounds.max}
                  disabled={!canEnterDetails}
                  className={`${inputClasses} [color-scheme:dark]`}
                  required
                />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
              <p className="text-sm font-semibold text-indigo-200">Optional feedback (shown publicly only if you add a review)</p>
              <div>
                <label className={labelClasses}>Your review</label>
                <textarea
                  name="reviewComment"
                  rows={4}
                  value={formData.reviewComment}
                  onChange={handleChange}
                  disabled={!canEnterDetails}
                  className={inputClasses}
                  placeholder="Share what you learned from the webinar…"
                />
              </div>
              <StarRatingInput value={formData.rating} onChange={handleRatingChange} disabled={!canEnterDetails} />
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <AlertCircle size={16} /> {message}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit || status === 'loading'}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm sm:text-base font-bold text-white disabled:opacity-50"
            >
              {status === 'loading' ? <><Loader2 className="animate-spin" size={18} /> Submitting…</> : <><Send size={18} /> Submit Participation</>}
            </button>
          </form>
        )}
      </Card>

      <OtpVerificationModal
        isOpen={otpModal === 'mobile'}
        channel="mobile"
        destination={formData.mobileNumber ? `+91 ${formData.mobileNumber}` : '+91 XXXXX XXXXX'}
        value={mobileOtp}
        onChange={(v) => setMobileOtp(v.replace(/\D/g, '').slice(0, 4))}
        onVerify={confirmMobileOtp}
        onResend={sendMobileOtp}
        onClose={() => setOtpModal(null)}
        verifyStatus={mobileVerifyStatus}
        verifyMessage={mobileVerifyMessage}
        sendingOtp={mobileSendingOtp}
        otpSent={mobileOtpSent}
      />
      <OtpVerificationModal
        isOpen={otpModal === 'email'}
        channel="email"
        destination={formData.emailId.trim() || 'your@email.com'}
        value={emailOtp}
        onChange={(v) => setEmailOtp(v.replace(/\D/g, '').slice(0, 6))}
        onVerify={confirmEmailOtp}
        onResend={sendEmailOtp}
        onClose={() => setOtpModal(null)}
        verifyStatus={emailVerifyStatus}
        verifyMessage={emailVerifyMessage}
        sendingOtp={emailSendingOtp}
        otpSent={emailOtpSent}
      />
    </>
  );
}
