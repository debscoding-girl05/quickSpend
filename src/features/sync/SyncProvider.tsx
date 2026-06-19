import { useEffect, type ReactNode } from 'react';
import useAuth from '@/hooks/useAuth';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { runSync } from './runSync';

/**
 * Provider qui démarre le sync worker au bon moment.
 *
 * Stratégie de déclenchement :
 *   1. Quand l'user vient de se connecter (session non-null) → push ce qui dort
 *   2. Quand le browser repasse online → push ce qui a échoué offline
 *
 * On utilise un effet par déclencheur (clarté). Pas d'état local —
 * runSync gère son propre verrou en interne.
 */
export default function SyncProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const isOnline = useOnlineStatus();

  // Trigger 1 : session devient non-null (login + chaque refresh d'app avec session existante)
  useEffect(() => {
    if (!session) return;
    runSync(); // fire & forget — runSync gère verrou + erreurs en interne
  }, [session]);

  // Trigger 2 : passage offline → online (le navigateur émet l'event)
  useEffect(() => {
    if (!isOnline || !session) return;
    runSync();
  }, [isOnline, session]);

  return <>{children}</>;
}
