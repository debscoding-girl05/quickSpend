/**
 * Petits helpers utilitaires. On en ajoutera au fil du projet.
 */

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** Génère un ID court basé sur crypto (utile pour les inserts offline). */
export function uid(): string {
  return crypto.randomUUID();
}

/** Format FCFA — séparateur par espace insécable, suffixe FCFA. */
export function formatFcfa(amount: number): string {
  return `${amount.toLocaleString('fr-FR').replace(/ /g, ' ')} FCFA`;
}
