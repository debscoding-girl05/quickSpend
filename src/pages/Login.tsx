import { useState, type FormEvent } from 'react';
import useAuth from '@/hooks/useAuth';

/**
 * Page de connexion par magic link.
 *
 * UX :
 *  - L'user tape son email
 *  - Clic "Envoyer le lien" → on appelle signIn()
 *  - Pendant l'envoi : bouton désactivé + texte "Envoi..."
 *  - Après succès : message "Vérifie ta boîte mail"
 *  - Si erreur : afficher le message
 */
export default function Login() {
  const { signIn } = useAuth();

  // ─── State du form ─────────────────────────────────────────────────────
  // TODO [TOI] : déclare 3 useState
  //   - email: string                (initial '')
  //   - status: 'idle' | 'sending' | 'sent' | 'error'  (initial 'idle')
  //   - errorMessage: string         (initial '')
  //
  // Indice TS pour status :
  //   const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  // ⬇️ À toi :


  const [email, setEmail] = useState('');  // ─── Handler de submit ──────────────────────────────────────────────────
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  // TODO [TOI] : écris handleSubmit qui :
  //   1. Empêche le rechargement de la page (e.preventDefault())
  //   2. Passe status à 'sending'
  //   3. Try : await signIn(email)  →  setStatus('sent')
  //   4. Catch : setStatus('error') + setErrorMessage(err.message)
  //
  // Squelette :
  //
  // async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   setStatus('sending');
  //   try {
  //     await signIn(email);
  //     setStatus('sent');
  //   } catch (err) {
  //     setStatus('error');
  //     setErrorMessage(err instanceof Error ? err.message : 'Erreur inconnue');
  //   }
  // }
  //
  // ⚠️ Pourquoi `err instanceof Error` ? En TS strict, le `err` d'un catch
  // est typé `unknown`. On vérifie qu'il est bien une Error avant de lire .message.

  // ⬇️ À toi :

    async function handleSubmit(e:FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setStatus('sending');
      try {
        await signIn(email);
        setStatus('sent');
      } catch (err) {
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Erreur inconnue');
      }
    }

  // ─── Render ─────────────────────────────────────────────────────────────
  // TODO [TOI] : écris le JSX. Structure attendue :
  //
  //   <main className="min-h-screen flex items-center justify-center px-6">
  //     <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
  //       <h1>...</h1>
  //       <input
  //         type="email"
  //         required
  //         value={email}
  //         onChange={(e) => setEmail(e.target.value)}
  //         placeholder="ton@email.com"
  //         className="w-full px-4 py-3 border rounded-lg"
  //         disabled={status === 'sending' || status === 'sent'}
  //       />
  //       <button
  //         type="submit"
  //         disabled={status === 'sending' || status === 'sent'}
  //         className="w-full px-4 py-3 bg-brand-500 text-white rounded-lg disabled:opacity-50"
  //       >
  //         {status === 'sending' ? 'Envoi...' : 'Recevoir le lien'}
  //       </button>
  //
  //       {/* TODO [TOI] : afficher message selon status */}
  //       {/* - si 'sent' : "✅ Vérifie ta boîte mail" */}
  //       {/* - si 'error' : afficher errorMessage en rouge */}
  //
  //     </form>
  //   </main>

  // ⬇️ À toi :
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Connexion</h1>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.com"
          className="w-full px-4 py-3 border rounded-lg"
          disabled={status === 'sending' || status === 'sent'}
        />
        <button
          type="submit"
          disabled={status === 'sending' || status === 'sent'}
          className="w-full px-4 py-3 bg-brand-500 text-white rounded-lg disabled:opacity-50"
        >
          {status === 'sending' ? 'Envoi...' : 'Recevoir le lien'}
        </button>

        {status === 'sent' && <p className="text-green-500">Vérifie ta boîte mail</p>}
        {status === 'error' && <p className="text-red-500">{errorMessage}</p>}
      </form>
    </main>
  );
}
