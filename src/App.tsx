import { Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import AuthCallback from '@/pages/AuthCallback';
import RequireAuth from '@/features/auth/RequireAuth';
import useAuth from '@/hooks/useAuth';

/**
 * Petite home temporaire pour le Jour 3 — uniquement pour tester l'auth.
 * On la remplacera au Jour 4 par le vrai layout avec bottom nav.
 */
function Home() {
  const { user, signOut } = useAuth();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 gap-4">
      <h1 className="text-2xl font-bold">Connectée !</h1>
      <p className="text-ink-muted">{user?.email}</p>
      <button
        onClick={() => signOut()}
        className="px-4 py-2 bg-ink text-white rounded-lg"
      >
        Se déconnecter
      </button>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
