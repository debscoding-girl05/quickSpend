import useAuth from '@/hooks/useAuth';

// Page Réglages minimaliste — pour l'instant juste le user + déconnexion.
// On l'enrichira (revenu mensuel, mode incognito, etc.) au fil des semaines.
export default function Settings() {
  const { user, signOut } = useAuth();
  return (
    <main className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Réglages</h1>
      <div>
        <p className="text-sm text-ink-muted">Connectée en tant que</p>
        <p className="font-medium">{user?.email}</p>
      </div>
      <button
        onClick={() => signOut()}
        className="px-4 py-3 bg-ink text-white rounded-lg"
      >
        Se déconnecter
      </button>
    </main>
  );
}
