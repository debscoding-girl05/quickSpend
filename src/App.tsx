import { Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import AuthCallback from '@/pages/AuthCallback';
import Expenses from '@/pages/Expenses';
import Stats from '@/pages/Stats';
import Settings from '@/pages/Settings';
import Layout from '@/components/Layout';
import RequireAuth from '@/features/auth/RequireAuth';
import BigAddButton from '@/features/expenses/BigAddButton';

function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Accueil</h1>
      <p className="text-ink-muted mt-2">Touche le + en bas pour saisir une dépense.</p>
      <BigAddButton />
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Routes connectées : RequireAuth + Layout englobent tout */}
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
