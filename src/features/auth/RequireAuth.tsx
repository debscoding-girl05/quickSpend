import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import useAuth from '@/hooks/useAuth';

/**
 * Composant garde-fou pour les routes protégées.
 *
 * Usage :
 *   <Route path="/expenses" element={<RequireAuth><Expenses /></RequireAuth>} />
 *
 * 3 cas à gérer :
 *  1. loading = true        → afficher un loader (sinon flicker vers /login au refresh)
 *  2. pas de session        → rediriger vers /login (en gardant l'URL d'origine
 *                              pour pouvoir y revenir après connexion)
 *  3. session présente      → afficher children normalement
 */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  // TODO [TOI] : Cas 1 — si loading, return un loader simple
  //   return <p>...</p>; ou un composant Loader stylé Tailwind
  //
  // Pourquoi c'est important : au démarrage, useAuth() commence avec
  // session=null + loading=true. Sans ce check, on redirigerait l'user
  // vers /login pendant 200ms avant que la session se charge → flash visuel.

  // ⬇️ À toi :
   
  if(loading) return <p>Loading...</p>;



  // TODO [TOI] : Cas 2 — si !session, rediriger vers /login.
  //
  // Utilise : return <Navigate to="/login" replace state={{ from: location }} />;
  //
  // Pourquoi `state={{ from: location }}` : on stocke l'URL d'origine pour
  // que la page Login puisse rediriger vers là où l'user voulait aller
  // (on n'utilisera pas cette feature aujourd'hui, mais c'est l'habitude à prendre).
  //
  // Pourquoi `replace` : on remplace l'entrée dans l'historique au lieu d'en
  // ajouter une. Sinon le bouton "back" du navigateur ferait revenir sur la
  // page protégée → boucle infinie.

  // ⬇️ À toi :
 
  if(!session) return <Navigate to="/login" replace state={{ from: location }} />;

  // Cas 3 — session OK
  return <>{children}</>;
}
