import crypto from 'crypto';

export function generateOtp(length = 6) {
  const max = 10 ** length;
  const value = crypto.randomInt(0, max);
  return String(value).padStart(length, '0');
}

export function hashOtp(otp) {
  return crypto.createHash('sha256').update(String(otp)).digest('hex');
}

export function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}
