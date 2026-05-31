import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// =============================================================================
// Type du contexte exposé
// =============================================================================
export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// =============================================================================
// Création du contexte (valeur par défaut = null, on castera côté hook)
// =============================================================================
// Pourquoi null par défaut : si un composant utilise useAuth() hors du Provider,
// on veut crasher tôt avec un message clair (dans useAuth.ts).
export const AuthContext = createContext<AuthContextValue | null>(null);

// =============================================================================
// Provider — c'est lui qu'on enroule autour de <App />
// =============================================================================
export function AuthProvider({ children }: { children: ReactNode }) {
  // ─── State ─────────────────────────────────────────────────────────────────
  // TODO [TOI] : déclare 2 useState
  //   - session: Session | null  (initial null)
  //   - loading: boolean         (initial true — on n'a pas encore checké)

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);


  
  //
  // Indice : const [session, setSession] = useState<Session | null>(null);

  // ⬇️ À toi :


  // ─── Effet : récupérer la session existante + écouter les changements ─────
  // Cet effet doit faire DEUX choses au mount :
  //   1. Récupérer la session actuelle via supabase.auth.getSession()
  //      → met à jour `session` et passe `loading` à false



  //   2. S'abonner à supabase.auth.onAuthStateChange() pour être notifié
  //      quand la session change (login, logout, refresh token).
  //      → met à jour `session` à chaque event

  

  //
  // ⚠️ Cleanup : onAuthStateChange retourne { data: { subscription } }.
  //    Il faut return une fonction qui appelle subscription.unsubscribe()
  //    pour éviter une fuite mémoire si AuthProvider est démonté.
  //
  // Squelette :
  //
   useEffect(() => {
     // 1. Session initiale
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
   });
  //
    // 2. Listener
     const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
         setSession(newSession);
      }
    );
  //
    // 3. Cleanup
    return () => subscription.unsubscribe();
  }, []); // dépendances vides : on s'abonne une seule fois au mount

  // ⬇️ À toi de coller (et de comprendre chaque ligne avant) :


  // ─── Actions ──────────────────────────────────────────────────────────────
  // TODO [TOI] : écris signIn(email) qui appelle supabase.auth.signInWithOtp
  //
  // signature : async (email: string) => Promise<void>
  // logique :
  //   const { error } = await supabase.auth.signInWithOtp({
  //     email,
  //     options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  //   });
  //   if (error) throw error;  // on laisse le composant Login afficher le message
  //
  // Note : pas besoin de toucher au state ici. Le listener onAuthStateChange
  // s'occupera de mettre à jour `session` quand l'user cliquera le lien.

  // ⬇️ À toi :

   const signIn = async (email: string) =>{
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },

    });
    if (error) throw error;
   };
  
  


  // TODO [TOI] : écris signOut() qui appelle supabase.auth.signOut
  //
  // const { error } = await supabase.auth.signOut();
  // if (error) throw error;

  // ⬇️ À toi :

 
const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  
}

  // ─── Valeur du contexte ───────────────────────────────────────────────────
  // TODO [TOI] : construis l'objet à passer au Provider.
  // const value: AuthContextValue = {
  //   session,
  //   user: session?.user ?? null,
  //   loading,
  //   signIn,
  //   signOut,
  // };

  // ⬇️ À toi :

  const value : AuthContextValue = {
    session,
    user: session?.user ?? null,
    loading,
    signIn,
    signOut,
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  // return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

  // ⬇️ À toi :
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
   