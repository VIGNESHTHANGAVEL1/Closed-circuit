import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

const OTP_LENGTH = 4;
const RESEND_SECONDS = 30;

export default function OtpVerificationModal({
  isOpen,
  channel,
  destination,
  value,
  onChange,
  onVerify,
  onResend,
  onClose,
  verifyStatus,
  verifyMessage,
  sendingOtp,
  otpSent,
}) {
  const inputRefs = useRef([]);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [resendGeneration, setResendGeneration] = useState(0);

  const title = channel === 'mobile' ? 'Verify Mobile Number' : 'Verify Email ID';
  const isLoading = verifyStatus === 'loading';
  const isComplete = value.length === OTP_LENGTH;

  useEffect(() => {
    if (!isOpen || !otpSent) {
      setCountdown(0);
      return undefined;
    }

    setCountdown(RESEND_SECONDS);
    const timer = setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, otpSent, resendGeneration]);

  useEffect(() => {
    if (!isOpen || sendingOtp) {
      return;
    }

    const focusTimer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);

    return () => clearTimeout(focusTimer);
  }, [isOpen, sendingOtp]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onKey = (event) => {
      if (event.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, isLoading, onClose]);

  const updateOtpAt = (index, digit) => {
    const chars = value.padEnd(OTP_LENGTH, ' ').split('');
    chars[index] = digit;
    onChange(chars.join('').replace(/\s/g, '').slice(0, OTP_LENGTH));
  };

  const handleInputChange = (index, raw) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    updateOtpAt(index, digit);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace') {
      if (value[index]) {
        updateOtpAt(index, '');
        return;
      }

      if (index > 0) {
        updateOtpAt(index - 1, '');
        inputRefs.current[index - 1]?.focus();
      }
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) {
      return;
    }

    onChange(pasted);
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResend = async () => {
    if (countdown > 0 || isLoading || sendingOtp) {
      return;
    }

    await onResend();
    setResendGeneration((current) => current + 1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => !isLoading && onClose()}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 w-full max-w-md rounded-2xl bg-gradient-to-br from-purple-500/80 via-indigo-500/70 to-purple-600/80 p-[1px] shadow-[0_0_50px_rgba(139,92,246,0.45)]"
          >
            <div className="rounded-2xl bg-[#0a0f1a] p-6 md:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white md:text-2xl">{title}</h2>
                  <p className="mt-2 text-sm text-slate-400 md:text-base">
                    {sendingOtp ? 'Sending OTP...' : `OTP sent to ${destination}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {sendingOtp ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 size={32} className="animate-spin text-indigo-400" />
                </div>
              ) : !otpSent ? (
                <div className="py-6 text-center">
                  {verifyMessage && (
                    <p className="mb-4 text-sm text-red-300">{verifyMessage}</p>
                  )}
                  <button
                    type="button"
                    onClick={onResend}
                    disabled={sendingOtp}
                    className="rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-5 py-3 text-sm font-semibold text-indigo-200 transition hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex justify-center gap-3">
                    {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          inputRefs.current[index] = element;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={channel === 'mobile' ? 'one-time-code' : 'off'}
                        maxLength={1}
                        value={value[index] || ''}
                        onChange={(event) => handleInputChange(index, event.target.value)}
                        onKeyDown={(event) => handleKeyDown(index, event)}
                        onPaste={handlePaste}
                        disabled={isLoading}
                        className="h-14 w-12 rounded-xl border border-white/10 bg-[#0f172a]/80 text-center text-xl font-bold text-white transition focus:border-purple-500/60 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50 md:h-16 md:w-14 md:text-2xl"
                        aria-label={`OTP digit ${index + 1}`}
                      />
                    ))}
                  </div>

                  {verifyMessage && (
                    <p
                      className={`mb-4 text-center text-sm ${
                        verifyStatus === 'error' ? 'text-red-300' : 'text-slate-400'
                      }`}
                    >
                      {verifyMessage}
                    </p>
                  )}

                  <div className="mb-6 text-center text-sm">
                    {countdown > 0 ? (
                      <span className="text-slate-400">Resend OTP in {countdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={isLoading}
                        className="font-semibold text-indigo-300 transition hover:text-indigo-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={onVerify}
                    disabled={!isComplete || isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-gradient-to-r from-indigo-500 to-purple-500 py-3.5 text-base font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Verify OTP</span>
                    )}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
