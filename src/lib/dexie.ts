import Dexie, { type Table } from 'dexie';

// Instance Dexie volontairement vide.
// On définira le schema (tables `expenses`, `syncQueue`, etc.) ensemble au Jour 6.
export class QuickSpendDB extends Dexie {
  // Exemple de typage à compléter ensemble :
  // expenses!: Table<Expense, string>;

  constructor() {
    super('quickspend');
    // this.version(1).stores({ expenses: 'id, createdAt, category' });
  }
}

export const db = new QuickSpendDB();

// Ré-export utile pour typer plus tard.
export type { Table };
