import '@testing-library/jest-dom/vitest';

// Shim IndexedDB pour les tests : Dexie l'utilise automatiquement dès qu'on l'importe.
// Doit être importé AVANT toute utilisation de Dexie.
import 'fake-indexeddb/auto';
