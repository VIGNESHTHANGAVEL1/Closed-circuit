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
  return (import.meta.env.VITE_DO_SPACES_ROOT_FOLDER || 'cc-website').replace(/^\/|\/$/g, '');
}

function getCareerVideosFolder() {
  return (import.meta.env.VITE_DO_SPACES_CAREER_VIDEOS_FOLDER || 'career_videos').replace(/^\/|\/$/g, '');
}

function buildMediaUrl(...segments) {
  const key = segments.filter(Boolean).join('/');
  if (!key) {
    return '';
  }
  return `${getCdnBase()}/${encodeObjectKey(key)}`;
}

/** Build a CDN URL for a file at the Spaces root folder level. */
export function getRootMediaUrl(filename) {
  return buildMediaUrl(getRootFolder(), filename);
}

/** Pre-configured media URLs for static marketing videos. */
export function getFlowVoiceVideoUrl() {
  const file = import.meta.env.VITE_DO_SPACES_FLOW_VIDEO_FILE || 'flow_in_voice.mp4';
  return getRootMediaUrl(file);
}

export function getFlowVoiceMobileVideoUrl() {
  const file = import.meta.env.VITE_DO_SPACES_FLOW_VIDEO_MOBILE_FILE || 'flow_in_voice_mobile_View.mp4';
  return getRootMediaUrl(file);
}

export function getCareerVideoUrl() {
  const file = import.meta.env.VITE_DO_SPACES_CAREER_VIDEO_FILE || 'desktop-view-en.mp4';
  return buildMediaUrl(getRootFolder(), getCareerVideosFolder(), file);
}

export function getCareerVideoMobileUrl() {
  const file = import.meta.env.VITE_DO_SPACES_CAREER_VIDEO_MOBILE_FILE || 'mobile-view-en.mp4';
  return buildMediaUrl(getRootFolder(), getCareerVideosFolder(), file);
}

export function getFamilyVideoUrl() {
  const file = import.meta.env.VITE_DO_SPACES_FAMILY_VIDEO_FILE || 'gifts_in_voice.mp4';
  return getRootMediaUrl(file);
}
