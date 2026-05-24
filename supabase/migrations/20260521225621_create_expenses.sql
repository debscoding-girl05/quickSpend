-- Migration: create_expenses
-- Crée la table `expenses` + active RLS + accorde les permissions à l'API.
-- Les policies RLS seront ajoutées dans la migration suivante (étape 4 du Jour 2).

-- =============================================================================
-- 1. CREATE TABLE expenses
-- =============================================================================
-- TODO [TOI] : écris le CREATE TABLE public.expenses (...).
--
-- Colonnes à inclure (revois notre discussion sur le schéma) :
--   id          → uuid, clé primaire, défaut = gen_random_uuid()
--   user_id     → uuid, NOT NULL, référence à auth.users(id) avec ON DELETE CASCADE
--                 (raison du CASCADE : si l'user est supprimé, ses dépenses partent avec)
--   amount      → integer, NOT NULL, CHECK (amount > 0)
--                 (pas de dépense de 0 ou négative — ça n'a pas de sens métier)
--   category    → text, NOT NULL
--   merchant    → text, nullable (parfois inconnu, ex: dictée vocale floue)
--   note        → text, nullable
--   source      → text, NOT NULL, CHECK (source IN ('manual', 'sms', 'voice'))
--   created_at  → timestamptz, NOT NULL, DEFAULT now()
--
-- Syntaxe d'aide :
--   CREATE TABLE public.nom_table (
--     colonne1 TYPE contraintes,
--     colonne2 TYPE contraintes REFERENCES autre_table(colonne) ON DELETE action,
--     ...
--     CHECK (expression)
--   );

-- ⬇️ À toi d'écrire :

CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL CHECK (amount > 0),
  category text NOT NULL,
  merchant text,
  note text,
  source text NOT NULL CHECK (source IN ('manual', 'sms', 'voice')),
  created_at timestamptz NOT NULL DEFAULT now()
);



-- =============================================================================
-- 2. Enable Row Level Security
-- =============================================================================
-- Important : RLS est peut-être déjà activée automatiquement (option "Enable automatic RLS"
-- cochée à la création du projet). Mais on l'écrit explicitement dans la migration
-- pour que le schéma soit auto-suffisant — si on rejoue cette migration ailleurs
-- (autre projet Supabase, env de test), RLS sera quand même active.
-- L'instruction est idempotente : pas d'erreur si déjà activée.
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;


-- =============================================================================
-- 3. Grants : exposer la table à l'API REST de Supabase
-- =============================================================================
-- Rappel : on a désactivé "Automatically expose new tables" à la création du projet.
-- Donc il faut donner explicitement les droits aux rôles utilisés par PostgREST :
--   - `anon`          : utilisateur NON connecté (anon key)
--   - `authenticated` : utilisateur connecté (JWT valide)
-- Sans ces GRANT, supabase-js renverrait "permission denied for table expenses".
--
-- On donne TOUS les droits CRUD aux deux rôles, parce que c'est la RLS qui filtre
-- ligne par ligne. Sans policy correspondante, le rôle ne peut RIEN faire malgré
-- ce GRANT (deny-by-default de la RLS).
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO anon, authenticated;


-- =============================================================================
-- 4. Index utiles
-- =============================================================================
-- Index sur user_id : la RLS filtrera par user_id sur CHAQUE requête → on veut
-- que Postgres trouve les lignes de l'user vite. Sans cet index, scan séquentiel
-- de toute la table à chaque SELECT.
CREATE INDEX IF NOT EXISTS expenses_user_id_idx ON public.expenses (user_id);

-- Index sur created_at descendant : on listera les dépenses du plus récent au plus ancien.
CREATE INDEX IF NOT EXISTS expenses_created_at_idx ON public.expenses (created_at DESC);
