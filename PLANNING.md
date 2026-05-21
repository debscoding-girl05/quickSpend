# PLANNING QuickSpend — 8 semaines / 40 jours actifs

> **Légende collaboration :** MOI = toi (Debora), CLAUDE = ton mentor pair-programming, ENSEMBLE = à 4 mains.
> **Modes :** 🟢 Tuteur (j'explique, tu codes seule, je review) — 🟡 Pair (on alterne) — 🔴 Démo (je fais, tu regardes, à éviter sauf config technique)
> Le mode par défaut est 🟡 Pair.

---

## Semaine 1 — Fondations (Jours 1-5)
**Objectif de la semaine :** Repo prêt, Supabase connecté, auth fonctionnelle, premier déploiement en ligne.
**Concepts à maîtriser :** Vite, TS strict, Tailwind, Supabase client, RLS, auth magic link, react-router.

### Jour 1 — Walkthrough du boilerplate
- **Durée estimée :** 2h
- **Mode recommandé :** 🟢 Tuteur (je t'explique chaque fichier généré)
- **Tâches :**
  - [ ] Walkthrough complet des fichiers générés (CLAUDE explique, MOI pose des questions)
  - [ ] Lancer `npm run dev` et vérifier la page d'accueil (MOI)
  - [ ] Tester `npm run build`, `npm run lint`, `npm run test` (MOI)
  - [ ] Premier ajustement choisi par MOI dans `App.tsx` (changer un texte, ajouter une classe Tailwind)
- **Livrable du jour :** projet qui tourne en local, MOI capable d'expliquer chaque fichier de config.
- **Concepts appris :** rôle de chaque fichier (vite.config, tsconfig paths, tailwind directives, eslint), différence boilerplate vs métier.
- **Auto-évaluation :** ⬜ Compris / ⬜ À revoir

### Jour 2 — Setup Supabase (projet cloud + schema initial)
- **Durée estimée :** 3h
- **Mode recommandé :** 🟡 Pair
- **Tâches :**
  - [ ] Créer projet Supabase (MOI)
  - [ ] Récupérer URL + anon key, remplir `.env` (MOI)
  - [ ] Écrire migration SQL `expenses` (ENSEMBLE — CLAUDE explique RLS, MOI écris la table)
  - [ ] Première policy RLS `auth.uid() = user_id` (ENSEMBLE)
  - [ ] Tester insert via SQL Editor Supabase (MOI)
- **Livrable :** table `expenses` créée avec RLS, première ligne insérée à la main.
- **Concepts appris :** RLS, `auth.uid()`, policies, schéma Postgres, migrations.

### Jour 3 — Auth magic link
- **Durée estimée :** 3h
- **Mode recommandé :** 🟡 Pair
- **Tâches :**
  - [ ] Hook `useAuth` (CLAUDE explique structure, MOI code)
  - [ ] Page `Login` avec input email + bouton (MOI)
  - [ ] Page `AuthCallback` qui gère le retour magic link (ENSEMBLE)
  - [ ] Test du flow complet (MOI)
- **Livrable :** je peux me connecter avec un magic link et voir mon `user.id`.
- **Concepts appris :** OAuth-like flow, sessions Supabase, hooks React, `useEffect` cleanup.

### Jour 4 — Router + layout + premier composant
- **Durée estimée :** 2-3h
- **Mode recommandé :** 🟡 Pair
- **Tâches :**
  - [ ] Routes : `/`, `/login`, `/auth/callback`, `/expenses` (MOI)
  - [ ] Composant `RequireAuth` (CLAUDE explique pattern, MOI code)
  - [ ] Layout principal (bottom nav mobile) (MOI)
- **Livrable :** navigation protégée, layout mobile-first visible.
- **Concepts appris :** react-router v6, route guards, mobile-first responsive.

### Jour 5 — Premier déploiement Cloudflare Pages
- **Durée estimée :** 2h
- **Mode recommandé :** 🔴 Démo partielle (CLAUDE explique CI/CD, MOI fait les clics)
- **Tâches :**
  - [ ] Push GitHub (MOI)
  - [ ] Connecter Cloudflare Pages (MOI)
  - [ ] Configurer build (`npm run build`, output `dist`) (ENSEMBLE)
  - [ ] Variables d'env Vite (MOI)
- **Livrable :** URL publique fonctionnelle.

---

## Semaine 2 — Saisie manuelle + Offline (Jours 6-10)
**Objectif :** premier flux de bout en bout — l'utilisateur enregistre une dépense même hors-ligne.
**Concepts à maîtriser :** IndexedDB via Dexie, optimistic UI, sync queue, useLiveQuery.

### Jour 6 — Bouton de saisie principal + schéma Dexie
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] Définir schéma Dexie `expenses` + `syncQueue` (ENSEMBLE)
  - [ ] Composant `BigAddButton` mobile-first (MOI)
- **Livrable :** bouton qui ouvre un drawer vide.

### Jour 7 — Form de saisie manuelle
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] Schéma zod `ExpenseInput` (ENSEMBLE)
  - [ ] Form (montant + catégorie emoji + marchand) (MOI)
  - [ ] Hook `useAddExpense` qui écrit dans Dexie (MOI)
