import { z } from 'zod';

/**
 * Schéma de validation pour la saisie manuelle d'une dépense.
 *
 * - z.coerce.number() : transforme la string du <input type="number"> en number,
 *   puis valide. Si ce n'est pas un nombre, zod jette une erreur lisible.
 * - .int() : refuse les décimales (rappel : FCFA n'a pas de centimes).
 * - .min(...) / .max(...) : bornes raisonnables.
 *
 * Pourquoi `merchant` et `note` sont en `z.string().optional()` :
 *   - les champs HTML retournent toujours une string (jamais undefined)
 *   - mais le user peut laisser vide → on les transforme en null à l'écriture Dexie
 */

// Je te donne le squelette du schéma. Tu remplis les 2 TODO.
export const ExpenseInputSchema = z.object({
  amount: z.coerce
    .number()
    .int('Le montant doit être un entier')
    .min(1, 'Le montant doit être supérieur à 0')
    .max(100_000_000, 'Montant trop grand'),

  // TODO [TOI] : category
  //   - string
  //   - .min(1, '...') pour refuser les chaînes vides
  //   - exemple : z.string().min(1, 'Choisis une catégorie')
  category: z.string().min(1, 'Choisis une catégorie'),

  // TODO [TOI] : merchant (optionnel)
  //   - z.string().optional()
  //   - on le rendra null lors de l'écriture Dexie si c'est une string vide
  merchant: z.string().optional(),

  // note (optionnel, même logique que merchant)
  note: z.string().optional(),
});

// Type TS inféré du schéma — magie de zod : pas besoin de redéclarer.
// ExpenseInput sera exactement la forme qu'on obtient après validation.
export type ExpenseInput = z.infer<typeof ExpenseInputSchema>;
