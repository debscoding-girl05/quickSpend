import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db, type SyncQueueEntry, type LocalExpense } from '@/lib/dexie';
import { runSync } from '@/features/sync/runSync';

// ─── MOCK ────────────────────────────────────────────────────────────────────
// On remplace syncOne par un mock qu'on pilotera test par test.
// `vi.fn()` crée une fonction espion — on contrôle ce qu'elle retourne/throw.
vi.mock('@/features/sync/syncOne', () => ({
  syncOne: vi.fn(),
}));

// On importe le mock APRÈS l'avoir déclaré, pour pouvoir le piloter dans les tests.
import { syncOne } from '@/features/sync/syncOne';
const mockedSyncOne = vi.mocked(syncOne);

// ─── HELPERS ────────────────────────────────────────────────────────────────
function makeExpense(overrides: Partial<LocalExpense> = {}): LocalExpense {
  return {
    id: crypto.randomUUID(),
    userId: 'user-1',
    amount: 500,
    category: 'Nourriture',
    merchant: null,
    note: null,
    source: 'manual',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeQueueEntry(expense: LocalExpense): SyncQueueEntry {
  return {
    id: crypto.randomUUID(),
    op: 'insert',
    entity: 'expenses',
    entityId: expense.id,
    payload: expense,
    retries: 0,
    lastError: null,
    queuedAt: new Date().toISOString(),
  };
}

// ─── TESTS ──────────────────────────────────────────────────────────────────
describe('runSync', () => {
  // Reset DB + mock avant chaque test pour partir propre.
  beforeEach(async () => {
    await db.expenses.clear();
    await db.syncQueue.clear();
    mockedSyncOne.mockReset();
  });

  it("supprime l'entrée de la queue quand syncOne réussit", async () => {
    // Arrange : 1 entrée dans la queue, syncOne mockée pour résoudre
    const expense = makeExpense();
    const entry = makeQueueEntry(expense);
    await db.syncQueue.add(entry);
    mockedSyncOne.mockResolvedValue(undefined);

    // Act
    await runSync();

    // Assert : la queue est vide, syncOne a été appelé une fois
    const remaining = await db.syncQueue.toArray();
    expect(remaining).toHaveLength(0);
    expect(mockedSyncOne).toHaveBeenCalledTimes(1);
    expect(mockedSyncOne).toHaveBeenCalledWith(entry);
  });

  // TODO [TOI] : Test 2 — échec
  //
  // Scénario : syncOne throw une erreur.
  // Attendu :
  //   - L'entrée RESTE dans la queue (pas de delete)
  //   - retries === 1
  //   - lastError contient le message d'erreur
  //   - syncOne a été appelé exactement 1 fois
  //
  // Indices :
  //   - mockedSyncOne.mockRejectedValue(new Error('Network down'));
  //   - Pour lire l'entrée après : const after = await db.syncQueue.get(entry.id);
  //   - expect(after?.retries).toBe(1);
  //   - expect(after?.lastError).toBe('Network down');

  // ⬇️ À toi :

  it("garde l'entrée + incrémente retries quand syncOne échoue", async () => {
    // Arrange : entry dans la queue + mock pour échouer
    const expense = makeExpense();
    const entry = makeQueueEntry(expense);
    await db.syncQueue.add(entry);
    mockedSyncOne.mockRejectedValue(new Error('Network down'));

    // Act
    await runSync();

    // Assert
    const after = await db.syncQueue.get(entry.id);
    expect(after).toBeDefined();
    expect(after?.retries).toBe(1);
    expect(after?.lastError).toBe('Network down');
    expect(mockedSyncOne).toHaveBeenCalledTimes(1);
  });

  // TODO [TOI] : Test 3 — stop au premier échec
  //
  // Scénario : 3 entrées dans la queue. La 2e échoue.
  // Attendu :
  //   - syncOne appelé exactement 2 fois (la 3e n'est PAS tentée)
  //   - La 1ère entrée a été supprimée (succès)
  //   - La 2e a retries=1
  //   - La 3e est intacte (retries=0)
  //
  // Indices :
  //   - mockedSyncOne.mockResolvedValueOnce(undefined)   // 1er appel → succès
  //                  .mockRejectedValueOnce(new Error('Boom')) // 2e → échec
  //                  .mockResolvedValueOnce(undefined);  // 3e → ne sera jamais appelé
  //   - Pour ajouter 3 entrées dans l'ordre, attention à queuedAt
  //     (string ISO triée alphabétiquement = chronologiquement).
  //     Utilise des timestamps explicites :
  //       entry1.queuedAt = '2026-01-01T00:00:00Z';
  //       entry2.queuedAt = '2026-01-01T00:00:01Z';
  //       entry3.queuedAt = '2026-01-01T00:00:02Z';

  // ⬇️ À toi :

  it('stoppe au premier échec et ne tente pas les entrées suivantes', async () => {
    // Arrange : 3 entrées dans la queue, avec queuedAt explicites pour l'ordre FIFO
    const e1 = makeExpense();
    const e2 = makeExpense();
    const e3 = makeExpense();
    const entry1 = { ...makeQueueEntry(e1), queuedAt: '2026-01-01T00:00:00Z' };
    const entry2 = { ...makeQueueEntry(e2), queuedAt: '2026-01-01T00:00:01Z' };
    const entry3 = { ...makeQueueEntry(e3), queuedAt: '2026-01-01T00:00:02Z' };
    await db.syncQueue.bulkAdd([entry1, entry2, entry3]);

    // Mock : succès / échec / (jamais appelé)
    mockedSyncOne
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('Boom'))
      .mockResolvedValueOnce(undefined);

    // Act
    await runSync();

    // Assert
    // 1) syncOne appelé exactement 2 fois (la 3e n'est jamais tentée)
    expect(mockedSyncOne).toHaveBeenCalledTimes(2);

    // 2) entry1 supprimée (succès)
    const after1 = await db.syncQueue.get(entry1.id);
    expect(after1).toBeUndefined();

    // 3) entry2 encore là avec retries=1 + lastError
    const after2 = await db.syncQueue.get(entry2.id);
    expect(after2?.retries).toBe(1);
    expect(after2?.lastError).toBe('Boom');

    // 4) entry3 intacte (retries=0)
    const after3 = await db.syncQueue.get(entry3.id);
    expect(after3?.retries).toBe(0);
  });
});
