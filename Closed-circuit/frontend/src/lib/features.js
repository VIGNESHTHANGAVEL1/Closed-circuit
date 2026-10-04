export function isEntrepreneurshipWebinarEnabled() {
  return import.meta.env.VITE_ENTREPRENEURSHIP_WEBINAR_ENABLED !== 'false';
}

export function isLeetcodeWebinarEnabled() {
  return import.meta.env.VITE_LEETCODE_WEBINAR_ENABLED !== 'false';
}
