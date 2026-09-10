import { useState, useEffect, useRef, useCallback } from 'react';
import { listenForWebOtp } from '../utils/webOtp';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Card from '../components/Card';
import OtpVerificationModal from '../components/OtpVerificationModal';
import { apiRequest, getGoogleScriptUrl, isApiEnabled } from '../lib/api';

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getAppointmentDateBounds() {
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 30);

  return {
    min: formatDateInput(today),
    max: formatDateInput(maxDate),
  };
}

export default function Contact() {
  const formatPreferredTime = (hour, minute, period) => {
    if (!hour || !minute || !period) {
      return '';
    }

    return `${hour}:${minute} ${period}`;
  };

  const initialFormData = {
    fullName: '',
    mobileNumber: '',
    emailId: '',
    town: '',
    state: '',
    country: '',
    lookingFor: '',
    preferredContactMethod: '',
    preferredDate: '',
    preferredTime: '',
    description: '',
     consentAccepted: false,
  };

  const [formData, setFormData] = useState({
    ...initialFormData,
  });

  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [preferredHour, setPreferredHour] = useState('');
  const [preferredMinute, setPreferredMinute] = useState('');
  const [preferredPeriod, setPreferredPeriod] = useState('');

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
  const [showMobileSuccessBanner, setShowMobileSuccessBanner] = useState(false);
  const [showEmailSuccessBanner, setShowEmailSuccessBanner] = useState(false);
  const mobileVerifyInProgress = useRef(false);
  const emailVerifyInProgress = useRef(false);

  const useBackendApi = isApiEnabled();
  const isValidMobile = (value) => {
    const digits = String(value || '').replace(/\D/g, '');
    return digits.length === 10;
  };
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
  const hasFullName = Boolean(formData.fullName.trim());
  const canEnterMobile = hasFullName;
  const canVerifyMobile = hasFullName && isValidMobile(formData.mobileNumber) && !mobileVerified;
  const canEnterEmail = useBackendApi ? mobileVerified : canEnterMobile && isValidMobile(formData.mobileNumber);
  const canVerifyEmail = mobileVerified && isValidEmail(formData.emailId) && !emailVerified;
  const canEnterTown = useBackendApi ? emailVerified : canEnterEmail && isValidEmail(formData.emailId);
  const canEnterState = Boolean(formData.town.trim());
  const canEnterCountry = Boolean(formData.state.trim());
  const canEnterLookingFor = Boolean(formData.country.trim());
  const canEnterPreferredContact = Boolean(formData.lookingFor);
  const canEnterPreferredDate = Boolean(formData.preferredContactMethod);
  const canEnterPreferredTime = Boolean(formData.preferredDate);
  const bothVerified = !useBackendApi || (mobileVerified && emailVerified);
  const allRequiredComplete =
    hasFullName &&
    isValidMobile(formData.mobileNumber) &&
    isValidEmail(formData.emailId) &&
    Boolean(formData.town.trim()) &&
    Boolean(formData.state.trim()) &&
    Boolean(formData.country.trim()) &&
    Boolean(formData.lookingFor) &&
    Boolean(formData.preferredContactMethod) &&
    Boolean(formData.preferredDate) &&
    Boolean(formData.preferredTime);
  const canSubmit = formData.consentAccepted && allRequiredComplete && bothVerified;

  const lookingForOptions = [
    'Gift for a Birthday',
    'Gift for a Marriage Anniversary',
    'Private Space for My Family',
    'Private Network for My Gated Community (RWA)',
    'Private Platform for My Educational Institute',
    'Private Platform for My Clinical Center',
    'Private Platform for My CA Firm',
    'Private Platform for My Law Firm',
    'Private Platform for My Wellness Center',
    'Private Platform for My Business Center',
    'Private Platform for My Realtor Company',
  ];

  const preferredContactMethods = ['Call', 'Chat', 'Google Meeting / Live Meeting'];
  const hourOptions = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'));
  const minuteOptions = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));
  const periodOptions = ['AM', 'PM'];

  // const callWindows = [
  //   'Mon to Fri, 10:00 AM to 1:00 PM IST for project scoping and onboarding calls.',
  //   'Sat, 11:30 AM to 2:30 PM IST for quick planning discussions and follow-ups.',
  //   'Best for detailed requirement conversations, pricing walkthroughs, and launch timelines.',
  // ];

  // const chatWindows = [
  //   'Daily, 9:00 AM to 9:00 PM IST for quick questions and first responses.',
  //   'Average reply time: 15 to 30 minutes during active support hours.',
  //   'Best for sharing ideas, collecting documents, and resolving small doubts quickly.',
  // ];

  const resetMobileVerification = () => {
    setMobileOtp('');
    setMobileOtpSent(false);
    setMobileVerified(false);
    setMobileVerificationToken('');
    setMobileVerifyStatus(null);
    setMobileVerifyMessage('');
    setMobileSendingOtp(false);
    setShowMobileSuccessBanner(false);
  };

  const resetEmailVerification = () => {
    setEmailOtp('');
    setEmailOtpSent(false);
    setEmailVerified(false);
    setEmailVerificationToken('');
    setEmailVerifyStatus(null);
    setEmailVerifyMessage('');
    setEmailSendingOtp(false);
    setShowEmailSuccessBanner(false);
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

  useEffect(() => {
    if (otpModal !== 'mobile' || !mobileOtpSent || mobileVerified) {
      return undefined;
    }

    const controller = new AbortController();
    listenForWebOtp({ signal: controller.signal }).then((code) => {
      if (code) {
        setMobileOtp(code.replace(/\D/g, '').slice(0, 4));
      }
    });

    return () => controller.abort();
  }, [otpModal, mobileOtpSent, mobileVerified]);

  const formatMobileDestination = (value) => {
    const digits = String(value || '').replace(/\D/g, '');
    if (!digits) {
      return '+91 XXXXX XXXXX';
    }

    if (digits.length <= 5) {
      return `+${digits}`;
    }

    const countryCode = digits.length > 10 ? digits.slice(0, digits.length - 10) : '91';
    const localNumber = digits.length > 10 ? digits.slice(-10) : digits;
    const grouped = `${localNumber.slice(0, 5)} ${localNumber.slice(5)}`.trim();
    return `+${countryCode} ${grouped}`;
  };

  const verifyButtonClasses = (verified) =>
    verified
      ? 'shrink-0 rounded-xl border border-green-500/40 bg-green-500/20 px-4 py-3 text-sm font-semibold text-green-300 transition disabled:cursor-not-allowed disabled:opacity-100 w-full sm:w-auto'
      : 'shrink-0 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-3 text-sm font-semibold text-indigo-200 transition hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 w-full sm:w-auto';

  const openMobileVerification = async () => {
    if (!canVerifyMobile) {
      return;
    }

    setOtpModal('mobile');
    setMobileOtp('');
    setMobileVerifyMessage('');

    if (!mobileOtpSent) {
      await sendMobileOtp();
    }
  };

  const openEmailVerification = async () => {
    if (!canVerifyEmail) {
      return;
    }

    setOtpModal('email');
    setEmailOtp('');
    setEmailVerifyMessage('');

    if (!emailOtpSent) {
      await sendEmailOtp();
    }
  };

  const closeOtpModal = () => {
    setOtpModal(null);
    setMobileVerifyMessage('');
    setEmailVerifyMessage('');
  };

  const resendMobileOtp = async () => {
    setMobileOtp('');
    setMobileVerifyMessage('');
    await sendMobileOtp();
  };

  const resendEmailOtp = async () => {
    setEmailOtp('');
    setEmailVerifyMessage('');
    await sendEmailOtp();
  };

  const sendMobileOtp = async () => {
    if (!hasFullName) {
      setMobileVerifyStatus('error');
      setMobileVerifyMessage('Please enter your name before mobile verification.');
      return;
    }

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
      setMobileSendingOtp(false);
    }
  };

  const confirmMobileOtp = useCallback(async () => {
    if (mobileVerifyInProgress.current || mobileVerifyStatus === 'loading') {
      return;
    }

    if (!/^\d{4}$/.test(mobileOtp.trim())) {
      setMobileVerifyStatus('error');
      setMobileVerifyMessage('Please enter the 4-digit OTP.');
      return;
    }

    mobileVerifyInProgress.current = true;
    setMobileVerifyStatus('loading');
    setMobileVerifyMessage('');

    try {
      const response = await apiRequest('/api/verification/mobile/verify', {
        method: 'POST',
        body: JSON.stringify({
          mobileNumber: formData.mobileNumber.trim(),
          otp: mobileOtp.trim(),
        }),
      });
      setMobileVerified(true);
      setMobileVerificationToken(response.mobileVerificationToken || '');
      setMobileVerifyStatus('success');
      setMobileVerifyMessage('Mobile verified successfully');
      setShowMobileSuccessBanner(true);
      setTimeout(() => setShowMobileSuccessBanner(false), 2500);
      setOtpModal(null);
      setMobileOtp('');
    } catch (err) {
      setMobileVerifyStatus('error');
      setMobileVerifyMessage(err.message || 'Invalid OTP. Please try again.');
    } finally {
      mobileVerifyInProgress.current = false;
    }
  }, [formData.mobileNumber, mobileOtp, mobileVerifyStatus]);

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
          mobileNumber: formData.mobileNumber.trim(),
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

  const confirmEmailOtp = useCallback(async () => {
    if (emailVerifyInProgress.current || emailVerifyStatus === 'loading') {
      return;
    }

    if (!/^\d{6}$/.test(emailOtp.trim())) {
      setEmailVerifyStatus('error');
      setEmailVerifyMessage('Please enter the 6-digit OTP.');
      return;
    }

    emailVerifyInProgress.current = true;
    setEmailVerifyStatus('loading');
    setEmailVerifyMessage('');

    try {
      const response = await apiRequest('/api/verification/email/verify', {
        method: 'POST',
        body: JSON.stringify({
          emailId: formData.emailId.trim(),
          otp: emailOtp.trim(),
        }),
      });
      setEmailVerified(true);
      setEmailVerificationToken(response.emailVerificationToken || '');
      setEmailVerifyStatus('success');
      setEmailVerifyMessage('Email verified successfully');
      setShowEmailSuccessBanner(true);
      setTimeout(() => setShowEmailSuccessBanner(false), 2500);
      setOtpModal(null);
      setEmailOtp('');
    } catch (err) {
      setEmailVerifyStatus('error');
      setEmailVerifyMessage(err.message || 'Invalid OTP. Please try again.');
    } finally {
      emailVerifyInProgress.current = false;
    }
  }, [emailOtp, emailVerifyStatus, formData.emailId]);

  const handleTimeChange = (field, value) => {
    const nextHour = field === 'hour' ? value : preferredHour;
    const nextMinute = field === 'minute' ? value : preferredMinute;
    const nextPeriod = field === 'period' ? value : preferredPeriod;

    if (field === 'hour') {
      setPreferredHour(value);
    }

    if (field === 'minute') {
      setPreferredMinute(value);
    }

    if (field === 'period') {
      setPreferredPeriod(value);
    }

    setFormData((prev) => ({
      ...prev,
      preferredTime: formatPreferredTime(nextHour, nextMinute, nextPeriod),
    }));
  };

  const submitToBackend = async (data) => {
    const { consentAccepted: _consentAccepted, ...contactFields } = data;

    const response = await apiRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        ...contactFields,
        mobileVerificationToken,
        emailVerificationToken,
      }),
    });

    if (import.meta.env.DEV) {
      console.log('[contact] API response:', response);
    }

    if (!response?.success) {
      throw new Error(response?.message || 'Unable to save your message.');
    }

    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (useBackendApi && !bothVerified) {
      setStatus('error');
      setMessage('Please complete mobile and email verification before submitting the enquiry.');
      return;
    }

    const { min: today, max: maxDate } = getAppointmentDateBounds();

    if (formData.preferredDate < today) {
      setStatus('error');
      setMessage('Preferred Date cannot be in the past.');
      return;
    }

    if (formData.preferredDate > maxDate) {
      setStatus('error');
      setMessage('Preferred Date must be within the next 30 days.');
      return;
    }

    setStatus('loading');

    try {
      const useBackendApi = isApiEnabled();
      const googleScriptUrl = getGoogleScriptUrl();

      if (!useBackendApi && !googleScriptUrl) {
        setStatus('error');
        setMessage(
          'Contact form is not configured. Set VITE_API_BASE_URL (or VITE_API_URL) for MySQL storage, or a valid VITE_GOOGLE_SCRIPT_URL for Google Sheets, then restart the app.'
        );
        return;
      }

      if (useBackendApi) {
        try {
          await submitToBackend(formData);
        } catch (err) {
          if (import.meta.env.DEV) {
            console.error('[contact] API error:', err);
          }
          setStatus('error');
          setMessage(err.message || 'An error occurred. Please check your connection and try again.');
          return;
        }
      } else {
        const payload = new URLSearchParams();
        for (const [key, value] of Object.entries(formData)) {
          payload.append(key, value ?? '');
        }

        const googleResponse = await fetch(googleScriptUrl, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: payload,
        });

        if (!googleResponse.ok) {
          throw new Error('Unable to save your message to Google Sheets.');
        }
      }

      setStatus('success');
      setMessage('Thank you! Your message has been received. We will contact you soon.');
      setFormData(initialFormData);
      setPreferredHour('');
      setPreferredMinute('');
      setPreferredPeriod('');
      resetMobileVerification();
      resetEmailVerification();
      setTimeout(() => setStatus(null), 5000);
    } catch {
      setStatus('error');
      setMessage('An error occurred. Please check your connection and try again.');
    }
  };

  const formFieldTextClasses = 'text-sm sm:text-base leading-relaxed';
  const labelClasses = `block font-semibold text-white mb-1.5 ${formFieldTextClasses}`;
  const inputClasses =
    `w-full px-4 py-3 bg-[#0f172a]/50 text-white border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-semibold placeholder-slate-500 disabled:cursor-not-allowed disabled:opacity-50 ${formFieldTextClasses}`;
  const selectOptionClasses = '[&>option]:bg-slate-900 [&>option]:text-white [&>option]:text-sm [&>option]:sm:text-base';
  const verifyFieldRowClasses = 'flex flex-col gap-1 sm:flex-row sm:items-stretch';
  const verifyInputClasses = `${inputClasses} min-w-0 flex-1`;
  const appointmentDateBounds = getAppointmentDateBounds();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#030712] text-slate-300"
    >
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#030712] via-[#0f172a] to-[#030712] text-white border-b border-white/5"
      >
        <div className="absolute inset-0 opacity-60">
          <div className="absolute -top-40 -left-20 h-96 w-96 rounded-full bg-indigo-500/30 blur-[120px]" />
          <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-purple-500/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 h-[300px] w-full bg-gradient-to-t from-black to-transparent z-10" />
        </div>

        <div className="relative z-20 page-container py-2 md:py-3 text-center">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-3 font-display font-bold leading-[1.1] tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
          >
            Address
          </motion.h1>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="mx-auto mt-3 max-w-3xl text-slate-400 font-normal text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed"
          >
            <div>Closed Circuit AI Pvt Ltd,</div>
            <div>3rd Floor, Under Collab Cubicles Section, Brigade IRV Center</div>
            <div>Nallurhalli, Whitefield, Bengaluru – 560066</div>
            <div>
              Email: cc@closedcircuit.in, Mobile: +91 82175 43446
            </div>
            <div>
              Google Map :{' '}
              <a
                href="https://maps.app.goo.gl/cZ67tsC2ryFeegSg6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              >
                https://maps.app.goo.gl/cZ67tsC2ryFeegSg6
              </a>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-6 md:mt-8 font-display font-bold leading-[1.1] tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
          >
            Talk to Our Team
          </motion.h1>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="mx-auto mt-3 max-w-3xl text-slate-400 font-normal text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed"
          >
            <div>Have questions? We'd be happy to help you explore Closed Circuit.</div>
            <div>Email: cc@closedcircuit.in &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Mobile: +91 82175 43446</div>
            <div>Kindly fill out the form below so we can connect with you at your convenience.</div>
          </motion.div>
        </div>
      </motion.section>

      <section className="relative py-8 md:py-10 border-b border-white/5 bg-[#030712] overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="relative page-container z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mx-auto max-w-4xl">
              {/* Form */}
              <Card className="p-4 md:p-5 border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01]">
                {status === 'success' ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="inline-flex items-center justify-center p-4 bg-green-500/20 rounded-full mb-6 relative">
                      <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
                      <CheckCircle className="w-12 h-12 text-green-400 relative z-10" />
                    </div>
                    <h3 className="text-3xl font-display font-bold text-white mb-4 tracking-tight">Message Sent!</h3>
                    <p className="text-lg text-slate-400 leading-relaxed">{message}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0 }}>
                        <label className={labelClasses}>Full Name <span className="text-indigo-400">*</span></label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className={inputClasses}
                          placeholder="Your name"
                        />
                      </motion.div>

                      <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
                        <label className={labelClasses}>Mobile Number <span className="text-indigo-400">*</span></label>
                        <div className={verifyFieldRowClasses}>
                          <input
                            type="tel"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            inputMode="numeric"
                            pattern="\d{10}"
                            maxLength={10}
                            required
                            disabled={!canEnterMobile || (useBackendApi && mobileVerified)}
                            className={`${verifyInputClasses} disabled:cursor-not-allowed disabled:opacity-50`}
                            placeholder="10-digit mobile number"
                          />
                          {useBackendApi && (
                            <button
                              type="button"
                              onClick={openMobileVerification}
                              disabled={
                                mobileVerified ||
                                !canVerifyMobile ||
                                mobileSendingOtp
                              }
                              className={verifyButtonClasses(mobileVerified)}
                            >
                              {mobileSendingOtp
                                ? 'Sending OTP...'
                                : mobileVerified
                                  ? '✓ Verified'
                                  : 'Verify Mobile'}
                            </button>
                          )}
                        </div>
                        {useBackendApi && showMobileSuccessBanner && (
                          <p className="mt-1 text-sm text-green-300">Mobile verified successfully</p>
                        )}
                        {useBackendApi && !mobileVerified && mobileVerifyStatus === 'error' && !otpModal && (
                          <p className="mt-2 text-sm text-red-300">{mobileVerifyMessage}</p>
                        )}
                      </motion.div>

                      <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                        <label className={labelClasses}>Email ID <span className="text-indigo-400">*</span></label>
                        <div className={verifyFieldRowClasses}>
                          <input
                            type="email"
                            name="emailId"
                            value={formData.emailId}
                            onChange={handleChange}
                            required
                            disabled={!canEnterEmail || (useBackendApi && emailVerified)}
                            className={`${verifyInputClasses} disabled:cursor-not-allowed disabled:opacity-50`}
                            placeholder="your@email.com"
                          />
                          {useBackendApi && (
                            <button
                              type="button"
                              onClick={openEmailVerification}
                              disabled={
                                emailVerified ||
                                !canVerifyEmail ||
                                emailSendingOtp
                              }
                              className={verifyButtonClasses(emailVerified)}
                            >
                              {emailSendingOtp
                                ? 'Sending OTP...'
                                : emailVerified
                                  ? '✓ Verified'
                                  : 'Verify Email'}
                            </button>
                          )}
                        </div>
                        {useBackendApi && showEmailSuccessBanner && (
                          <p className="mt-1 text-sm text-green-300">Email verified successfully</p>
                        )}
                        {useBackendApi && !emailVerified && emailVerifyStatus === 'error' && !otpModal && (
                          <p className="mt-2 text-sm text-red-300">{emailVerifyMessage}</p>
                        )}
                      </motion.div>

                      <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
                        <label className={labelClasses}>Town/City <span className="text-indigo-400">*</span></label>
                        <input
                          type="text"
                          name="town"
                          value={formData.town}
                          onChange={handleChange}
                          required
                          disabled={!canEnterTown}
                          className={inputClasses}
                          placeholder="Your town"
                        />
                      </motion.div>

                      <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                        <label className={labelClasses}>State <span className="text-indigo-400">*</span></label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          disabled={!canEnterState}
                          className={inputClasses}
                          placeholder="Your state"
                        />
                      </motion.div>

                      <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
                        <label className={labelClasses}>Country <span className="text-indigo-400">*</span></label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          disabled={!canEnterCountry}
                          className={inputClasses}
                          placeholder="Your country"
                        />
                      </motion.div>

                      <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="md:col-span-2">
                        <label className={labelClasses}>Looking For <span className="text-indigo-400">*</span></label>
                        <select
                          name="lookingFor"
                          value={formData.lookingFor}
                          onChange={handleChange}
                          required
                          disabled={!canEnterLookingFor}
                          className={`${inputClasses} ${selectOptionClasses}`}
                        >
                          <option value="">Select an option</option>
                          {lookingForOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </motion.div>

                      <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }} className="md:col-span-2">
                        <label className={labelClasses}>Preferred Contact Method <span className="text-indigo-400">*</span></label>
                        <div className={`grid grid-cols-1 gap-2 sm:grid-cols-3 ${!canEnterPreferredContact ? 'pointer-events-none opacity-50' : ''}`}>
                          {preferredContactMethods.map((method) => (
                            <label
                              key={method}
                              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 transition-all ${
                                formData.preferredContactMethod === method
                                  ? 'border-indigo-500/50 bg-indigo-500/10 text-white shadow-[0_0_18px_rgba(99,102,241,0.15)]'
                                  : 'border-white/10 bg-[#0f172a]/50 text-slate-300 hover:border-white/20 hover:bg-white/[0.04]'
                              }`}
                            >
                              <input
                                type="radio"
                                name="preferredContactMethod"
                                value={method}
                                checked={formData.preferredContactMethod === method}
                                onChange={handleChange}
                                required
                                disabled={!canEnterPreferredContact}
                                className="h-4 w-4 border-white/20 bg-transparent text-indigo-500 focus:ring-indigo-500/40"
                              />
                              <span className={`font-semibold ${formFieldTextClasses}`}>{method}</span>
                            </label>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div
  initial={{ y: 10, opacity: 0 }}
  whileInView={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.4 }}
>
  <label className={labelClasses}>
    Preferred Date <span className="text-indigo-400">*</span>
  </label>

  <input
    type="date"
    name="preferredDate"
    value={formData.preferredDate}
    onChange={handleChange}
    min={appointmentDateBounds.min}
    max={appointmentDateBounds.max}
    required
    disabled={!canEnterPreferredDate}
    className={`${inputClasses} [color-scheme:dark]`}
  />
</motion.div>

                      <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
                        <label className={labelClasses}>Preferred Time <span className="text-indigo-400">*</span></label>
                        <div className="grid grid-cols-3 gap-3">
                          <select
                            value={preferredHour}
                            onChange={(e) => handleTimeChange('hour', e.target.value)}
                            required
                            disabled={!canEnterPreferredTime}
                            className={`${inputClasses} ${selectOptionClasses}`}
                          >
                            <option value="">Hour</option>
                            {hourOptions.map((hour) => (
                              <option key={hour} value={hour}>{hour}</option>
                            ))}
                          </select>
                          <select
                            value={preferredMinute}
                            onChange={(e) => handleTimeChange('minute', e.target.value)}
                            required
                            disabled={!canEnterPreferredTime}
                            className={`${inputClasses} ${selectOptionClasses}`}
                          >
                            <option value="">Minute</option>
                            {minuteOptions.map((minute) => (
                              <option key={minute} value={minute}>{minute}</option>
                            ))}
                          </select>
                          <select
                            value={preferredPeriod}
                            onChange={(e) => handleTimeChange('period', e.target.value)}
                            required
                            disabled={!canEnterPreferredTime}
                            className={`${inputClasses} ${selectOptionClasses}`}
                          >
                            <option value="">AM/PM</option>
                            {periodOptions.map((period) => (
                              <option key={period} value={period}>{period}</option>
                            ))}
                          </select>
                        </div>
                        <input type="hidden" name="preferredTime" value={formData.preferredTime} required />
                      </motion.div>
                    </div>

                    <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                      <label className={labelClasses}>Kindly mention any specific information if you have</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`${inputClasses} h-32 resize-none`}
                        placeholder="Tell us more about your needs..."
                      />
                    </motion.div>
                    {/* <div className="rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-5 text-sm text-slate-200">
  <p className="font-semibold text-white mb-2">Why we ask</p>
  <p>
    This form helps us understand your needs and connect with you at the right time.
    We use your information to respond, provide updates, and share relevant offerings from Closed Circuit AI Pvt Ltd.
  </p>
</div> */}

<motion.div
  initial={{ y: 10, opacity: 0 }}
  whileInView={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.55 }}
  className="flex items-start gap-3"
>
  <label className="flex items-start gap-3">
    <input
      type="checkbox"
      name="consentAccepted"
      checked={formData.consentAccepted}
      onChange={handleChange}
      required
      className="mt-1 h-5 w-5 rounded border-white/20 bg-[#0f172a]/50 text-indigo-500 focus:ring-indigo-500/40"
    />
    <span className={`${formFieldTextClasses} text-slate-300`}>
      I agree to receive communications, updates, and promotional messages from Closed Circuit AI Pvt Ltd via SMS, WhatsApp, and RCS on my provided contact details.
    </span>
  </label>
</motion.div>

                    {useBackendApi && !bothVerified && (
                      <p className="text-sm text-amber-300/90">
                        Please complete mobile and email verification before submitting the enquiry.
                      </p>
                    )}

                    {status === 'error' && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center space-x-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                      >
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-red-300 text-sm font-medium">{message}</p>
                      </motion.div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={status === 'loading' || !canSubmit}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 mt-3 border border-white/10"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          <span>Send Message</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </Card>
            </div>
          </motion.div>

          {/* <div className="mt-4 grid w-full gap-3 items-stretch lg:grid-cols-2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="w-full"
            >
              <Card className="h-full w-full p-4 md:p-5 border border-white/10 bg-gradient-to-br from-indigo-500/12 via-indigo-500/5 to-white/[0.02]">
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-indigo-400">When To Call</p>
                <h3 className="mt-2 font-display text-3xl font-bold text-white tracking-tight">
                  Best for detailed conversations and faster decisions.
                </h3>
                <p className="mt-2 text-base text-slate-400 leading-relaxed">
                  Pick a call when you want to discuss setup, launch planning, pricing flow, or your exact project
                  requirements in one focused conversation.
                </p>
                <div className="mt-4 grid gap-2">
                  {callWindows.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/5 bg-white/[0.04] px-4 py-3 text-sm font-medium leading-relaxed text-slate-300"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-full"
            >
              <Card className="h-full w-full p-4 md:p-5 border border-white/10 bg-gradient-to-br from-purple-500/12 via-purple-500/5 to-white/[0.02]">
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-purple-400">When To Chat</p>
                <h3 className="mt-2 font-display text-3xl font-bold text-white tracking-tight">
                  Best for quick questions, updates, and simple follow-ups.
                </h3>
                <p className="mt-2 text-base text-slate-400 leading-relaxed">
                  Use chat when you want lightweight back-and-forth, document sharing, quick clarifications, or
                  a fast first response without booking a call.
                </p>
                <div className="mt-4 grid gap-2">
                  {chatWindows.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/5 bg-white/[0.04] px-4 py-3 text-sm font-medium leading-relaxed text-slate-300"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div> */}
        </div>
      </section>

      {useBackendApi && (
        <>
          <OtpVerificationModal
            isOpen={otpModal === 'mobile'}
            channel="mobile"
            destination={formatMobileDestination(formData.mobileNumber)}
            value={mobileOtp}
            onChange={(value) => setMobileOtp(value.replace(/\D/g, '').slice(0, 4))}
            onVerify={confirmMobileOtp}
            onResend={resendMobileOtp}
            onClose={closeOtpModal}
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
            onChange={(value) => setEmailOtp(value.replace(/\D/g, '').slice(0, 6))}
            onVerify={confirmEmailOtp}
            onResend={resendEmailOtp}
            onClose={closeOtpModal}
            verifyStatus={emailVerifyStatus}
            verifyMessage={emailVerifyMessage}
            sendingOtp={emailSendingOtp}
            otpSent={emailOtpSent}
          />
        </>
      )}
    </motion.div>
  );
}
