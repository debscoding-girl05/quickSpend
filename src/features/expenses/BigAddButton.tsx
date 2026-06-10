import { useState } from 'react';
import { Add28Filled, Dismiss24Regular } from '@fluentui/react-icons';

/**
 * Bouton "+" flottant + drawer (sheet) qui s'ouvre depuis le bas.
 *
 * Pour le Jour 6 : le drawer est intentionnellement VIDE — on y mettra
 * le vrai formulaire de saisie au Jour 7.
 *
 * Mobile-first :
 *  - bouton fixe en bas-droite, gros (56px) pour être atteignable au pouce
 *  - drawer plein écran sur mobile, modal centré sur desktop (plus tard)
 */
export default function BigAddButton() {
  // ─── State ────────────────────────────────────────────────────────────
  // TODO [TOI] : déclare un useState `isOpen: boolean` (initial false).
  const [isOpen, setIsOpen] = useState(false);


  // ⬇️ À toi (return un fragment <>...</> ou un seul élément racine) :
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Ajouter une dépense"
        className="
          fixed bottom-24 right-6 z-40
          w-14 h-14 rounded-full
          bg-brand-600 text-white
          shadow-lg hover:bg-brand-700
          flex items-center justify-center
        "
      >
        <Add28Filled />
      </button>

      {isOpen && (
        <>
          {/* Overlay sombre derrière */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Sheet qui slide depuis le bas */}
          <div className="
            fixed bottom-0 left-0 right-0 z-50
            bg-white rounded-t-2xl
            p-6 max-h-[80vh] overflow-y-auto
          ">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Nouvelle dépense</h2>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Fermer"
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <Dismiss24Regular />
              </button>
            </div>
            
            <p className="text-ink-muted">Formulaire à venir au Jour 7.</p>
          </div>
        </>
      )}
    </>
  );
}
