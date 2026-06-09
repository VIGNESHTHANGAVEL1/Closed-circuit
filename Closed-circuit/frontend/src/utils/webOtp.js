/**
 * Chrome Web OTP — reads OTP from SMS when backend sends `@hostname #code`.
 */
export async function listenForWebOtp({ signal } = {}) {
  if (typeof window === 'undefined' || !('OTPCredential' in window)) {
    return null;
  }

  try {
    const credential = await navigator.credentials.get({
      otp: { transport: ['sms'] },
      signal,
    });

    return credential?.code || null;
  } catch {
    return null;
  }
}
