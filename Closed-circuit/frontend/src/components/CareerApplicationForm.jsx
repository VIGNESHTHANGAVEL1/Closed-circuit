import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2, Upload } from 'lucide-react';
import Card from './Card';
import OtpVerificationModal from './OtpVerificationModal';
import { apiFormRequest, apiRequest, isApiEnabled } from '../lib/api';

const EDUCATION_OPTIONS = [
  '10th / SSLC',
  '12th / PUC',
  'Diploma',
  'Graduate',
  'Post Graduate',
  'Other',
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
];

const YES_NO_FIELDS = [
  { name: 'hasLaptop', label: 'Do you have a laptop?' },
  { name: 'hasMobilePhone', label: 'Do you have a mobile phone?' },
  { name: 'hasSeparateSim', label: 'Do you have a separate SIM card that can be used for work?' },
  { name: 'hasWorkstation', label: 'Do you have a proper workstation at home?' },
  { name: 'hasInternet', label: 'Do you have a reliable internet connection?' },
  { name: 'reviewedProduct', label: 'Have you fully gone through the Closed Circuit product and its features?' },
  { name: 'watchedProductVideo', label: 'Have you watched the Closed Circuit product video provided above?' },
  { name: 'watchedCareerVideo', label: 'Have you watched the Career Opportunity video completely?' },
];

