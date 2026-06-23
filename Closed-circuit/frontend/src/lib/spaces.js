/**
 * Build a public CDN URL for a DigitalOcean Spaces object.
 * Folder names and bucket settings are read from VITE_* environment variables.
 */
function encodeObjectKey(key) {
  return key
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function getCdnBase() {
  const bucket = import.meta.env.VITE_DO_SPACES_BUCKET || 'lara';
  const region = import.meta.env.VITE_DO_SPACES_REGION || 'blr1';
  const explicit = import.meta.env.VITE_DO_SPACES_CDN_BASE?.trim();

  if (explicit) {
    return explicit.replace(/\/$/, '');
  }

  return `https://${bucket}.${region}.cdn.digitaloceanspaces.com`;
}

function getRootFolder() {
  return (import.meta.env.VITE_DO_SPACES_ROOT_FOLDER || 'Closed Circuit').replace(/^\/|\/$/g, '');
}

/** Build a CDN URL for a file at the Spaces root folder level. */
export function getRootMediaUrl(filename) {
  const key = [getRootFolder(), filename].filter(Boolean).join('/');
  return `${getCdnBase()}/${encodeObjectKey(key)}`;
}

/** Pre-configured media URLs for static marketing videos. */
export function getFlowVoiceVideoUrl() {
  const file = import.meta.env.VITE_DO_SPACES_FLOW_VIDEO_FILE || 'flow_in_voice.mp4';
  return getRootMediaUrl(file);
}

export function getFamilyVideoUrl() {
  const file = import.meta.env.VITE_DO_SPACES_FAMILY_VIDEO_FILE || 'gifts_in_voice.mp4';
  return getRootMediaUrl(file);
}
