import { useContext } from 'react';
import { AuthContext } from '@/features/auth/AuthProvider';

/**
 * Hook pour accéder à la session et aux actions auth.
 *
 * Lance une erreur si on l'utilise hors d'un <AuthProvider>, parce que
 * c'est un bug de structure qu'on veut voir tout de suite (pas au runtime
 * dans une feature obscure).
 */
// TODO [TOI] : écris la fonction useAuth().
//
// Étapes :
//   1. const ctx = useContext(AuthContext);
//   2. if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
//   3. return ctx;
//
// Le `throw` permet à TypeScript de narrow le type : après ce check,
// TS sait que ctx est `AuthContextValue` (non-null). Tu n'auras pas
// à ajouter `?.` partout dans le code qui utilise useAuth().

// ⬇️ À toi :

const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return ctx;
};

export default useAuth;
