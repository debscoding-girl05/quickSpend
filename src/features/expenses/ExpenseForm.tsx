import { useState, type FormEvent } from 'react';
import { ExpenseInputSchema } from './schema';
import { useAddExpense } from './useAddExpense';

/**
 * Formulaire de saisie manuelle d'une dépense.
 *
 * Props :
 *   - onSuccess : callback appelée après écriture réussie en local
 *                 (le parent l'utilisera pour fermer le drawer)
 */

// Liste de catégories pré-définies. On affichera comme un grille de chips à cliquer.
const CATEGORIES = [
  { emoji: '🍞', label: 'Nourriture' },
  { emoji: '🚕', label: 'Transport' },
  { emoji: '🏠', label: 'Logement' },
  { emoji: '⚡', label: 'Énergie' },
  { emoji: '📱', label: 'Téléphone' },
  { emoji: '💊', label: 'Santé' },
  { emoji: '🎉', label: 'Loisirs' },
  { emoji: '👕', label: 'Vêtements' },
  { emoji: '📚', label: 'Éducation' },
  { emoji: '💸', label: 'Autre' },
];

type Props = {
  onSuccess: () => void;
};

export default function ExpenseForm({ onSuccess }: Props) {
  const { addExpense } = useAddExpense();

  // ─── State du form ────────────────────────────────────────────────────
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [merchant, setMerchant] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // ─── Submit ──────────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('saving');

    const result = ExpenseInputSchema.safeParse({ amount, category, merchant });
    if (!result.success) {
      setStatus('error');
      setErrorMessage(result.error.issues[0]?.message ?? 'Données invalides');
      return;
    }

    try {
      await addExpense(result.data);
      onSuccess();
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  }


  // ─── Render ──────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Champ Montant */}
      <div>
        <label className="block text-sm font-medium mb-1">Montant (FCFA)</label>
        <input
          type="number"
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="500"
          autoFocus
          className="w-full px-4 py-3 border rounded-lg text-2xl font-semibold"
        />
      </div>

      {/* Grille catégories */}
      <div>
        <label className="block text-sm font-medium mb-2">Catégorie</label>
        <div className="grid grid-cols-5 gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.label;
            return (
              <button
                type="button"
                key={cat.label}
                onClick={() => setCategory(cat.label)}
                className={`
                  flex flex-col items-center gap-1 p-2 rounded-lg border-2
                  ${isSelected ? 'border-brand-600 bg-brand-50' : 'border-slate-200'}
                `}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Champ Marchand */}
      <div>
        <label className="block text-sm font-medium mb-1">Marchand (optionnel)</label>
        <input
          type="text"
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
          placeholder="ex: Boulangerie du coin"
          className="w-full px-4 py-3 border rounded-lg"
        />
      </div>

      {/* Erreur */}
      {status === 'error' && (
        <p className="text-red-500 text-sm">{errorMessage}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'saving'}
        className="w-full px-4 py-3 bg-brand-600 text-white rounded-lg disabled:opacity-50 font-medium"
      >
        {status === 'saving' ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  );
}
