import { NavLink } from 'react-router-dom';
import {
  Home24Regular,
  Home24Filled,
  Receipt24Regular,
  Receipt24Filled,
  DataBarVertical24Regular,
  DataBarVertical24Filled,
  Settings24Regular,
  Settings24Filled,
} from '@fluentui/react-icons';

/**
 * Bottom nav mobile-first.
 *
 * Fixée en bas, 4 onglets. L'onglet actif s'affiche avec l'icône "Filled"
 * (variante pleine de Fluent UI), les autres avec l'icône "Regular" (outline).
 *
 * NavLink (vs Link) : sait si le path matche l'URL courante.
 * Le callback className/style reçoit { isActive: boolean }.
 */

// Type pour la config des onglets (déclaré une fois, réutilisé dans le map)
type NavItem = {
  to: string;
  label: string;
  iconRegular: React.ComponentType<{ className?: string }>;
  iconFilled: React.ComponentType<{ className?: string }>;
};

// TODO [TOI] : remplis le tableau `items` avec 4 entrées.
//
// Onglets attendus :
//   1. { to: '/',         label: 'Accueil',  iconRegular: Home24Regular,         iconFilled: Home24Filled }
//   2. { to: '/expenses', label: 'Dépenses', iconRegular: Receipt24Regular,      iconFilled: Receipt24Filled }
//   3. { to: '/stats',    label: 'Stats',    iconRegular: DataBarVertical24Regular, iconFilled: DataBarVertical24Filled }
//   4. { to: '/settings', label: 'Réglages', iconRegular: Settings24Regular,     iconFilled: Settings24Filled }

// ⬇️ À toi :
const items: NavItem[] = [
  { to: '/',         label: 'Accueil',  iconRegular: Home24Regular,         iconFilled: Home24Filled },
  { to: '/expenses', label: 'Dépenses', iconRegular: Receipt24Regular,      iconFilled: Receipt24Filled },
  { to: '/stats',    label: 'Stats',    iconRegular: DataBarVertical24Regular, iconFilled: DataBarVertical24Filled },
  { to: '/settings', label: 'Réglages', iconRegular: Settings24Regular,     iconFilled: Settings24Filled }
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe">
      <ul className="flex justify-around items-stretch">
        {items.map((item) => (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                end={item.to === '/'}                         // ← important pour "/", voir Q ci-dessous
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-2 gap-1
                   ${isActive ? 'text-brand-600' : 'text-ink-muted'}`
                }
              >
                {({ isActive }) => {
                  const Icon = isActive ? item.iconFilled : item.iconRegular;
                  return (
                    <>
                      <Icon className="w-6 h-6" />
                      <span className="text-xs">{item.label}</span>
                    </>
                  );
                }}
              </NavLink>
            </li>
        
        ))}

      </ul>
    </nav>
  );
}
