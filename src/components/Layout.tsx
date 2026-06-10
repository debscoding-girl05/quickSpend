import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

/**
 * Layout principal pour toutes les pages connectées.
 *
 * - <Outlet /> = slot où react-router injecte la page courante selon l'URL
 * - <BottomNav /> = barre de navigation fixée en bas (mobile-first)
 * - pb-16 = padding-bottom pour que le contenu ne soit pas caché derrière la nav
 */
export default function Layout() {
  return (
    <div className="min-h-screen pb-20">
      <Outlet />
      <BottomNav />
    </div>
  );
}