function YesNoGroup({ name, label, value, onChange, disabled }) {
  return (
    <div>
      <p className="block font-semibold text-white mb-2 text-sm sm:text-base leading-relaxed">
        {label} <span className="text-indigo-400">*</span>
      </p>
      <div className="flex flex-wrap gap-4">
        {['Yes', 'No'].map((option) => (
          <label key={option} className={`inline-flex items-center gap-2 text-sm sm:text-base ${disabled ? 'opacity-50' : ''}`}>
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={onChange}
              disabled={disabled}
              className="accent-indigo-500"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function CareerApplicationForm() {
  const initialFormData = {
    fullName: '',
    emailId: '',
    mobileNumber: '',
    latestEducation: '',
    currentLocation: '',
    city: '',
    district: '',
    state: '',
    salesExperience: '',
    callsPerDay: '',
    closuresPerDay: '',
    languages: '',
    hasLaptop: '',
    hasMobilePhone: '',
    hasSeparateSim: '',
    hasWorkstation: '',
    hasInternet: '',
    reviewedProduct: '',
    watchedProductVideo: '',
    watchedCareerVideo: '',
    productUnderstanding: '',
    declarationAccepted: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [resumeFile, setResumeFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [emailVerificationToken, setEmailVerificationToken] = useState('');
  const [mobileVerificationToken, setMobileVerificationToken] = useState('');
  const [emailVerifyStatus, setEmailVerifyStatus] = useState(null);
  const [mobileVerifyStatus, setMobileVerifyStatus] = useState(null);
  const [emailVerifyMessage, setEmailVerifyMessage] = useState('');
  const [mobileVerifyMessage, setMobileVerifyMessage] = useState('');
  const [otpModal, setOtpModal] = useState(null);
  const [emailSendingOtp, setEmailSendingOtp] = useState(false);
  const [mobileSendingOtp, setMobileSendingOtp] = useState(false);
  const emailVerifyInProgress = useRef(false);
  const mobileVerifyInProgress = useRef(false);

  const useBackendApi = isApiEnabled();
  const isValidMobile = (value) => String(value || '').replace(/\D/g, '').length === 10;
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
  const hasFullName = Boolean(formData.fullName.trim());

  const canEnterEmail = hasFullName;
  const canVerifyEmail = hasFullName && isValidEmail(formData.emailId) && !emailVerified;
  const canEnterMobile = emailVerified;
  const canVerifyMobile = emailVerified && isValidMobile(formData.mobileNumber) && !mobileVerified;
  const canEnterDetails = mobileVerified && emailVerified;
  const bothVerified = !useBackendApi || (mobileVerified && emailVerified);

  const allRequiredComplete =
    hasFullName &&
    isValidEmail(formData.emailId) &&
    isValidMobile(formData.mobileNumber) &&
    Boolean(formData.latestEducation) &&
    Boolean(formData.currentLocation.trim()) &&
    Boolean(formData.city.trim()) &&
    Boolean(formData.district.trim()) &&
    Boolean(formData.state) &&
    Boolean(formData.salesExperience.trim()) &&
    Boolean(formData.callsPerDay.trim()) &&
    Boolean(formData.closuresPerDay.trim()) &&
    Boolean(formData.languages.trim()) &&
    YES_NO_FIELDS.every(({ name }) => formData[name] === 'Yes' || formData[name] === 'No') &&
    Boolean(formData.productUnderstanding.trim()) &&
    Boolean(resumeFile);

  const canSubmit = formData.declarationAccepted && allRequiredComplete && bothVerified;

  const labelClasses = 'block font-semibold text-white mb-1.5 text-sm sm:text-base leading-relaxed';
  const inputClasses =
    'w-full px-4 py-3 bg-[#0f172a]/50 text-white border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-semibold placeholder-slate-500 disabled:cursor-not-allowed disabled:opacity-50 text-sm sm:text-base leading-relaxed';
  const verifyButtonClasses = (verified) =>
    verified
      ? 'shrink-0 rounded-xl border border-green-500/40 bg-green-500/20 px-4 py-3 text-sm font-semibold text-green-300 w-full sm:w-auto'
      : 'shrink-0 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-3 text-sm font-semibold text-indigo-200 transition hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 w-full sm:w-auto';

  const resetEmailVerification = () => {
    setEmailOtp('');
    setEmailOtpSent(false);
    setEmailVerified(false);
    setEmailVerificationToken('');
    setEmailVerifyStatus(null);
    setEmailVerifyMessage('');
    setEmailSendingOtp(false);
  };

  const resetMobileVerification = () => {
    setMobileOtp('');
    setMobileOtpSent(false);
    setMobileVerified(false);
    setMobileVerificationToken('');
    setMobileVerifyStatus(null);
    setMobileVerifyMessage('');
    setMobileSendingOtp(false);
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    let nextValue = type === 'checkbox' ? checked : value;

    if (name === 'mobileNumber') {
      nextValue = String(value).replace(/\D/g, '').slice(0, 10);
    }

    setFormData((prev) => {
      const next = { ...prev, [name]: nextValue };
      if (name === 'fullName' && nextValue !== prev.fullName) {
        resetEmailVerification();
        resetMobileVerification();
      }
      if (name === 'emailId' && nextValue !== prev.emailId) {
        resetEmailVerification();
        resetMobileVerification();
      }
      if (name === 'mobileNumber' && nextValue !== prev.mobileNumber) {
        resetMobileVerification();
      }
      return next;
    });
  };

  const sendEmailOtp = async () => {
    setEmailSendingOtp(true);
    setEmailVerifyStatus(null);
    setEmailVerifyMessage('');
    try {
      await apiRequest('/api/verification/email/send', {
        method: 'POST',
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          emailId: formData.emailId.trim(),
          verificationFlow: 'careers',
        }),
      });
      setEmailOtpSent(true);
    } catch (err) {
      setEmailVerifyStatus('error');
      setEmailVerifyMessage(err.message || 'Unable to send email OTP.');
    } finally {
      setEmailSendingOtp(false);
    }
  };

  const sendMobileOtp = async () => {
    setMobileSendingOtp(true);
    setMobileVerifyStatus(null);
    setMobileVerifyMessage('');
    try {
      await apiRequest('/api/verification/mobile/send', {
        method: 'POST',
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          mobileNumber: formData.mobileNumber.trim(),
          emailId: formData.emailId.trim(),
          emailVerificationToken,
          verificationFlow: 'careers',
          clientOrigin: typeof window !== 'undefined' ? window.location.origin : '',
        }),
      });
      setMobileOtpSent(true);
    } catch (err) {
      setMobileVerifyStatus('error');
      setMobileVerifyMessage(err.message || 'Unable to send mobile OTP.');
    } finally {
      setMobileSendingOtp(false);
    }
  };

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
  }, [emailOtp, emailVerifyStatus, formData.emailId]);

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
  }, [formData.mobileNumber, mobileOtp, mobileVerifyStatus]);

  useEffect(() => {
    if (otpModal === 'email' && emailOtpSent && !emailVerified && /^\d{6}$/.test(emailOtp.trim())) {
      confirmEmailOtp();
    }
  }, [otpModal, emailOtp, emailOtpSent, emailVerified, confirmEmailOtp]);

  useEffect(() => {
    if (otpModal === 'mobile' && mobileOtpSent && !mobileVerified && /^\d{4}$/.test(mobileOtp.trim())) {
      confirmMobileOtp();
    }
  }, [otpModal, mobileOtp, mobileOtpSent, mobileVerified, confirmMobileOtp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!useBackendApi) {
      setStatus('error');
      setMessage('Applications require backend API configuration.');
      return;
    }
    if (!canSubmit) {
      setStatus('error');
      setMessage('Please complete all fields and verifications before submitting.');
      return;
    }

    setStatus('loading');
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'declarationAccepted') {
          payload.append(key, value ? 'true' : 'false');
        } else {
          payload.append(key, value ?? '');
        }
      });
      payload.append('mobileVerificationToken', mobileVerificationToken);
      payload.append('emailVerificationToken', emailVerificationToken);
      payload.append('resume', resumeFile);

      const response = await apiFormRequest('/api/careers', { formData: payload });
      setStatus('success');
      setMessage(response.message || 'Your application has been submitted successfully.');
      setFormData(initialFormData);
      setResumeFile(null);
      resetEmailVerification();
      resetMobileVerification();
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Unable to submit your application.');
    }
  };

  return (
    <>
      <Card className="p-4 md:p-6 border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01]">
        {status === 'success' ? (
          <div className="text-center py-12">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-400" />
            <h3 className="text-2xl font-display font-bold text-white mb-3">Application Submitted</h3>
            <p className="text-base sm:text-lg text-slate-400">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">Candidate Application Form</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Full Name <span className="text-indigo-400">*</span></label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} className={inputClasses} required />
              </div>
              <div>
                <label className={labelClasses}>Email Address <span className="text-indigo-400">*</span></label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input name="emailId" type="email" value={formData.emailId} onChange={handleChange} disabled={!canEnterEmail} className={`${inputClasses} flex-1`} required />
                  <button type="button" disabled={!canVerifyEmail} onClick={async () => { setOtpModal('email'); if (!emailOtpSent) await sendEmailOtp(); }} className={verifyButtonClasses(emailVerified)}>
                    {emailVerified ? 'Verified' : 'Verify Email'}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClasses}>Mobile Number <span className="text-indigo-400">*</span></label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} disabled={!canEnterMobile} className={`${inputClasses} flex-1`} required />
                  <button type="button" disabled={!canVerifyMobile} onClick={async () => { setOtpModal('mobile'); if (!mobileOtpSent) await sendMobileOtp(); }} className={verifyButtonClasses(mobileVerified)}>
                    {mobileVerified ? 'Verified' : 'Verify Mobile'}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClasses}>Latest Educational Qualification <span className="text-indigo-400">*</span></label>
                <select name="latestEducation" value={formData.latestEducation} onChange={handleChange} disabled={!canEnterDetails} className={inputClasses} required>
                  <option value="">Select qualification</option>
                  {EDUCATION_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClasses}>Current Location <span className="text-indigo-400">*</span></label>
                <input name="currentLocation" value={formData.currentLocation} onChange={handleChange} disabled={!canEnterDetails} className={inputClasses} required />
              </div>
              <div>
                <label className={labelClasses}>City <span className="text-indigo-400">*</span></label>
                <input name="city" value={formData.city} onChange={handleChange} disabled={!canEnterDetails} className={inputClasses} required />
              </div>
              <div>
                <label className={labelClasses}>District <span className="text-indigo-400">*</span></label>
                <input name="district" value={formData.district} onChange={handleChange} disabled={!canEnterDetails} className={inputClasses} required />
              </div>
              <div>
                <label className={labelClasses}>State <span className="text-indigo-400">*</span></label>
                <select name="state" value={formData.state} onChange={handleChange} disabled={!canEnterDetails} className={inputClasses} required>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
              <h4 className="font-semibold text-white text-base sm:text-lg">Experience & Sales Capability</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Sales / Telecalling Experience <span className="text-indigo-400">*</span></label>
                  <input name="salesExperience" value={formData.salesExperience} onChange={handleChange} disabled={!canEnterDetails} className={inputClasses} required />
                </div>
                <div>
                  <label className={labelClasses}>Telephonic calls per day <span className="text-indigo-400">*</span></label>
                  <input name="callsPerDay" value={formData.callsPerDay} onChange={handleChange} disabled={!canEnterDetails} className={inputClasses} required />
                </div>
                <div>
                  <label className={labelClasses}>Customers you can close per day <span className="text-indigo-400">*</span></label>
                  <input name="closuresPerDay" value={formData.closuresPerDay} onChange={handleChange} disabled={!canEnterDetails} className={inputClasses} required />
                </div>
                <div>
                  <label className={labelClasses}>Languages you can communicate in <span className="text-indigo-400">*</span></label>
                  <input name="languages" value={formData.languages} onChange={handleChange} disabled={!canEnterDetails} className={inputClasses} required />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
              <h4 className="font-semibold text-white text-base sm:text-lg">Work From Home Requirements</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {YES_NO_FIELDS.slice(0, 5).map(({ name, label }) => (
                  <YesNoGroup key={name} name={name} label={label} value={formData[name]} onChange={handleChange} disabled={!canEnterDetails} />
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
              <h4 className="font-semibold text-white text-base sm:text-lg">Product Understanding</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {YES_NO_FIELDS.slice(5).map(({ name, label }) => (
                  <YesNoGroup key={name} name={name} label={label} value={formData[name]} onChange={handleChange} disabled={!canEnterDetails} />
                ))}
              </div>
              <div>
                <label className={labelClasses}>Explain what you understand about Closed Circuit <span className="text-indigo-400">*</span></label>
                <textarea name="productUnderstanding" rows={4} value={formData.productUnderstanding} onChange={handleChange} disabled={!canEnterDetails} className={inputClasses} required />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Resume / CV (PDF, DOC, DOCX — max 5MB) <span className="text-indigo-400">*</span></label>
              <label className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/15 bg-[#0f172a]/40 px-4 py-4 ${!canEnterDetails ? 'opacity-50 pointer-events-none' : ''}`}>
                <Upload size={20} className="text-indigo-300" />
                <span className="text-sm sm:text-base text-slate-300">{resumeFile ? resumeFile.name : 'Choose resume file'}</span>
                <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" disabled={!canEnterDetails} onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
              </label>
            </div>

            <label className={`flex items-start gap-3 text-sm sm:text-base leading-relaxed ${!canEnterDetails ? 'opacity-50' : ''}`}>
              <input type="checkbox" name="declarationAccepted" checked={formData.declarationAccepted} onChange={handleChange} disabled={!canEnterDetails} className="mt-1 accent-indigo-500" />
              <span>
                I confirm that the information provided by me is accurate and complete. I understand the nature of the
                Inside Sales Executive position, have reviewed the product information, watched the relevant videos, and
                accept the responsibilities and expectations associated with this role.
              </span>
            </label>

            {status === 'error' && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <AlertCircle size={16} /> {message}
              </div>
            )}

            <button type="submit" disabled={!canSubmit || status === 'loading'} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm sm:text-base font-bold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50">
              {status === 'loading' ? <><Loader2 className="animate-spin" size={18} /> Submitting...</> : <><Send size={18} /> Submit Application</>}
            </button>
          </form>
        )}
      </Card>

      <OtpVerificationModal
        isOpen={otpModal === 'email'}
        channel="email"
        destination={formData.emailId.trim() || 'your@email.com'}
        value={emailOtp}
        onChange={(value) => setEmailOtp(value.replace(/\D/g, '').slice(0, 6))}
        onVerify={confirmEmailOtp}
        onResend={sendEmailOtp}
        onClose={() => setOtpModal(null)}
        verifyStatus={emailVerifyStatus}
        verifyMessage={emailVerifyMessage}
        sendingOtp={emailSendingOtp}
        otpSent={emailOtpSent}
      />

      <OtpVerificationModal
        isOpen={otpModal === 'mobile'}
        channel="mobile"
        destination={formData.mobileNumber ? `+91 ${formData.mobileNumber}` : '+91 XXXXX XXXXX'}
        value={mobileOtp}
        onChange={(value) => setMobileOtp(value.replace(/\D/g, '').slice(0, 4))}
        onVerify={confirmMobileOtp}
        onResend={sendMobileOtp}
        onClose={() => setOtpModal(null)}
        verifyStatus={mobileVerifyStatus}
        verifyMessage={mobileVerifyMessage}
        sendingOtp={mobileSendingOtp}
        otpSent={mobileOtpSent}
      />
    </>
  );
}