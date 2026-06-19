import { db, type LocalExpense, type SyncQueueEntry } from '@/lib/dexie';
import useAuth from '@/hooks/useAuth';
import { runSync } from '@/features/sync/runSync';
import type { ExpenseInput } from './schema';

/**
 * Hook pour ajouter une dépense en mode offline-first.
 *
 * Écrit dans 2 tables Dexie en transaction atomique :
 *   - `expenses`  : la dépense elle-même (lecture locale immédiate)
 *   - `syncQueue` : l'ordre à pousser plus tard vers Supabase
 *
 * Usage :
 *   const { addExpense } = useAddExpense();
 *   await addExpense({ amount: 500, category: 'Nourriture' });
 */
export function useAddExpense() {
  const { user } = useAuth();

  async function addExpense(input: ExpenseInput): Promise<LocalExpense> {
    if (!user) {
      throw new Error('Aucun utilisateur connecté');
    }

    const now = new Date().toISOString();
    const expenseId = crypto.randomUUID();

    // ─── Construire l'objet LocalExpense ──────────────────────────────────
    // TODO [TOI] : construis `expense` avec tous les champs LocalExpense.
    //
    // Champs (relis LocalExpense dans dexie.ts si besoin) :
    //   id         → expenseId (déclaré ci-dessus)
    //   userId     → user.id
    //   amount     → input.amount
    //   category   → input.category
    //   merchant   → input.merchant?.trim() || null   ← string vide devient null
    //   note       → input.note?.trim() || null
    //   source     → 'manual'                          ← littéral, on est dans le form manuel
    //   createdAt  → now

    // ⬇️ À toi :
    const expense: LocalExpense = {
      id: expenseId,
      userId: user.id,
      amount: input.amount,
      category: input.category,
      merchant: input.merchant?.trim() || null,
      note: input.note?.trim() || null,
      source: 'manual',
      createdAt: now,
    };

    // ─── Construire l'entrée SyncQueueEntry ───────────────────────────────
    // Je te la donne en exemple complet (tu en feras d'autres plus tard).
    const queueEntry: SyncQueueEntry = {
      id: crypto.randomUUID(),
      op: 'insert',
      entity: 'expenses',
      entityId: expense.id,
      payload: expense,
      retries: 0,
      lastError: null,
      queuedAt: now,
    };

    // ─── Écriture atomique ────────────────────────────────────────────────
    // 'rw' = read+write. Les 2 tables listées sont verrouillées le temps de la transaction.
    await db.transaction('rw', db.expenses, db.syncQueue, async () => {
      await db.expenses.add(expense);
      await db.syncQueue.add(queueEntry);
    });

    // Tente une sync immédiate (push instantané si online).
    // Fire & forget : pas de await — l'UI ne doit pas attendre le réseau.
    void runSync();

    return expense;
  }

  return { addExpense };
}
