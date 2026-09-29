export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

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
