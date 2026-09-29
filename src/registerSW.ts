export function registerServiceWorker() {
  // Capacitor Android apps use a bundled web build and must not use the
  // website service worker/cache. Only register it for normal web URLs.
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol !== 'http:' && location.protocol !== 'https:') return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', {scope: '/'})
      .then(registration => {
        registration.update();
      })
      .catch(error => {
        console.error('Service worker registration failed:', error);
      });
  });
}
