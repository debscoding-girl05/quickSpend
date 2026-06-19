import { useEffect, useState } from 'react';

/**
 * Hook qui retourne le statut online/offline du browser.
 *
 * S'appuie sur :
 *   - navigator.onLine (booléen instantané)
 *   - events 'online' et 'offline' (sur window)
 *
 * ⚠️ Caveat connu : `navigator.onLine` est *optimiste*. Il vaut true
 * dès que le browser a une interface réseau, même si tu n'as pas vraiment
 * accès au net. C'est suffisant pour notre usage (heuristique de retry),
 * pas pour un check de connexion sérieux.
 */
export function useOnlineStatus(): boolean {
  // TODO [TOI] : déclare un useState `isOnline` initialisé à navigator.onLine

  // ⬇️ À toi :

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // TODO [TOI] : useEffect qui :
  //   1. Définit 2 handlers :   const goOnline = () => setIsOnline(true);
  //                             const goOffline = () => setIsOnline(false);
  //   2. window.addEventListener('online', goOnline)
  //      window.addEventListener('offline', goOffline)
  //   3. Cleanup return : removeEventListener pour les 2
  //
  // Tableau de deps : [] (on s'abonne une seule fois au mount).
  //
  // Squelette :
  //
  // useEffect(() => {
  //   const goOnline = () => setIsOnline(true);
  //   const goOffline = () => setIsOnline(false);
  //   window.addEventListener('online', goOnline);
  //   window.addEventListener('offline', goOffline);
  //   return () => {
  //     window.removeEventListener('online', goOnline);
  //     window.removeEventListener('offline', goOffline);
  //   };
  // }, []);

  // ⬇️ À toi :

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return isOnline;
}
