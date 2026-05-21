/**
 * Types partagés QuickSpend.
 * On enrichira ces types ensemble au fil des features (Jour 2 : Expense, Jour 16 : ParsedExpense, etc.).
 */

export type ISODateString = string;

export type Currency = 'XAF'; // FCFA Afrique centrale

export interface MoneyAmount {
  value: number; // entier (pas de centimes en FCFA)
  currency: Currency;
}

// Placeholder Expense — on définira la version finale ensemble.
export interface Expense {
  id: string;
  amount: number;
  category: string;
  merchant?: string;
  note?: string;
  createdAt: ISODateString;
  source: 'manual' | 'sms' | 'voice';
}
