import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { apiRequest, getGoogleScriptUrl, isApiEnabled } from '../lib/api';

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

  const lookingForOptions = [
    'DOB',
    'Marriage Anniversary',
    'Gated Community',
    'School',
    'Colleges',
    'Customers',
  ];

  const preferredContactMethods = ['Call', 'Chat'];
  const hourOptions = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'));
  const minuteOptions = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));
  const periodOptions = ['AM', 'PM'];

  const callWindows = [
    'Mon to Fri, 10:00 AM to 1:00 PM IST for project scoping and onboarding calls.',
    'Sat, 11:30 AM to 2:30 PM IST for quick planning discussions and follow-ups.',
    'Best for detailed requirement conversations, pricing walkthroughs, and launch timelines.',
  ];

  const chatWindows = [
    'Daily, 9:00 AM to 9:00 PM IST for quick questions and first responses.',
    'Average reply time: 15 to 30 minutes during active support hours.',
    'Best for sharing ideas, collecting documents, and resolving small doubts quickly.',
  ];

  const handleChange = (e) => {
  const { name, type, value, checked } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value,
  }));
};

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
    const { consentAccepted, ...contactFields } = data;

    const response = await apiRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(contactFields),
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

    // Preferred Date Validation
  const today = new Date().toISOString().split("T")[0];

  if (formData.preferredDate < today) {
    setStatus('error');
    setMessage('Preferred Date cannot be in the past.');
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
      setTimeout(() => setStatus(null), 5000);
    } catch {
      setStatus('error');
      setMessage('An error occurred. Please check your connection and try again.');
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-[#0f172a]/50 text-white border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium placeholder-slate-500";
  const labelClasses = "block text-sm font-semibold text-slate-300 mb-2";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#030712] text-slate-300"
    >
      <Hero
        title="Get In Touch"
        subtitle={
          <>
            We’d love to hear from you. Share your details and let’s connect!
            <br />
            Email: cc@closedcircuit.in &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Mobile: +91 82175 43446
            <br />
            Kindly fill out the form below so we can connect with you at your convenience.
          </>
        }
        contentClassName="mx-auto max-w-5xl px-6 py-8 md:py-10 text-center"
      />

      <section className="relative py-16 md:py-20 border-b border-white/5 bg-[#030712] overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-6 z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mx-auto max-w-4xl">
              {/* Form */}
              <Card className="p-8 md:p-10 border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01]">
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
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <input
                          type="tel"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          required
                          className={inputClasses}
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </motion.div>

                      <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                        <label className={labelClasses}>Email ID <span className="text-indigo-400">*</span></label>
                        <input
                          type="email"
                          name="emailId"
                          value={formData.emailId}
                          onChange={handleChange}
                          required
                          className={inputClasses}
                          placeholder="your@email.com"
                        />
                      </motion.div>

                      <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
                        <label className={labelClasses}>Town/City <span className="text-indigo-400">*</span></label>
                        <input
                          type="text"
                          name="town"
                          value={formData.town}
                          onChange={handleChange}
                          required
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
                          className={`${inputClasses} [&>option]:bg-slate-900 [&>option]:text-white`}
                        >
                          <option value="">Select an option</option>
                          {lookingForOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </motion.div>

                      <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }} className="md:col-span-2">
                        <label className={labelClasses}>Preferred Contact Method <span className="text-indigo-400">*</span></label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {preferredContactMethods.map((method) => (
                            <label
                              key={method}
                              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
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
                                className="h-4 w-4 border-white/20 bg-transparent text-indigo-500 focus:ring-indigo-500/40"
                              />
                              <span className="text-sm font-semibold">{method}</span>
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
    min={new Date().toISOString().split("T")[0]} // Disable past dates
    required
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
                            className={`${inputClasses} [&>option]:bg-slate-900 [&>option]:text-white`}
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
                            className={`${inputClasses} [&>option]:bg-slate-900 [&>option]:text-white`}
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
                            className={`${inputClasses} [&>option]:bg-slate-900 [&>option]:text-white`}
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
    <span className="text-sm leading-6 text-slate-300">
      I agree to receive communications, updates, and promotional messages from Closed Circuit AI Pvt Ltd via SMS, WhatsApp, and RCS on my provided contact details.
    </span>
  </label>
</motion.div>

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
                      // disabled={status === 'loading'}
                      disabled={status === 'loading' || !formData.consentAccepted}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 mt-6 border border-white/10"
                    >
                      {status === 'loading' ? (
                        <>
                          <div className="animate-spin"><Send size={20} /></div>
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

          <div className="mt-8 grid w-full gap-6 items-stretch lg:grid-cols-2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="w-full"
            >
              <Card className="h-full w-full p-8 md:p-9 border border-white/10 bg-gradient-to-br from-indigo-500/12 via-indigo-500/5 to-white/[0.02]">
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-indigo-400">When To Call</p>
                <h3 className="mt-4 font-display text-3xl font-bold text-white tracking-tight">
                  Best for detailed conversations and faster decisions.
                </h3>
                <p className="mt-4 text-base text-slate-400 leading-relaxed">
                  Pick a call when you want to discuss setup, launch planning, pricing flow, or your exact project
                  requirements in one focused conversation.
                </p>
                <div className="mt-8 grid gap-4">
                  {callWindows.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/5 bg-white/[0.04] px-5 py-5 text-sm font-medium leading-relaxed text-slate-300"
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
              <Card className="h-full w-full p-8 md:p-9 border border-white/10 bg-gradient-to-br from-purple-500/12 via-purple-500/5 to-white/[0.02]">
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-purple-400">When To Chat</p>
                <h3 className="mt-4 font-display text-3xl font-bold text-white tracking-tight">
                  Best for quick questions, updates, and simple follow-ups.
                </h3>
                <p className="mt-4 text-base text-slate-400 leading-relaxed">
                  Use chat when you want lightweight back-and-forth, document sharing, quick clarifications, or
                  a fast first response without booking a call.
                </p>
                <div className="mt-8 grid gap-4">
                  {chatWindows.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/5 bg-white/[0.04] px-5 py-5 text-sm font-medium leading-relaxed text-slate-300"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
