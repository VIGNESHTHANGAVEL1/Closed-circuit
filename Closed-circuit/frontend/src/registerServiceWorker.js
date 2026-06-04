const LOCALHOST_NAMES = new Set(['localhost', '127.0.0.1', '[::1]']);

function canRegisterServiceWorker() {
  return (
    'serviceWorker' in navigator &&
    (window.isSecureContext || LOCALHOST_NAMES.has(window.location.hostname))
  );
}

export function registerServiceWorker() {
  if (!import.meta.env.PROD || !canRegisterServiceWorker()) {
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');

      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;

        if (!installingWorker) {
          return;
        }

        installingWorker.addEventListener('statechange', () => {
          if (
            installingWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            console.info('A new version of Closed Circuit is available and will be used on the next visit.');
          }
        });
      });
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  });
}
