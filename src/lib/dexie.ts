import Dexie, { type Table } from 'dexie';

// =============================================================================
// Types des entités stockées
// =============================================================================

/**
 * Réplique locale d'une dépense.
 * Miroir de la table Supabase `expenses`, généré côté client (offline-first).
 */
export interface LocalExpense {
  id: string; // UUID généré client (crypto.randomUUID)
  userId: string; // UUID de l'user connecté
  amount: number; // entier FCFA
  category: string; // ex: '🍞 Boulangerie'
  merchant: string | null;
  note: string | null;
  source: 'manual' | 'sms' | 'voice';
  createdAt: string; // ISO datetime
}

/**
 * Entrée dans la queue de synchronisation.
 *
 * Chaque opération qui modifie `expenses` (insert/update/delete) ajoute une
 * entrée ici. Le sync worker la lira plus tard et la poussera vers Supabase.
 */
// TODO [TOI] : complète l'interface SyncQueueEntry.
//
// Champs attendus (relis ma réponse au-dessus si tu coinces) :
//   - id        : string                          (UUID de l'entrée queue elle-même)
//   - op        : 'insert' | 'update' | 'delete'  (action à exécuter)
//   - entity    : 'expenses'                      (table cible — typed strict pour scaler)
//   - entityId  : string                          (UUID de la dépense ciblée)
//   - payload   : LocalExpense | null             (données pour insert/update, null pour delete)
//   - retries   : number                          (compteur backoff)
//   - lastError : string | null                   (dernière erreur, debug)
//   - queuedAt  : string                          (ISO datetime, FIFO)

// ⬇️ À toi :
export interface SyncQueueEntry {
  id: string;
  op: 'insert' | 'update' | 'delete';
  entity: 'expenses';
  entityId: string;
  payload: LocalExpense | null;
  retries: number;
  lastError: string | null;
  queuedAt: string;
}

// =============================================================================
// Définition de la base
// =============================================================================
export class QuickSpendDB extends Dexie {
  expenses!: Table<LocalExpense, string>; // <RowType, PrimaryKeyType>
  syncQueue!: Table<SyncQueueEntry, string>;

  constructor() {
    super('quickspend');

    // ─── Version 1 du schéma ───────────────────────────────────────────────
    // Notation Dexie pour les indexes :
    //   - 1er champ = clé primaire
    //   - les suivants = indexes secondaires (pour filtrer/trier rapidement)
    //
    // Pour `expenses` : on indexe userId (filtrer par user), category (grouper),
    //                   createdAt (trier desc).
    //
    // TODO [TOI] : à toi de remplir la string `stores` pour syncQueue.
    //              Indexes utiles : entityId (savoir si une dépense est déjà queued),
    //              queuedAt (FIFO).
    //
    // Pour t'aider, voici la version expenses complète :
    //   expenses: 'id, userId, category, createdAt'
    //
    // Format attendu pour syncQueue (remplace ??) :
    //   syncQueue: 'id, ??, ??'

    this.version(1).stores({
      expenses: 'id, userId, category, createdAt',
      // TODO [TOI] : complète la ligne suivante
      // syncQueue: 'id, entityId, queuedAt',
      syncQueue: 'id, entityId, queuedAt',
    });
  }
}

export const db = new QuickSpendDB();

export type { Table };
