/**
 * Build public CDN URLs for DigitalOcean Spaces objects.
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

function getVideosFolder() {
  return (import.meta.env.VITE_DO_SPACES_VIDEOS_FOLDER || 'Videos').replace(/^\/|\/$/g, '');
}

function buildMediaUrl(folder, filename) {
  if (!filename) {
    return '';
  }

  const key = [getRootFolder(), folder, filename].filter(Boolean).join('/');
  return `${getCdnBase()}/${encodeObjectKey(key)}`;
}

/** Build a CDN URL for a file at the Spaces root folder level. */
export function getRootMediaUrl(filename) {
  const key = [getRootFolder(), filename].filter(Boolean).join('/');
  return `${getCdnBase()}/${encodeObjectKey(key)}`;
}

function resolveVideoUrl(envFilename, fallbackFilename, legacyUrl = '') {
  const filename = import.meta.env[envFilename] || fallbackFilename;
  const fromFolder = buildMediaUrl(getVideosFolder(), filename);
  if (fromFolder && import.meta.env.VITE_DO_SPACES_ROOT_FOLDER) {
    return fromFolder;
  }
  return legacyUrl || fromFolder;
}

/** Pre-configured media URLs for static marketing videos. */
export function getFlowVoiceVideoUrl() {
  return (
    resolveVideoUrl(
      'VITE_DO_SPACES_FLOW_VIDEO_FILE',
      'flow_in_voice.mp4',
      'https://lara.blr1.cdn.digitaloceanspaces.com/Closed%20Circuit/flow_in_voice.mp4'
    ) || ''
  );
}

export function getFlowVoiceMobileVideoUrl() {
  return (
    resolveVideoUrl(
      'VITE_DO_SPACES_FLOW_VIDEO_MOBILE_FILE',
      'flow_in_voice_mobile_View.mp4',
      'https://lara.blr1.cdn.digitaloceanspaces.com/Closed%20Circuit/flow_in_voice_mobile_View.mp4'
    ) || ''
  );
}

export function getCareerVideoUrl() {
  return resolveVideoUrl('VITE_DO_SPACES_CAREER_VIDEO_FILE', 'career_information.mp4');
}

export function getCareerVideoMobileUrl() {
  return resolveVideoUrl('VITE_DO_SPACES_CAREER_VIDEO_MOBILE_FILE', 'career_information_mobile.mp4');
}

export function getFamilyVideoUrl() {
  const file = import.meta.env.VITE_DO_SPACES_FAMILY_VIDEO_FILE || 'gifts_in_voice.mp4';
  return getRootMediaUrl(file);
}
