-- Migration: create_expenses_policies
-- Ajoute les 4 policies RLS sur public.expenses.
-- Règle métier unique : un user ne peut toucher QUE ses propres dépenses
-- (lignes où expenses.user_id = auth.uid()).

-- =============================================================================
-- 1. SELECT policy — je te montre l'exemple complet
-- =============================================================================
-- Lecture : un user authentifié ne voit que les lignes dont il est propriétaire.
-- USING uniquement (pas de WITH CHECK : on ne crée rien).
CREATE POLICY "expenses_select_own"
  ON public.expenses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);


-- =============================================================================
-- 2. INSERT policy — TODO [TOI]
-- =============================================================================
-- Règle : un user peut créer une dépense UNIQUEMENT si user_id = lui-même.
-- Empêche qu'Alice puisse créer une dépense au nom de Bob.
--
-- Indices :
--   - FOR INSERT
--   - WITH CHECK uniquement (pas de USING : la ligne n'existe pas encore)
--   - Condition : la même que SELECT
--
-- Nom suggéré pour la policy : "expenses_insert_own"

-- ⬇️ À toi :

CREATE POLICY "expenses_insert_own"
  ON public.expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- 3. UPDATE policy — TODO [TOI] (la plus piégeuse)
-- =============================================================================
-- Règle : un user peut modifier UNIQUEMENT ses propres dépenses,
-- ET ne peut pas changer le user_id (ne peut pas "donner" sa dépense à un autre).
--
-- Indices :
--   - FOR UPDATE
--   - USING = "quelles lignes existantes ai-je le droit de modifier ?"
--   - WITH CHECK = "à quoi doit ressembler la ligne APRÈS modif ?"
--   - Les DEUX conditions sont les mêmes ici : auth.uid() = user_id
--
-- Nom suggéré : "expenses_update_own"

-- ⬇️ À toi :

CREATE POLICY "expenses_update_own"
  ON public.expenses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- =============================================================================
-- 4. DELETE policy — TODO [TOI]
-- =============================================================================
-- Règle : un user peut supprimer UNIQUEMENT ses propres dépenses.
--
-- Indices :
--   - FOR DELETE
--   - USING uniquement (on ne crée/modifie rien, on supprime)
--
-- Nom suggéré : "expenses_delete_own"

-- ⬇️ À toi :

CREATE POLICY "expenses_delete_own"
  ON public.expenses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
