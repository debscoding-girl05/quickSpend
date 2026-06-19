import { supabase } from '@/lib/supabase';
import type { SyncQueueEntry, LocalExpense } from '@/lib/dexie';

/**
 * Pousse UNE entrée de syncQueue vers Supabase.
 *
 * Resolve si succès (le caller pourra supprimer l'entrée de la queue).
 * Throws si échec (le caller incrémentera retries + arrêtera le worker).
 *
 * On ne gère ici aucune logique de retry — c'est l'orchestrateur (runSync)
 * qui décide quoi faire selon le résultat.
 */
export async function syncOne(entry: SyncQueueEntry): Promise<void> {
  switch (entry.op) {
    case 'insert': {
      if (!entry.payload) {
        throw new Error(`Entry ${entry.id} a op=insert mais payload null`);
      }
      // Convertir LocalExpense → format Supabase (camelCase → snake_case)
      const row = localExpenseToSupabaseRow(entry.payload);
      const { error } = await supabase.from('expenses').insert(row);
      if (error) throw error;
      return;
    }

    case 'update': {
      if (!entry.payload) {
        throw new Error(`Entry ${entry.id} a op=update mais payload null`);
      }
      const row = localExpenseToSupabaseRow(entry.payload);
      const { error } = await supabase
        .from('expenses')
        .update(row)
        .eq('id', entry.entityId);
      if (error) throw error;
      return;
    }

    case 'delete': {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', entry.entityId);
      if (error) throw error;
      return;
    }
  }
}

/**
 * Adaptateur LocalExpense (camelCase TS) → ligne Postgres (snake_case).
 *
 * Pourquoi ça existe : convention TS = camelCase, convention SQL = snake_case.
 * On les garde séparés pour respecter chaque écosystème.
 */
function localExpenseToSupabaseRow(e: LocalExpense) {
  return {
    id: e.id,
    user_id: e.userId,
    amount: e.amount,
    category: e.category,
    merchant: e.merchant,
    note: e.note,
    source: e.source,
    created_at: e.createdAt,
  };
}
