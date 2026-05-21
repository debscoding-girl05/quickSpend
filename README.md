# QuickSpend

PWA de gestion financière pour le marché camerounais.
Objectif : enregistrer une dépense en moins de 5 secondes — via vocal, SMS Mobile Money (MTN/Orange), ou manuel. Offline-first.

> README minimal — on l'enrichira en Semaine 8 (pitch, captures, architecture).

## Stack

- React 18 + TypeScript (strict) + Vite
- Tailwind CSS v3
- PWA (vite-plugin-pwa, mode generateSW)
- Supabase (auth + DB Postgres + Edge Functions Deno)
- Groq API (Llama 3.3 + Whisper Large v3 Turbo) — via Edge Functions
- Dexie (IndexedDB) pour l'offline-first
- Recharts pour les visualisations
- react-router-dom v6
- zod (validation)
- Vitest + Testing Library

## Lancer le projet

```bash
npm install
cp .env.example .env   # remplir les valeurs Supabase
npm run dev
```

Autres commandes :

```bash
npm run build      # build prod
npm run preview    # preview du build
npm run lint       # eslint
npm run format     # prettier --write
npm run test       # vitest (watch)
npm run test:run   # vitest (one-shot)
```

## Structure

Voir [PLANNING.md](./PLANNING.md) pour la roadmap 40 jours et [JOURNAL.md](./JOURNAL.md) pour le journal d'apprentissage.
