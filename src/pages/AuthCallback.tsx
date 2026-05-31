import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

/**
 * Page d'atterrissage après clic sur le magic link.
 *
 * Ce que fait Supabase tout seul (grâce à `detectSessionInUrl: true` dans supabase.ts) :
 *  - lit le token dans l'URL
 *  - l'échange contre une session
 *  - déclenche onAuthStateChange → notre AuthProvider met à jour `session`
 *
 * Notre seul boulot ici : ATTENDRE que `session` devienne non-null,
 * puis REDIRIGER vers la home. Si l'user arrive sur cette page sans token
 * (ex: lien expiré), on laisse `loading` finir puis on redirige vers /login.
 */
export default function AuthCallback() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // on attend que getSession() ait fini

    if (session) {
      navigate('/', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [session, loading, navigate]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-ink-muted">Connexion en cours…</p>
    </main>
  );
}
