import { db } from '@/lib/dexie';
import { syncOne } from './syncOne';

/**
 * Worker de synchronisation locale → Supabase.
 *
 * Comportement :
 *   - Verrou anti-concurrence : un seul appel à la fois
 *   - Lit syncQueue en FIFO (queuedAt ASC)
 *   - Pousse chaque entrée via syncOne()
 *   - Succès → DELETE l'entrée
 *   - Échec → incrémente retries, écrit lastError, STOPPE (retry plus tard)
 */

// Verrou simple : booléen au scope du module (singleton naturel)
let isSyncing = false;

export async function runSync(): Promise<void> {
  if (isSyncing) {
    // Un sync est déjà en cours — on ne lance pas un second.
    return;
  }
  isSyncing = true;

  try {
    // Lit toutes les entrées en attente, triées du plus ancien au plus récent.
    const pending = await db.syncQueue.orderBy('queuedAt').toArray();

    for (const entry of pending) {
      // ─── À TOI : try/catch autour de syncOne(entry) ─────────────────────
      // Pseudo-code :
      //
      // try {
      //   await syncOne(entry);
      //   // Succès → supprimer l'entrée de la queue
      //   await db.syncQueue.delete(entry.id);
      // } catch (err) {
      //   // Échec → mettre à jour retries + lastError, et STOPPER la boucle
      //   const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      //   await db.syncQueue.update(entry.id, {
      //     retries: entry.retries + 1,
      //     lastError: errorMessage,
      //   });
      //   // ⚠️ stopper le worker : break le for, pas continue
      //   break;
      // }

      // ⬇️ À toi :

      try {
        await syncOne(entry);
        await db.syncQueue.delete(entry.id);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        await db.syncQueue.update(entry.id, {
          retries: entry.retries + 1,
          lastError: errorMessage,
        });
        break;
      }
    }
  } finally {
    // Toujours libérer le verrou, même en cas d'exception inattendue.
    isSyncing = false;
  }
}
