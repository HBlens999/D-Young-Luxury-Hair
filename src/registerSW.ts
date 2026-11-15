/**
 * D-Young is an online storefront/admin app. A stale service-worker cache can
 * keep an old admin bundle active on one device while other devices receive
 * the latest upload code. Remove the legacy app worker and its own caches so
 * every browser loads the current Cloudflare deployment.
 */
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol !== 'http:' && location.protocol !== 'https:') return;

  window.addEventListener('load', async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.unregister()));

      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(
          keys
            .filter(key => key.startsWith('d-young-app-'))
            .map(key => caches.delete(key))
        );
      }

      console.info('[D-Young] Legacy offline cache cleared. Reload once if this tab was already controlled by the old worker.');
    } catch (error) {
      console.warn('[D-Young] Could not clear the legacy service-worker cache:', error);
    }
  });
}