- **Livrable :** je peux enregistrer une dépense localement.

### Jour 8 — Sync queue : local → Supabase
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] Worker de sync (CLAUDE écrit squelette, MOI écris la logique de retry)
  - [ ] Détection online/offline (`navigator.onLine` + events) (MOI)
- **Livrable :** ce qui est saisi offline remonte automatiquement quand je redeviens online.

### Jour 9 — Optimistic UI + liste des dépenses
- **Mode :** 🟢 Tuteur
- **Tâches :**
  - [ ] Page `Expenses` avec `useLiveQuery` Dexie (MOI seule, CLAUDE review)
  - [ ] Indicateur "non synchronisé" sur chaque ligne (MOI)

### Jour 10 — Tests + refactor
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] Tests Vitest sur `useAddExpense` (ENSEMBLE)
  - [ ] Tests sur la sync queue (mocks) (ENSEMBLE)

---

## Semaine 3 — Parser SMS regex (Jours 11-15)
**Objectif :** convertir un SMS MoMo collé en dépense pré-remplie.
**Concepts à maîtriser :** regex avancées, groupes nommés, tests par cas, design d'API pure.

### Jour 11 — Collecte de SMS réels
- **Mode :** 🟢 Tuteur
- **Tâches :**
  - [ ] MOI : collecter 20 SMS réels MTN MoMo + Orange Money (anonymisés)
  - [ ] Catégoriser : envoi, réception, retrait, dépôt, achat marchand
  - [ ] Sauvegarder dans `tests/fixtures/sms.ts`

### Jour 12 — Parser MTN MoMo
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] Squelette de fonction `parseSmsMTN(text)` avec TODO [TOI] (CLAUDE)
  - [ ] Regex pour cas "envoi" (MOI, indices CLAUDE)
  - [ ] Regex pour les 3 autres cas (MOI)
  - [ ] Tests unitaires par cas (MOI)

### Jour 13 — Parser Orange Money
- **Mode :** 🟢 Tuteur (tu as déjà la méthode du Jour 12)
- **Tâches :**
  - [ ] `parseSmsOrange(text)` complet (MOI seule)
  - [ ] CLAUDE review et propose améliorations

### Jour 14 — Dispatcher + détection auto opérateur
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] Fonction `parseSms(text)` qui détecte l'opérateur (ENSEMBLE)
  - [ ] Gestion des cas non reconnus (fallback) (MOI)

### Jour 15 — UI de collage SMS
- **Mode :** 🟢 Tuteur
- **Tâches :**
  - [ ] Textarea + bouton "Parser" (MOI)
  - [ ] Preview de la dépense parsée + bouton "Confirmer" (MOI)

---

## Semaine 4 — IA Groq (vocal + parsing intelligent) (Jours 16-20)
**Objectif :** dictée vocale → dépense structurée via Whisper + Llama.
**Concepts à maîtriser :** Edge Functions Deno, prompts JSON, MediaRecorder API, streaming audio.

### Jour 16 — Setup Edge Function
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] `supabase functions new transcribe` (MOI)
  - [ ] Squelette Deno + secret `GROQ_API_KEY` (ENSEMBLE)
  - [ ] Premier hello-world déployé (MOI)

### Jour 17 — Intégration Groq + system prompt
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] Appel Llama 3.3 avec prompt JSON structuré (ENSEMBLE — CLAUDE écrit prompt initial, MOI affine)
  - [ ] Validation zod côté Edge Function (MOI)

### Jour 18 — Whisper Large v3 Turbo
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] Endpoint qui prend un fichier audio et renvoie texte (ENSEMBLE)
  - [ ] Tests avec audio fixture (MOI)

### Jour 19 — MediaRecorder côté client
- **Mode :** 🟢 Tuteur
- **Tâches :**
  - [ ] Hook `useAudioRecorder` (MOI, CLAUDE explique l'API)
  - [ ] Gestion permissions + erreurs (MOI)

### Jour 20 — UI hold-to-record + feedback haptique
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] Bouton hold-to-record avec animation (MOI)
  - [ ] `navigator.vibrate` au début/fin (MOI)

---

## Semaine 5 — Visualisations (Jours 21-25)
**Objectif :** comprendre où passe l'argent en un coup d'œil.
**Concepts à maîtriser :** Recharts, agrégations JS, calculs de projection.

### Jour 21 — Setup Recharts + Spending Pulse
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] Agrégation par jour sur 7 jours (ENSEMBLE)
  - [ ] `LineChart` Recharts (MOI)

