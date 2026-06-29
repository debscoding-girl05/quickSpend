import { useLiveQuery } from 'dexie-react-hooks';
import { CloudArrowUp20Regular } from '@fluentui/react-icons';
import useAuth from '@/hooks/useAuth';
import { db } from '@/lib/dexie';
import { formatFcfa } from '@/lib/utils';

// Mapping label → emoji (miroir de la liste dans ExpenseForm).
// Si une catégorie est inconnue, on tombe sur 💸 (Autre).
const CATEGORY_EMOJI: Record<string, string> = {
  Nourriture: '🍞',
  Transport: '🚕',
  Logement: '🏠',
  Énergie: '⚡',
  Téléphone: '📱',
  Santé: '💊',
  Loisirs: '🎉',
  Vêtements: '👕',
  Éducation: '📚',
  Autre: '💸',
};

export default function Expenses() {
  const { user } = useAuth();

  // Query 1 : les dépenses de l'user, du plus récent au plus ancien.
  // user?.id : si pas d'user (transitoirement au démarrage), on passe une chaîne vide
  // qui ne matchera rien — la liste sera juste vide, pas de crash.
  const expenses = useLiveQuery(
    () =>
      db.expenses
        .where('userId')
        .equals(user?.id ?? '')
        .reverse()
        .sortBy('createdAt'),
    [user?.id],
  );

  // Query 2 : les IDs des dépenses qui sont encore en attente de sync.
  // On charge tout syncQueue et on en fait un Set pour lookup O(1).
  const pendingIds = useLiveQuery(async () => {
    const rows = await db.syncQueue.toArray();
    return new Set(rows.map((r) => r.entityId));
  }, []);

  // ─── États de chargement / vide ────────────────────────────────────────
  if (expenses === undefined) {
    return (
      <main className="p-6">
        <p className="text-ink-muted">Chargement…</p>
      </main>
    );
  }

  if (expenses.length === 0) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dépenses</h1>
        <p className="text-ink-muted">
          Aucune dépense pour l'instant. Touche le + pour commencer.
        </p>
      </main>
    );
  }

  // ─── Liste ─────────────────────────────────────────────────────────────
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dépenses</h1>

      <ul className="space-y-2">
        {expenses.map((expense) => {
          // TODO [TOI] : pour chaque dépense, construis 2 booléens/strings :
          //
          //   1. const emoji = CATEGORY_EMOJI[expense.category] ?? '💸';
          //   2. const isPending = pendingIds?.has(expense.id) ?? false;
          //
          // Puis return un <li> avec la structure (à adapter à ton goût) :
          //
          //   <li key={expense.id} className="flex items-center gap-3 p-3 bg-white border rounded-lg">
          //     <span className="text-2xl">{emoji}</span>
          //     <div className="flex-1">
          //       <p className="font-semibold">{formatFcfa(expense.amount)}</p>
          //       <p className="text-sm text-ink-muted">
          //         {expense.merchant ?? expense.category}
          //       </p>
          //     </div>
          //     {isPending && (
          //       <span className="text-xs text-amber-600" title="En attente de synchronisation">
          //         ⏳
          //       </span>
          //     )}
          //   </li>

          const emoji = CATEGORY_EMOJI[expense.category] ?? '💸';
          const isPending = pendingIds?.has(expense.id) ?? false;

          return (
            <li
              key={expense.id}
              className="flex items-center gap-3 p-3 bg-white border rounded-lg"
            >
              <span className="text-2xl">{emoji}</span>
              <div className="flex-1">
                <p className="font-semibold">{formatFcfa(expense.amount)}</p>
                <p className="text-sm text-ink-muted">
                  {expense.merchant ?? expense.category}
                </p>
              </div>
              {isPending && (
                <CloudArrowUp20Regular
                  className="text-amber-600"
                  aria-label="En attente de synchronisation"
                />
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
