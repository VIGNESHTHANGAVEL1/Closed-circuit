function trimTrailingSlash(url) {
  return url.replace(/\/$/, '');
}

function resolveApiBaseUrl() {
  const fromEnv = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL)?.trim();

  if (fromEnv) {
    return trimTrailingSlash(fromEnv);
  }

  // Production: API is served from the same host (e.g. closedcircuit.in/api/...)
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    return trimTrailingSlash(window.location.origin);
  }

  return 'http://localhost:5000';
}

const API_BASE_URL = resolveApiBaseUrl();

export function getApiBaseUrl() {
  return API_BASE_URL;
}

/** Backend API is used unless explicitly disabled (Google Sheets–only mode). */
export function isApiEnabled() {
  if (import.meta.env.VITE_DISABLE_API === 'true') {
    return false;
  }

  const fromEnv = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL)?.trim();
  if (fromEnv) {
    return true;
  }

  if (import.meta.env.PROD) {
    return true;
  }

  return true;
}

/** Valid deployed Google Apps Script /exec URL only (ignores .env.example placeholders). */
export function getGoogleScriptUrl() {
  const url = import.meta.env.VITE_GOOGLE_SCRIPT_URL?.trim() || '';

  if (!url) {
    return '';
  }

  if (url.includes('YOUR_DEPLOYMENT_ID') || url.includes('DEPLOYMENT_ID/exec')) {
    return '';
  }

  if (url.includes('docs.google.com/spreadsheets')) {
    return '';
  }

  if (!/^https:\/\/script\.google\.com\/macros\/s\/[a-zA-Z0-9_-]+\/exec/.test(url)) {
    return '';
  }

  return url;
}

export async function apiRequest(path, options = {}) {
  const { token, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function apiDownload(path, { token, params = {} } = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });

  const url = `${API_BASE_URL}${path}${query.toString() ? `?${query.toString()}` : ''}`;

  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error = new Error(data.message || 'Download failed');
    error.status = response.status;
    throw error;
  }

  const blob = await response.blob();
  const disposition = response.headers.get('Content-Disposition') || '';
  const match = disposition.match(/filename="(.+)"/);
  const filename = match?.[1] || `download-${Date.now()}`;

  return { blob, filename };
}

export async function apiFormRequest(path, { token, method = 'POST', formData } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    body: formData,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** Upload multipart form data with upload progress reporting via XMLHttpRequest. */
export function apiUploadWithProgress(path, { token, method = 'POST', formData, onProgress } = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, `${API_BASE_URL}${path}`);

    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === 'function') {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      let data = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        data = {};
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
        return;
      }

      const error = new Error(data.message || 'Upload failed');
      error.status = xhr.status;
      error.data = data;
      reject(error);
    };

    xhr.onerror = () => {
      const error = new Error('Upload failed');
      error.status = 0;
      reject(error);
    };

    xhr.send(formData);
  });
}
