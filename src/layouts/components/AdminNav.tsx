import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserCheck, ShieldCheck } from 'lucide-react';

export function AdminNav() {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => {
    if (route === '/admin' && path === '/admin') return true;
    if (route !== '/admin' && path.startsWith(route)) return true;
    return false;
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Instructor Verification', path: '/admin/instructors', icon: UserCheck },
    { label: 'Course Moderation', path: '/admin/courses', icon: ShieldCheck },
  ];

  return (
    <nav className="flex items-center gap-1 border-b border-rule pb-2 mb-6 overflow-x-auto text-xs font-mono">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-none transition-all shrink-0 cursor-pointer border ${
              active
                ? 'bg-action-bg text-action-text border-action-border font-medium'
                : 'text-muted border-transparent hover:text-foreground hover:bg-wash'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