### Jour 22 — Coût horaire équivalent
- **Mode :** 🟢 Tuteur
- **Tâches :**
  - [ ] Calcul : montant / (revenu_mensuel / heures_travaillées_mois) (MOI)
  - [ ] UI : "Ce repas = 2h45 de ton travail" (MOI)

### Jour 23 — Projection fin de mois
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] Algorithme (moyenne mobile + reste du mois) (ENSEMBLE)
  - [ ] UI alerte si dépassement budget (MOI)

### Jour 24 — Onboarding revenu mensuel
- **Mode :** 🟢 Tuteur
- **Tâches :**
  - [ ] Wizard 3 étapes (revenu, heures travaillées, budget) (MOI)
  - [ ] Stockage Supabase `profiles` (MOI)

### Jour 25 — Polish visualisations
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] Animations + skeletons (MOI)
  - [ ] Empty states (MOI)

---

## Semaine 6 — Web Share Target + PWA (Jours 26-30)
**Objectif :** installer l'app, recevoir des partages depuis WhatsApp.
**Concepts à maîtriser :** manifest, service worker, share_target, Web Push.

### Jour 26 — Manifest PWA complet
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] Générer icônes 192/512 + maskable (CLAUDE indique outils, MOI génère)
  - [ ] Screenshots manifest (MOI)
  - [ ] Audit Lighthouse PWA (MOI)

### Jour 27 — Share Target Handler
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] `share_target` dans manifest (ENSEMBLE)
  - [ ] Route `/share` qui reçoit texte/fichier (MOI)
  - [ ] Routing vers parser SMS ou transcription (MOI)

### Jour 28 — Installation prompt custom
- **Mode :** 🟢 Tuteur
- **Tâches :**
  - [ ] Hook `useInstallPrompt` (MOI)
  - [ ] UI banner d'installation (MOI)

### Jour 29 — Notifications push
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] Web Push subscribe (ENSEMBLE)
  - [ ] Edge Function `send-reminder` (MOI)

### Jour 30 — Audit Lighthouse final
- **Mode :** 🟢 Tuteur
- **Tâches :**
  - [ ] Atteindre 90+ sur les 4 catégories (MOI)
  - [ ] Documenter optimisations dans JOURNAL.md (MOI)

---

## Semaine 7 — Sécurité (Jours 31-35)
**Objectif :** données utilisateur protégées même en cas de fuite.
**Concepts à maîtriser :** RLS strict, Web Crypto API, pseudonymisation, rate limiting.

### Jour 31 — RLS complet
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] Policies par table (`expenses`, `profiles`, etc.) (ENSEMBLE)
  - [ ] Tests des policies avec un 2e user (MOI)

### Jour 32 — Chiffrement côté client
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] Web Crypto API : génération clé dérivée du password (CLAUDE explique, MOI code)
  - [ ] Chiffrer le champ `note` avant envoi (MOI)

### Jour 33 — Pseudonymisation avant Groq
- **Mode :** 🟢 Tuteur
- **Tâches :**
  - [ ] Remplacer noms/numéros par tokens avant l'appel IA (MOI)
  - [ ] Re-substituer côté client (MOI)

### Jour 34 — Rate limiting Edge Functions
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] Compteur par user dans table `rate_limits` (ENSEMBLE)
  - [ ] Réponse 429 si dépassement (MOI)

### Jour 35 — Mode "incognito"
- **Mode :** 🟢 Tuteur
- **Tâches :**
  - [ ] Toggle dans settings (MOI)
  - [ ] Saisies locales uniquement, jamais Supabase (MOI)

---

## Semaine 8 — Production & Portfolio (Jours 36-40)
**Objectif :** projet présentable pour portfolio et entretiens.
**Concepts à maîtriser :** E2E testing, observabilité, communication technique.

### Jour 36 — Tests E2E Playwright
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] Setup Playwright (CLAUDE)
  - [ ] Scénario 1 : login + add expense manuel (MOI)
  - [ ] Scénario 2 : parser SMS + confirmer (MOI)
  - [ ] Scénario 3 : offline → sync (ENSEMBLE)

### Jour 37 — Sentry monitoring
- **Mode :** 🟢 Tuteur
- **Tâches :**
  - [ ] Setup Sentry + source maps (MOI)
  - [ ] Tester un error boundary (MOI)

### Jour 38 — Page de démo publique
- **Mode :** 🟡 Pair
- **Tâches :**
  - [ ] User demo (mock data, lecture seule) (ENSEMBLE)
  - [ ] Bouton "Try demo" (MOI)

### Jour 39 — README portfolio
- **Mode :** 🟢 Tuteur
- **Tâches :**
  - [ ] Sections : pitch, stack, archi (diagramme Mermaid), screenshots, démo live (MOI)
  - [ ] GIF démo enregistré (MOI)

### Jour 40 — Article de blog
- **Mode :** 🟢 Tuteur
- **Tâches :**
  - [ ] MOI rédige l'article (challenges, choix techniques, ce que j'ai appris)
  - [ ] CLAUDE review et propose améliorations rédactionnelles
